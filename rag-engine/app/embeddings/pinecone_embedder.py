import os
import logging
import time
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv
# Import from pinecone package for version 7.3.0
from pinecone.pinecone import Pinecone
from pinecone.db_control.models import ServerlessSpec
from pinecone.db_control.enums import CloudProvider, AwsRegion, VectorType

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("pinecone_embedder")

# Initialize Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "hackrx-index")
DIMENSION = 768  # Dimension for Gemini 2.5 Flash embeddings

# Global Pinecone client
pc = None

def initialize_pinecone():
    """
    Initialize Pinecone client and create index if it doesn't exist.
    """
    try:
        global pc
        # Initialize Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Check if index exists, if not create it
        if PINECONE_INDEX_NAME not in pc.list_indexes().names():
            logger.info(f"Creating Pinecone index: {PINECONE_INDEX_NAME}")
            # For free tier, use AWS in us-east-1
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud=CloudProvider.AWS,
                    region=AwsRegion.US_EAST_1
                )
            )
            logger.info(f"Pinecone index {PINECONE_INDEX_NAME} created successfully")
        else:
            logger.info(f"Pinecone index {PINECONE_INDEX_NAME} already exists")
        
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Pinecone: {str(e)}")
        raise

async def generate_embeddings(text: str) -> List[float]:
    """
    Generate embeddings for text using Gemini embedding model.
    
    Args:
        text: Text to generate embeddings for
        
    Returns:
        List of embedding values
    """
    try:
        # Generate embeddings using Gemini
        result = genai.embed_content(model="models/embedding-001", content=text)
        
        # Return embedding values
        return result["embedding"]
    except Exception as e:
        logger.error(f"Failed to generate embeddings: {str(e)}")
        raise

async def store_document_embeddings(chunks: List[Dict[str, Any]], namespace: str = "default") -> int:
    """
    Store document chunks and their embeddings in Pinecone.
    
    Args:
        chunks: List of document chunks with text and metadata
        namespace: Namespace to store vectors in
        
    Returns:
        Number of vectors stored
    """
    try:
        global pc
        # Get Pinecone index
        index = pc.Index(PINECONE_INDEX_NAME)
        
        # Prepare vectors for upsert
        vectors = []
        for i, chunk in enumerate(chunks):
            # Generate embedding for chunk text
            embedding = await generate_embeddings(chunk["text"])
            
            # Create vector ID
            vector_id = f"{chunk['doc_id']}_{i}"
            
            # Create vector with metadata
            vector = {
                "id": vector_id,
                "values": embedding,
                "metadata": {
                    "text": chunk["text"],
                    "doc_id": chunk["doc_id"],
                    "chunk_id": i,
                    "clause_id": chunk.get("clause_id"),
                    "page": chunk.get("page"),
                    "title": chunk.get("title")
                }
            }
            
            vectors.append(vector)
        
        # Upsert vectors in batches of 100
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i+batch_size]
            # Format for Pinecone v7.3.0
            formatted_vectors = [(v["id"], v["values"], v["metadata"]) for v in batch]
            index.upsert(vectors=formatted_vectors, namespace=namespace)
            logger.info(f"Upserted batch {i//batch_size + 1}/{(len(vectors)-1)//batch_size + 1} with {len(batch)} vectors")
        
        return len(vectors)
    except Exception as e:
        logger.error(f"Failed to store document embeddings: {str(e)}")
        raise

async def search_similar_chunks(query: str, doc_id: str, top_k: int = 5, namespace: str = "default") -> List[Dict[str, Any]]:
    """
    Search for chunks similar to the query.
    
    Args:
        query: Query text
        doc_id: Document ID to search in
        top_k: Number of results to return
        namespace: Namespace to search in
        
    Returns:
        List of similar chunks with metadata
    """
    try:
        global pc
        # Get Pinecone index
        index = pc.Index(PINECONE_INDEX_NAME)
        
        # Generate embedding for query
        query_embedding = await generate_embeddings(query)
        
        # Search for similar vectors
        search_results = index.query(
            vector=query_embedding,
            top_k=top_k,
            namespace=namespace,
            filter={"doc_id": {"$eq": doc_id}},
            include_metadata=True
        )
        
        # Extract results
        results = []
        for match in search_results["matches"]:
            results.append({
                "text": match["metadata"]["text"],
                "score": match["score"],
                "doc_id": match["metadata"]["doc_id"],
                "chunk_id": match["metadata"]["chunk_id"],
                "clause_id": match["metadata"].get("clause_id"),
                "page": match["metadata"].get("page"),
                "title": match["metadata"].get("title")
            })
        
        return results
    except Exception as e:
        logger.error(f"Failed to search similar chunks: {str(e)}")
        raise

async def delete_document(doc_id: str, namespace: str = "default") -> bool:
    """
    Delete all vectors for a document.
    
    Args:
        doc_id: Document ID to delete
        namespace: Namespace to delete from
        
    Returns:
        True if successful
    """
    try:
        global pc
        # Get Pinecone index
        index = pc.Index(PINECONE_INDEX_NAME)
        
        # Delete vectors by filter
        index.delete(filter={"doc_id": {"$eq": doc_id}}, namespace=namespace)
        
        logger.info(f"Deleted document {doc_id} from namespace {namespace}")
        
        return True
    except Exception as e:
        logger.error(f"Failed to delete document: {str(e)}")
        raise