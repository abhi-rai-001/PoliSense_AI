import os
import json
import logging
import asyncio
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Import from app modules
from app.embeddings.pinecone_embedder import search_similar_chunks, initialize_pinecone
from app.llm.gemini_query import query_gemini
from app.utils.traceability import extract_traceability_info

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("rag-engine-main")

# Load environment variables
load_dotenv()

# Initialize Pinecone
initialize_pinecone()

async def answer_question(question: str, document_id: str) -> Dict[str, Any]:
    """
    Answer a question based on a document.
    
    Args:
        question: The question to answer
        document_id: The ID of the document to search in
        
    Returns:
        Dictionary containing the answer, confidence, and traceability information
    """
    try:
        # Search for relevant chunks
        relevant_chunks = await search_similar_chunks(question, document_id)
        
        # Query LLM with question and relevant chunks
        result = await query_gemini(question, relevant_chunks)
        
        # Extract traceability information
        traceability = extract_traceability_info(result, relevant_chunks)
        
        # Create answer object
        answer = {
            "answer": result["answer"],
            "confidence": result["confidence"],
            "traceability": {
                "clause_id": traceability["clause_id"],
                "text": traceability["text"],
                "page": traceability["page"]
            },
            "explanation": result.get("explanation"),
            "tokens": {
                "prompt_tokens": result["prompt_tokens"],
                "response_tokens": result["response_tokens"],
                "total_tokens": result["total_tokens"]
            }
        }
        
        return answer
    
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        return {
            "answer": f"Error: {str(e)}",
            "confidence": 0.0,
            "traceability": {
                "clause_id": None,
                "text": "",
                "page": None
            },
            "explanation": None,
            "tokens": {
                "prompt_tokens": 0,
                "response_tokens": 0,
                "total_tokens": 0
            }
        }

# Create embeddings and chunking modules for brutal_test.py
from app.embeddings.pinecone_embedder import store_document_embeddings as store_chunks
from app.embeddings.pinecone_embedder import delete_document
from app.utils.chunking import chunk_text