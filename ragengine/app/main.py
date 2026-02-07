from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from .routes import router
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Polisense RAG Engine",
    description="LLM-powered query-retrieval microservice",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth dependency
async def verify_token(authorization: str = Header(None)):
    # Allow health check without auth if needed, but here we apply globally to router
    if os.getenv("SKIP_AUTH", "false").lower() == "true":
        return "skipped"
        
    if not authorization or not authorization.startswith("Bearer "):
        # Log warning but don't crash dev flow if possible, or strictly enforce
        logger.warning("Missing auth header")
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    expected_token = os.getenv("BEARER_TOKEN")
    
    if token != expected_token:
        logger.warning("Invalid token provided")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return token

# Check if using prefix or root - Backend typically calls root endpoints or specific api/v1
# Based on backend .env (PYTHON_SERVICE_URL=http://localhost:8000), calls are like:
# POST http://localhost:8000/add_document
# So we should NOT rely solely on /api/v1 prefix unless we change backend URL to include it.
# To be safe, we will include the router at ROOT level.

app.include_router(router, dependencies=[Depends(verify_token)]) # Mount at root
# app.include_router(router, prefix="/api/v1", dependencies=[Depends(verify_token)]) # Optional: Mount at /api/v1 as well

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "polisense-rag-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))