from app.services.gemini import GeminiService
from app.services.pinecone import PineconeService
from app.utils.text import clean_text, chunk_text
import uuid
from datetime import datetime
import logging
import httpx
import pypdf
import io
    
logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self):
        self.gemini = GeminiService()
        self.pinecone = PineconeService()

    async def ingest_text(self, text: str, user_id: str, source: str = "text_input"):
        """Ingest raw text."""
        cleaned_text = clean_text(text)
        chunks = chunk_text(cleaned_text)
        
        vectors = []
        for i, chunk in enumerate(chunks):
            # Generate ID
            doc_id = str(uuid.uuid4())
            
            # Embed
            embedding = await self.gemini.get_embedding(chunk)
            
            # Prepare vector
            vectors.append({
                "id": doc_id,
                "values": embedding,
                "metadata": {
                    "user_id": user_id,
                    "source": source,
                    "text": chunk,
                    "chunk_index": i,
                    "created_at": datetime.utcnow().isoformat()
                }
            })
            
        # Store
        if vectors:
            await self.pinecone.upsert_vectors(vectors)
            return len(vectors)
        return 0

    async def ingest_url(self, url: str, user_id: str):
        """Ingest content from a URL (PDF or simple HTML text)."""
        async with httpx.AsyncClient() as client:
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()
            
            content_type = response.headers.get("content-type", "").lower()
            text = ""
            
            if "application/pdf" in content_type:
                # Process PDF
                with io.BytesIO(response.content) as f:
                    reader = pypdf.PdfReader(f)
                    for page in reader.pages:
                        text += page.extract_text() + "\n"
            else:
                # Assume Text/HTML - In real app, use BeautifulSoup to strip HTML
                # For now, simplistic approach
                text = response.text
                
            return await self. ingest_text(text, user_id, source=url)
