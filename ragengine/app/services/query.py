from app.services.gemini import GeminiService
from app.services.pinecone import PineconeService
import logging

logger = logging.getLogger(__name__)

class QueryService:
    def __init__(self):
        self.gemini = GeminiService()
        self.pinecone = PineconeService()

    async def query(self, query_text: str, user_id: str, history: list = None) -> str:
        # 1. Embed Query
        query_embedding = await self.gemini.get_embedding(query_text)
        
        # 2. Search Pinecone (Filter by user_id)
        search_results = await self.pinecone.query_vectors(
            vector=query_embedding,
            top_k=5,
            filter={"user_id": user_id}
        )
        
        # 3. Construct Context
        context_chunks = []
        for match in search_results['matches']:
            if match['score'] > 0.6: # Relevance threshold
                context_chunks.append(match['metadata']['text'])
        
        context = "\n\n".join(context_chunks)
        
        if not context:
            return "I couldn't find any relevant information in your documents to answer this question."
            
        # 4. Generate Answer
        system_prompt = f"""You are a helpful AI assistant. Answer the user's question based ONLY on the provided context.
If the answer is not in the context, say you don't know.

Context:
{context}

User Question: {query_text}

Answer:"""

        answer = await self.gemini.generate_response(system_prompt)
        return answer
