from pinecone import Pinecone
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

class PineconeService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME
        try:
            self.index = self.pc.Index(self.index_name)
        except Exception as e:
            logger.error(f"Error connecting to Pinecone index {self.index_name}: {e}")
            raise

    async def upsert_vectors(self, vectors: list):
        """
        vectors: list of dicts {'id': str, 'values': list[float], 'metadata': dict}
        """
        try:
            # Upsert in batches of 100 to avoid limits
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            logger.info(f"Successfully upserted {len(vectors)} vectors")
        except Exception as e:
            logger.error(f"Error upserting vectors: {e}")
            raise

    async def query_vectors(self, vector: list[float], top_k: int = 5, filter: dict = None):
        try:
            # Query Pinecone
            # Important: filter must be passed as `filter` kwarg, even if None it's fine but usually we want to filter by user_id
            response = self.index.query(
                vector=vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter
            )
            return response
        except Exception as e:
            logger.error(f"Error querying vectors: {e}")
            raise

    async def delete_user_vectors(self, user_id: str):
        try:
            self.index.delete(filter={"user_id": user_id})
            logger.info(f"Deleted vectors for user_id: {user_id}")
        except Exception as e:
            logger.error(f"Error deleting user vectors: {e}")
            raise
