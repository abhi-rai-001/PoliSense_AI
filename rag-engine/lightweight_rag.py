import os
import json
import re
from datetime import datetime
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Lightweight RAG Engine", version="1.0.0")

# Configure Google AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# In-memory storage for documents (lightweight alternative to ChromaDB)
documents_db = {}

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

class ClearUserRequest(BaseModel):
    user_id: str

def split_text_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks"""
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > start + chunk_size * 0.7:  # Only break if we're not too early
                chunk = text[start:start + break_point + 1]
                end = start + break_point + 1
        
        chunks.append(chunk.strip())
        start = end - overlap
    
    return chunks

def find_relevant_chunks(query: str, user_documents: List[Dict], top_k: int = 3) -> List[str]:
    """Simple keyword-based search for relevant chunks"""
    query_terms = set(re.findall(r'\b\w+\b', query.lower()))
    relevant_chunks = []
    
    for doc in user_documents:
        content = doc['content'].lower()
        doc_terms = set(re.findall(r'\b\w+\b', content))
        
        # Calculate simple overlap score
        overlap = len(query_terms.intersection(doc_terms))
        if overlap > 0:
            chunks = split_text_into_chunks(doc['content'])
            for chunk in chunks:
                chunk_terms = set(re.findall(r'\b\w+\b', chunk.lower()))
                chunk_overlap = len(query_terms.intersection(chunk_terms))
                if chunk_overlap > 0:
                    relevant_chunks.append({
                        'content': chunk,
                        'score': chunk_overlap,
                        'source': doc['filename']
                    })
    
    # Sort by relevance and return top chunks
    relevant_chunks.sort(key=lambda x: x['score'], reverse=True)
    return [chunk['content'] for chunk in relevant_chunks[:top_k]]

def generate_structured_response(context: str, query: str) -> Dict:
    """Generate structured response using Gemini"""
    prompt = f"""
You are an intelligent document analysis assistant. Analyze the provided document content and answer the user's query with accuracy and a friendly tone.

DOCUMENT CONTENT:
{context}

USER QUERY: {query}

Please analyze the document and provide a response in the following JSON format:
{{
    "decision": "approved/rejected/pending/not_applicable",
    "amount": "amount if applicable, null otherwise",
    "justification": "detailed explanation of the decision",
    "relevant_clauses": ["list of specific clauses or sections that support the decision"],
    "confidence": "high/medium/low",
    "additional_info": "any additional helpful information"
}}

Guidelines:
1. Be thorough in your analysis but concise in your response
2. Use a friendly, professional tone
3. If information is missing or unclear, mention it in the justification
4. Always reference specific parts of the document that support your decision
5. If the query cannot be answered from the document, clearly state this
6. For insurance/policy queries, focus on coverage, eligibility, and claim processing
7. Provide practical, actionable information

Respond only with valid JSON.
"""
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return result
    except Exception as e:
        # Fallback response
        return {
            "decision": "not_applicable",
            "amount": None,
            "justification": f"Analysis completed. {response.text if 'response' in locals() else 'Unable to parse response'}",
            "relevant_clauses": [],
            "confidence": "medium",
            "additional_info": "Response generated successfully"
        }

@app.post("/add_document")
def add_document(data: AddDocument):
    """Add document to in-memory storage"""
    try:
        user_id = data.user_id
        if user_id not in documents_db:
            documents_db[user_id] = []
        
        # Store document
        doc = {
            'doc_id': data.doc_id,
            'content': data.content,
            'filename': data.filename,
            'document_type': data.document_type,
            'timestamp': datetime.now().isoformat()
        }
        
        documents_db[user_id].append(doc)
        
        return {
            "message": "Document added successfully",
            "doc_id": data.doc_id,
            "user_id": user_id,
            "document_count": len(documents_db[user_id])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
def query_documents(data: QueryRequest):
    """Query documents using lightweight RAG"""
    try:
        user_id = data.user_id
        question = data.question
        
        if user_id not in documents_db or not documents_db[user_id]:
            # No documents, provide helpful response
            return {
                "Decision": "Information Only",
                "Amount": "Not applicable",
                "Justification": {
                    "Summary": "No documents uploaded yet. Please upload a document first to get specific analysis."
                },
                "answer": "No documents uploaded yet. Please upload a document first to get specific analysis.",
                "sources": []
            }
        
        # Find relevant chunks
        relevant_chunks = find_relevant_chunks(question, documents_db[user_id])
        
        if not relevant_chunks:
            return {
                "Decision": "Information Only",
                "Amount": "Not applicable",
                "Justification": {
                    "Summary": "No relevant information found in uploaded documents for your query."
                },
                "answer": "No relevant information found in uploaded documents for your query.",
                "sources": []
            }
        
        # Combine relevant chunks
        context = "\n\n".join(relevant_chunks)
        
        # Generate response
        result = generate_structured_response(context, question)
        
        return {
            "Decision": result.get("decision", "Information Only"),
            "Amount": result.get("amount", "Not applicable"),
            "Justification": {
                "Summary": result.get("justification", "No response available"),
                "Clauses": result.get("relevant_clauses", [])
            },
            "answer": result.get("justification", "No answer available"),
            "sources": []
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "lightweight-rag-engine",
        "timestamp": datetime.now().isoformat(),
        "document_count": sum(len(docs) for docs in documents_db.values())
    }

@app.delete("/clear_all_documents")
def clear_all_documents():
    """Clear all documents"""
    global documents_db
    documents_db = {}
    return {"message": "All documents cleared successfully"}

@app.post("/clear_user_documents")
def clear_user_documents(data: ClearUserRequest):
    """Clear documents for specific user"""
    user_id = data.user_id
    if user_id in documents_db:
        del documents_db[user_id]
    return {"message": f"Documents cleared for user {user_id}"}

@app.get("/debug/user/{user_id}")
def debug_user_documents(user_id: str):
    """Debug endpoint to check user documents"""
    if user_id not in documents_db:
        return {"message": "No documents found for user", "documents": []}
    
    docs = documents_db[user_id]
    return {
        "user_id": user_id,
        "document_count": len(docs),
        "documents": [{"filename": doc["filename"], "type": doc["document_type"]} for doc in docs]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 