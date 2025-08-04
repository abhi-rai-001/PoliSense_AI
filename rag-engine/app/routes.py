import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Request, status
from pydantic import BaseModel, Field

# Import modules
from embeddings.pinecone_embedder import search_similar_chunks
from llm.gemini_query import query_gemini
from utils.chunking import process_document
from utils.traceability import extract_traceability_info

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("routes")

# Initialize router
router = APIRouter()

# Initialize token statistics
token_stats = {
    "total_tokens": 0,
    "prompt_tokens": 0,
    "response_tokens": 0,
    "efficiency_ratio": 0.0
}

# Request models
class Question(BaseModel):
    documents: str = Field(..., description="URL or content of the document (PDF, DOCX, or email)")
    questions: List[str] = Field(..., description="List of questions to answer")
    document_id: Optional[str] = Field(None, description="Optional document ID for traceability")

# Response models
class TraceabilityInfo(BaseModel):
    clause_id: Optional[str] = None
    text: str
    page: Optional[int] = None

class Answer(BaseModel):
    answer: str
    traceability: TraceabilityInfo
    confidence: float
    explanation: Optional[str] = None

class AnswerResponse(BaseModel):
    answers: List[Answer]

# Health check endpoint
@router.get("/health")
async def health_check():
    return {
        "status": "OK",
        "version": "1.0.0",
        "token_stats": token_stats
    }

# Token statistics endpoint
@router.get("/token-stats")
async def get_token_stats():
    return token_stats

# Main endpoint for answering questions
@router.post("/hackrx/run", response_model=AnswerResponse)
async def run_hackrx(request: Question):
    try:
        # Process document if not already processed
        document_id = request.document_id or "doc_" + str(hash(request.documents))[:8]
        
        # Process document and store embeddings
        doc_chunks = await process_document(request.documents, document_id)
        
        # Answer each question
        answers = []
        for question in request.questions:
            # Search for relevant chunks
            relevant_chunks = await search_similar_chunks(question, document_id)
            
            # Query LLM with question and relevant chunks
            result = await query_gemini(question, relevant_chunks)
            
            # Extract traceability information
            traceability = extract_traceability_info(result, relevant_chunks)
            
            # Update token statistics
            token_stats["total_tokens"] += result["total_tokens"]
            token_stats["prompt_tokens"] += result["prompt_tokens"]
            token_stats["response_tokens"] += result["response_tokens"]
            token_stats["efficiency_ratio"] = token_stats["response_tokens"] / token_stats["prompt_tokens"] if token_stats["prompt_tokens"] > 0 else 0
            
            # Create answer object
            answer = Answer(
                answer=result["answer"],
                traceability=TraceabilityInfo(
                    clause_id=traceability["clause_id"],
                    text=traceability["text"],
                    page=traceability["page"]
                ),
                confidence=result["confidence"],
                explanation=result["explanation"]
            )
            
            answers.append(answer)
        
        return {"answers": answers}
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))