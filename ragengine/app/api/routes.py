from fastapi import APIRouter, HTTPException, Depends
from app.schemas import (
    AddDocumentRequest, AddDocumentResponse,
    QueryRequest, QueryResponse,
    ClearDocumentsRequest, ClearDocumentsResponse
)
from app.services.ingestion import IngestionService
from app.services.query import QueryService
from app.services.pinecone import PineconeService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# dependency injection could be improved, but instantiating here is fine for this scale
ingestion_service = IngestionService()
query_service = QueryService()
pinecone_service = PineconeService()

@router.post("/add_document", response_model=AddDocumentResponse)
async def add_document(request: AddDocumentRequest):
    try:
        count = 0
        if request.text:
            count = await ingestion_service.ingest_text(request.text, request.user_id)
        elif request.file_url:
            count = await ingestion_service.ingest_url(request.file_url, request.user_id)
        else:
            raise HTTPException(status_code=400, detail="Either text or file_url must be provided")
            
        return AddDocumentResponse(
            status="success",
            chunks_added=count,
            message=f"Successfully processed document into {count} chunks"
        )
    except Exception as e:
        logger.error(f"Error in add_document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        answer = await query_service.query(request.query, request.user_id, request.history)
        return QueryResponse(answer=answer)
    except Exception as e:
        logger.error(f"Error in query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear_user_documents", response_model=ClearDocumentsResponse)
async def clear_documents(request: ClearDocumentsRequest):
    try:
        await pinecone_service.delete_user_vectors(request.user_id)
        return ClearDocumentsResponse(
            status="success",
            message=f"All documents cleared for user {request.user_id}"
        )
    except Exception as e:
        logger.error(f"Error in clear_documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))
