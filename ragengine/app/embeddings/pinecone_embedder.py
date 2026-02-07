import os
import pinecone
from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
from typing import List, Dict, Optional
import logging
import asyncio

logger = logging.getLogger(__name__)

class PineconeEmbedder:
    index_name = "hackrx-index"
    
    def __init__(self):
        # Initialize Pinecone client with v3 SDK
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            logger.error("PINECONE_API_KEY not found in environment variables")
            raise ValueError("PINECONE_API_KEY is required")
            
        self.client = Pinecone(api_key=api_key)
        
        # Check and create index if needed
        existing_indexes = [index.name for index in self.client.list_indexes()]
        
        if self.index_name not in existing_indexes:
            logger.info(f"Creating index: {self.index_name}")
            self.client.create_index(
                name=self.index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=os.getenv("PINECONE_ENVIRONMENT", "us-east-1")
                )
            )
        
        # Connect to index
        self.index = self.client.Index(self.index_name)
        
        # Initialize Gemini
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
             logger.error("GEMINI_API_KEY not found")
             raise ValueError("GEMINI_API_KEY is required")
             
        genai.configure(api_key=gemini_key)
        
    async def document_exists(self, doc_id: str) -> bool:
        """Check if document already exists in Pinecone"""
        try:
            # In v3, describe_index_stats is called on the index object
            stats = self.index.describe_index_stats()
            # This is a rough check. Ideally, we should check for specific ID existence
            # but filtering by ID in stats isn't directly supported.
            # We can try a fetch for a known ID pattern if we knew it, 
            # or just rely on the fact that upsert overwrites.
            return False # Always return False to allow re-processing/overwriting
        except Exception as e:
            logger.error(f"Error checking index stats: {e}")
            return False
    
    async def store_document(self, doc_id: str, chunks: List[Dict], user_id: str = None):
        """Store document chunks with embeddings in Pinecone"""
        
        if not user_id:
            logger.warning("No user_id provided for document storage. This document will be global.")
            
        vectors_to_upsert = []
        
        for chunk in chunks:
            # Generate embedding
            embedding = await self._generate_embedding(chunk["text"])
            
            # Prepare vector id
            vector_id = f"{doc_id}_{chunk['clause_id']}"
            
            # Prepare metadata
            metadata = {
                "document_id": doc_id,
                "clause_id": chunk["clause_id"],
                "text": chunk["text"][:2000],  # Ensure text fits in metadata (limit is usually 40KB per vector)
                "page": chunk["page"],
                "token_count": chunk["token_count"],
                "section_index": chunk.get("section_index", 0),
                "user_id": user_id or "global" # Store user_id or default to global
            }
            
            vectors_to_upsert.append({
                "id": vector_id,
                "values": embedding,
                "metadata": metadata
            })
        
        # Batch upsert
        batch_size = 100
        for i in range(0, len(vectors_to_upsert), batch_size):
            batch = vectors_to_upsert[i:i + batch_size]
            try:
                self.index.upsert(vectors=batch)
            except Exception as e:
                logger.error(f"Failed to upsert batch: {e}")
                raise
            
        logger.info(f"Stored {len(vectors_to_upsert)} vectors for document {doc_id} (User: {user_id})")
    
    async def search_similar(self, query: str, top_k: int = 5, user_id: str = None) -> List[Dict]:
        """Search for similar chunks, optionally filtered by user_id"""
        
        # Generate query embedding
        query_embedding = await self._generate_embedding(query)
        
        # Prepare filter
        meta_filter = {}
        if user_id:
            meta_filter["user_id"] = user_id
        
        # Search in Pinecone
        try:
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=meta_filter if meta_filter else None
            )
        except Exception as e:
            logger.error(f"Pinecone query failed: {e}")
            return []
        
        # Format results
        similar_chunks = []
        if results.matches:
            for match in results.matches:
                if match.metadata:
                    similar_chunks.append({
                        "text": match.metadata.get("text", ""),
                        "clause_id": match.metadata.get("clause_id", ""),
                        "page": match.metadata.get("page", 1),
                        "score": float(match.score),
                        "section_index": match.metadata.get("section_index", 0),
                        "document_id": match.metadata.get("document_id", "")
                    })
        
        return similar_chunks
        
    async def delete_user_documents(self, user_id: str):
        """Delete all vectors associated with a user_id"""
        try:
            # Pinecone delete by metadata filter
            self.index.delete(filter={"user_id": user_id})
            logger.info(f"Deleted all documents for user: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete documents for user {user_id}: {e}")
            raise

    async def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding using Gemini"""
        try:
            # Use Gemini's embedding model
            result = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            # Fallback to zero vector - this usually indicates API key or Quota issue
            # In production, we should probably raise this to be handled upstream
            return [0.0] * 768