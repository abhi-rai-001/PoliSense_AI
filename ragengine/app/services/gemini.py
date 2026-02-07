import google.generativeai as genai
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.embedding_model = settings.EMBEDDING_MODEL
        self.generation_model = genai.GenerativeModel(settings.GENERATION_MODEL)

    async def get_embedding(self, text: str) -> list[float]:
        try:
            # Gemini embedding-001 output dimension is 768
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="retrieval_document",
                title="Embedding",
                output_dimensionality=settings.EMBEDDING_DIMENSION
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    async def generate_response(self, prompt: str) -> str:
        try:
            response = await self.generation_model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
