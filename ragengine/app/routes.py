from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import time
import logging
from .services.document_processor import DocumentProcessor
from .services.query_engine import QueryEngine
from .schemas import AddDocumentRequest, QueryRequest, ClearDocumentsRequest, AnswerResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services once (or dependency inject)
# Note: services initialize connections, so better to do it at startup or lazily
doc_processor = DocumentProcessor()
query_engine = QueryEngine()

@router.post("/add_document")
async def add_document(request: AddDocumentRequest):
    try:
        logger.info(f"Adding document for user {request.user_id} (Type: {request.document_type})")
        
        doc_id = await doc_processor.process_document(
            document_input=request.content,
            user_id=request.user_id,
            doc_type=request.document_type.lower()
        )
        
        return {"message": "Document processed successfully", "document_id": doc_id}
    except Exception as e:
        logger.error(f"Error adding document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=AnswerResponse)
async def query_document(request: QueryRequest):
    try:
        logger.info(f"Querying for user {request.user_id}: {request.question}")
        
        response = await query_engine.query(
            question=request.question,
            document_id=request.document_id, # Can be None/Optional
            user_id=request.user_id
        )
        
        # Format response to match what backend expects (Justification structure)
        # The backend expects: Decision, Amount, Justification, answer, sources
        # Our AnswerResponse has: answer, traceability, confidence, explanation
        
        # We'll map the detailed RAG response to these fields
        
        return response
        
    except Exception as e:
        logger.error(f"Error querying: {e}")
        # Return a safe error response structure if possible, 
        # but for 500s we usually just raise
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear_user_documents")
async def clear_documents(request: ClearDocumentsRequest):
    try:
        logger.info(f"Clearing documents for user {request.user_id}")
        await doc_processor.embedder.delete_user_documents(request.user_id)
        return {"message": f"Documents cleared for user {request.user_id}"}
    except Exception as e:
        logger.error(f"Error clearing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check is in main.py, but good to have one in router too if mounted via prefix
@router.get("/health")
async def health_check_route():
    return {"status": "ok"}