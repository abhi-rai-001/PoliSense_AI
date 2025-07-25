import os
import re
import json
import time
import uvicorn
from datetime import datetime, timedelta
from typing import Dict, List, Any
from enum import Enum
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import chromadb
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure Google AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize models and database
model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="documents")

# Pydantic models
class QueryRequest(BaseModel):
    question: str
    user_id: str = "anonymous"

class AddDocument(BaseModel):
    doc_id: str
    content: str
    filename: str
    user_id: str = "anonymous"
    document_type: str = "Unknown"

class DeleteDocument(BaseModel):
    doc_id: str

class ClearUserRequest(BaseModel):
    user_id: str

# Quota manager class
class QuotaManager:
    def __init__(self, max_daily_requests=50):
        self.max_daily_requests = max_daily_requests
        self.daily_requests = 0
        self.last_reset = datetime.now()
    
    def can_make_request(self):
        self._reset_if_new_day()
        return self.daily_requests < self.max_daily_requests
    
    def increment_requests(self):
        self._reset_if_new_day()
        self.daily_requests += 1
    
    def _reset_if_new_day(self):
        now = datetime.now()
        if now.date() > self.last_reset.date():
            self.daily_requests = 0
            self.last_reset = now

# Query parser class
class QueryParser:
    def parse_query(self, question: str) -> Dict:
        question_lower = question.lower()
        
        # Determine intent
        intent = "general"
        if any(word in question_lower for word in ["covered", "cover", "eligible", "claim"]):
            intent = "coverage_check"
        elif any(word in question_lower for word in ["how much", "amount", "cost", "price"]):
            intent = "amount_inquiry"
        elif any(word in question_lower for word in ["what is", "explain", "define"]):
            intent = "definition"
        
        # Extract entities
        entities = {
            "coverage_types": [],
            "claim_types": [],
            "amounts": []
        }
        
        # Extract coverage types
        coverage_keywords = ["comprehensive", "collision", "liability", "medical", "dental"]
        for keyword in coverage_keywords:
            if keyword in question_lower:
                entities["coverage_types"].append(keyword)
        
        return {
            "intent": intent,
            "entities": entities,
            "original_question": question
        }

# Initialize global objects
quota_manager = QuotaManager()
query_parser = QueryParser()

# Utility functions
def split_text_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        if end > len(text):
            end = len(text)
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start += chunk_size - overlap
        if start >= len(text):
            break
    
    return chunks

def smart_insurance_chunking(text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
    """Smart chunking for insurance documents"""
    # For now, use regular chunking - can be enhanced later
    return split_text_into_chunks(text, chunk_size, overlap)

@app.post("/add_document")
def add_document(data: AddDocument):
    try:
        added_chunks = []
        
        # Use smart chunking for insurance documents
        if data.document_type and "insurance" in data.document_type.lower():
            chunks = smart_insurance_chunking(data.content, chunk_size=800, overlap=150)
        else:
            chunks = split_text_into_chunks(data.content, chunk_size=1000, overlap=200)
        
        # Determine document type from filename if not provided
        doc_type = data.document_type
        if not doc_type and data.filename:
            if data.filename.endswith('.pdf'):
                doc_type = 'PDF'
            elif data.filename.endswith(('.docx', '.doc')):
                doc_type = 'DOCX'
            elif data.filename.endswith('.eml'):
                doc_type = 'Email'
            else:
                doc_type = 'Unknown'
        
        for i, chunk in enumerate(chunks):
            chunk_id = f"{data.doc_id}_chunk_{i}"
            embedding = model.encode(chunk).tolist()
            
            metadata = {
                "filename": data.filename or "Unknown",
                "user_id": data.user_id or "anonymous",
                "document_type": doc_type or "Unknown",
                "uploaded_at": datetime.now().isoformat(),
                "chunk_index": i,
                "total_chunks": len(chunks),
                "original_doc_id": data.doc_id
            }
            
            collection.add(
                documents=[chunk], 
                ids=[chunk_id], 
                embeddings=[embedding],
                metadatas=[metadata]
            )
            
            added_chunks.append(chunk_id)
        
        return {
            "message": f"Document split into {len(chunks)} chunks and added successfully", 
            "doc_id": data.doc_id,
            "chunks_added": len(chunks),
            "chunk_ids": added_chunks,
            "metadata": {
                "filename": data.filename,
                "document_type": doc_type,
                "uploaded_at": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
def query_documents(data: QueryRequest):
    try:
        # Parse the query for structure and intent
        parsed_query = query_parser.parse_query(data.question)
        
        # Create enhanced search query
        search_query = enhance_search_query(data.question, parsed_query)
        
        embedding = model.encode(search_query).tolist()
        
        # Query documents with user filtering - GET MORE CHUNKS
        result = collection.query(
            query_embeddings=[embedding], 
            n_results=5,  # Increased from 3 to 5
            where={"user_id": data.user_id},
            include=["documents", "metadatas", "distances"]
        )
        
        if not result['documents'] or not result['documents'][0]:
            return {
                "Decision": "Information Only",
                "Amount": "Not applicable", 
                "Justification": {
                    "Summary": "No relevant policy documents found. Please upload your insurance policy document.",
                    "Clauses": [{
                        "Reference": "System Message",
                        "Text": "No documents available for analysis"
                    }]
                },
                "answer": "I don't have access to your policy documents to answer this question."
            }
        
        # Get more relevant chunks for better context
        relevant_chunks = result['documents'][0][:4]  # Increased from 2 to 4
        context = "\n\n".join(relevant_chunks)
        
        # Generate structured response in required format
        structured_response = generate_structured_response(context, parsed_query)
        
        # Add backward compatibility
        simple_answer = structured_response["Justification"]["Summary"]
        
        return {
            **structured_response,  # This includes Decision, Amount, Justification
            "answer": simple_answer,  # For backward compatibility
            "sources": result.get('metadatas', [[]])[0] if result.get('metadatas') else []
        }
        
    except Exception as e:
        print(f"Query error: {e}")
        return {
            "Decision": "Information Only",
            "Amount": "Not applicable",
            "Justification": {
                "Summary": "Technical error occurred while processing your request. Please try again.",
                "Clauses": [{
                    "Reference": "System Error",
                    "Text": "Unable to process request due to technical difficulties"
                }]
            },
            "answer": "I'm experiencing technical difficulties. Please try your question again."
        }

def enhance_search_query(original_query: str, parsed_query: Dict) -> str:
    """Enhanced search query for insurance-specific terms"""
    enhanced_terms = [original_query]
    
    # Add insurance-specific synonyms
    query_lower = original_query.lower()
    
    # Death/accident benefit terms
    if any(term in query_lower for term in ["die", "death", "accident", "road accident"]):
        enhanced_terms.extend([
            "accidental death benefit", "death benefit", "accident coverage",
            "beneficiary", "family benefit", "road accident death",
            "accidental death insurance", "death claim"
        ])
    
    # Coverage terms
    if "covered" in query_lower or "cover" in query_lower:
        enhanced_terms.extend(["eligible", "benefit", "claim", "policy coverage"])
    
    # Benefit amount terms  
    if any(term in query_lower for term in ["benefit", "amount", "receive", "pay"]):
        enhanced_terms.extend([
            "sum insured", "benefit amount", "coverage limit",
            "maximum benefit", "claim amount"
        ])
    
    return " ".join(enhanced_terms)

def generate_structured_response(context: str, parsed_query: Dict) -> Dict:
    print(f"DEBUG: generate_structured_response called with question: {parsed_query['original_question']}")
    
    if not quota_manager.can_make_request():
        print("API quota exceeded, using fallback system")
        return generate_fallback_structured_response(context, parsed_query, quota_exceeded=True)
    
    try:
        print("DEBUG: Attempting to use Gemini AI")
        model_ai = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        intent = parsed_query["intent"]
        entities = parsed_query["entities"]
        question = parsed_query["original_question"]
        
        prompt = f"""You are an insurance claims and policy assistant. Analyze the context and provide a structured response.

Context: {context}

Question: {question}

IMPORTANT: You must respond with a valid JSON object in this EXACT format:

{{
  "Decision": "Approved" | "Rejected" | "Partially Approved" | "Information Only",
  "Amount": "specific amount or calculation method",
  "Justification": {{
    "Summary": "brief explanation of the decision",
    "Clauses": [
      {{
        "Reference": "specific clause reference",
        "Text": "exact clause text from the policy"
      }}
    ]
  }}
}}

Guidelines:
- Decision: Use "Approved" if fully covered, "Rejected" if not covered, "Partially Approved" if conditions/limits apply
- Amount: Extract specific amounts, percentages, or calculation methods (e.g., "50% of actual cost", "$5,000", "Sum Insured limit")
- Summary: Explain why this decision was made in 1-2 sentences
- Clauses: Extract actual clause references and their exact text from the context

Respond ONLY with valid JSON in the exact format above. DO NOT include markdown code blocks or backticks in your response:"""

        response = model_ai.generate_content(prompt)
        print(f"DEBUG: Gemini response received: {response.text[:100]}...")
        quota_manager.increment_requests()
        
        try:
            cleaned_response = response.text.strip()
            if cleaned_response.startswith("```"):
                cleaned_response = re.sub(r'^```(?:json)?\s*', '', cleaned_response)
                cleaned_response = re.sub(r'\s*```$', '', cleaned_response)
            
            print(f"DEBUG: Cleaned response for parsing: {cleaned_response[:100]}...")
            json_response = json.loads(cleaned_response)
            print("DEBUG: JSON parsing successful")
            
            if not all(key in json_response for key in ["Decision", "Amount", "Justification"]):
                raise ValueError("Missing required keys")
                
            return json_response
            
        except Exception as parse_error:
            print(f"JSON parsing failed: {parse_error}")
            print(f"Raw response: {response.text}")
            return generate_fallback_structured_response(context, parsed_query, ai_failed=True)
        
    except Exception as e:
        print(f"Structured response generation error: {e}")
        if "quota" in str(e).lower() or "limit" in str(e).lower() or "exceeded" in str(e).lower():
            print("DEBUG: Quota/limit error detected, using fallback")
            return generate_fallback_structured_response(context, parsed_query, quota_exceeded=True)
        print("DEBUG: API failed, using fallback")
        return generate_fallback_structured_response(context, parsed_query, ai_failed=True)

def generate_fallback_structured_response(context: str, parsed_query: Dict, quota_exceeded: bool = False, ai_failed: bool = False) -> Dict:
    """Enhanced fallback with better insurance-specific parsing"""
    
    intent = parsed_query["intent"]
    question = parsed_query["original_question"].lower()
    context_lower = context.lower()
    
    # Enhanced amount extraction for insurance
    amount_patterns = [
        r'sum insured[:\s]*\$?[\d,]+(?:\.\d{2})?',
        r'benefit[:\s]*\$?[\d,]+(?:\.\d{2})?', 
        r'maximum[:\s]*\$?[\d,]+(?:\.\d{2})?',
        r'\$[\d,]+(?:\.\d{2})?',
        r'\d+%\s*of\s*(?:sum insured|annual income|actual cost)',
        r'up to\s*\$?[\d,]+(?:\.\d{2})?'
    ]
    
    amounts = []
    for pattern in amount_patterns:
        matches = re.findall(pattern, context, re.IGNORECASE)
        amounts.extend(matches)
    
    amount = amounts[0] if amounts else "sum insured"
    
    # Enhanced clause extraction for insurance documents
    clause_patterns = [
        r'(Section\s+[IVX\d]+[^:]*:?[^.]*)',
        r'(Clause\s+[IVX\d]+[^:]*:?[^.]*)',
        r'(Article\s+[IVX\d]+[^:]*:?[^.]*)',
        r'(Benefit\s+[IVX\d]+[^:]*:?[^.]*)',
        r'(Coverage\s+[A-Z][^:]*:?[^.]*)',
        r'(EXCLUSIONS?[^:]*:?[^.]*)',
        r'(Pre-existing[^:]*:?[^.]*)'
    ]
    
    clauses = []
    for pattern in clause_patterns:
        matches = re.findall(pattern, context, re.IGNORECASE)
        for match in matches[:2]:
            clause_start = context.lower().find(match.lower())
            if clause_start != -1:
                clause_text = context[clause_start:clause_start + 300]
                clauses.append({
                    "Reference": match.strip(),
                    "Text": clause_text.strip()
                })
    
    # Enhanced decision logic for insurance
    decision = "Information Only"
    
    # Handle quota exceeded case - SIMPLIFIED MESSAGE
    if quota_exceeded:
        summary = "AI analysis limit reached for today."
        decision = "Information Only"
    elif ai_failed:
        summary = "AI analysis temporarily unavailable."
    else:
        summary = "Information retrieved from your policy documents."
    
    # Pre-existing condition logic
    if any(term in question for term in ["pre-existing", "pre existing", "surgery", "illness", "medical condition"]):
        if quota_exceeded:
            decision = "Information Only"
            summary = "AI analysis limit reached for today."
        elif any(term in context_lower for term in ["pre-existing", "pre existing", "excluded", "not covered", "exclusion", "maternity"]):
            decision = "Rejected"
            summary = "Surgery for pre-existing medical conditions is typically excluded from coverage under travel insurance policies."
        elif any(term in context_lower for term in ["covered", "eligible", "emergency surgery"]):
            decision = "Partially Approved"
            summary = "Emergency surgery may be covered if it's unrelated to pre-existing conditions."
        else:
            summary = "Your policy contains information about pre-existing medical conditions."
    
    elif "death" in question and "accident" in question:
        if any(term in context_lower for term in ["accidental death", "death benefit", "accident benefit"]):
            decision = "Approved"
            summary = "Accidental death benefits are covered under your policy."
        elif any(term in context_lower for term in ["excluded", "not covered"]):
            decision = "Rejected" 
            summary = "Accidental death in road accidents is excluded from coverage."
        else:
            summary = "Policy information regarding accidental death benefits has been located."
    
    elif intent == "coverage_check":
        if any(word in context_lower for word in ["covered", "eligible", "benefit payable"]):
            decision = "Approved"
            summary = "This claim is covered under your policy terms."
        elif any(word in context_lower for word in ["excluded", "not covered", "not eligible"]):
            decision = "Rejected"
            summary = "This claim is not covered based on policy exclusions."
        else:
            summary = "Coverage information has been found in your policy documents."
    
    return {
        "Decision": decision,
        "Amount": amount,
        "Justification": {
            "Summary": summary,
            "Clauses": clauses if clauses else [{
                "Reference": "Policy Terms",
                "Text": context[:200] + "..." if len(context) > 200 else context
            }]
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "quota_status": {
            "requests_used": quota_manager.daily_requests,
            "max_requests": quota_manager.max_daily_requests,
            "requests_remaining": quota_manager.max_daily_requests - quota_manager.daily_requests,
            "reset_date": quota_manager.last_reset.isoformat()
        }
    }

@app.delete("/clear_all_documents")
def clear_all_documents():
    try:
        # Get all document IDs first
        result = collection.get(include=["metadatas"])
        
        if not result['ids']:
            return {"message": "No documents found in database", "documents_deleted": 0}
        
        # Delete all documents
        collection.delete(ids=result['ids'])
        
        return {
            "message": "All documents cleared from vector database",
            "documents_deleted": len(result['ids'])
        }
    except Exception as e:
        print(f"Error clearing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
