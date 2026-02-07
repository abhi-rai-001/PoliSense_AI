from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Union, Dict, Any

class AddDocumentRequest(BaseModel):
    content: str
    user_id: str
    doc_id: Optional[str] = None
    filename: Optional[str] = "document"
    document_type: Optional[str] = "text" # PDF, DOCX, Email, Text

class QueryRequest(BaseModel):
    question: str
    user_id: str
    document_id: Optional[str] = None

class ClearDocumentsRequest(BaseModel):
    user_id: str

class TraceabilityInfo(BaseModel):
    clause_id: str
    text: str
    page: Optional[int] = 1
    confidence: float

class AnswerResponse(BaseModel):
    answer: str
    traceability: TraceabilityInfo
    confidence: float
    explanation: Optional[str] = None
    sources: Optional[List[Dict[str, Any]]] = None
    
    # Flattening structure for backward compatibility/simplicity if needed
    Decision: Optional[str] = None
    Amount: Optional[str] = None
    Justification: Optional[Dict[str, Any]] = None

# Legacy/HackRx-specific (can remove if sure not needed, but keeping for safety)
class HackRxResponse(BaseModel):
    answers: List[AnswerResponse]
    processing_time: float
    document_id: str