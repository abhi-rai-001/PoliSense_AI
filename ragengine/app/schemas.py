from pydantic import BaseModel
from typing import Optional, List

class AddDocumentRequest(BaseModel):
    user_id: str
    text: Optional[str] = None
    file_url: Optional[str] = None

class AddDocumentResponse(BaseModel):
    status: str
    chunks_added: int
    message: str

class QueryRequest(BaseModel):
    user_id: str
    query: str
    history: Optional[list] = None # For future chat history support

class QueryResponse(BaseModel):
    answer: str

class ClearDocumentsRequest(BaseModel):
    user_id: str

class ClearDocumentsResponse(BaseModel):
    status: str
    message: str
