import os
# Load env vars FIRST before importing anything else
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import get_settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Polisense RAG V2",
    description="High-performance RAG Engine with Gemini and Pinecone",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Dependency
async def verify_token(authorization: str = Header(None)):
    if settings.SKIP_AUTH:
        return "skipped"
        
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    if token != settings.BEARER_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return token

# Mount Routes
app.include_router(router, dependencies=[Depends(verify_token)])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0", "service": "rag-engine-v2"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
