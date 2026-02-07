import google.generativeai as genai
import os
import json
import logging
from typing import Dict, List, Optional
from ..embeddings.pinecone_embedder import PineconeEmbedder
from ..schemas import AnswerResponse, TraceabilityInfo

logger = logging.getLogger(__name__)

class QueryEngine:
    def __init__(self):
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
             logger.error("GEMINI_API_KEY not found")
             raise ValueError("GEMINI_API_KEY is required")
        
        genai.configure(api_key=gemini_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp') # Updated to latest fast model
        self.embedder = PineconeEmbedder()
        
        self.system_prompt = """You are a senior insurance policy analyst. Your task is to provide precise, clause-backed answers with traceable references. Follow these strict guidelines:

1. Answer Structure:
- Direct answer first
- Supporting clause excerpt
- Page reference
- Confidence justification

2. Numerical Questions:
- Extract exact figures with units
- Specify calculation method if derived

3. Yes/No Questions:
- Binary answer followed by clause verbatim
- Highlight limiting conditions

4. Confidence Scoring:
- 1.0: Exact verbatim match
- 0.9: Direct inference from single clause
- 0.7: Combined inference from multiple clauses
- 0.5: Industry standard assumption
- 0.3: Partial relevance

Format output as JSON with: answer, clause_id, clause_text, page, confidence, explanation

1. Be precise and logical - only answer if the information is clearly present in the text
2. For numerical questions (waiting periods, coverage amounts), extract exact numbers
3. For yes/no questions, provide a clear answer with supporting clause
4. If an answer cannot be found, respond with "Information not found" and explain why
5. For partial matches, clearly indicate what information is available

Format the output as JSON with the following structure:
{
    "answer": "Direct answer to the question",
    "clause_id": "Most relevant clause ID",
    "clause_text": "Exact text from the most relevant clause",
    "page": "Page number",
    "confidence": "Confidence score between 0.0 and 1.0",
    "explanation": "Brief explanation of reasoning"
}

Be concise but comprehensive. Always cite the specific clause that supports your answer."""
    
    async def query(self, question: str, document_id: str, user_id: str = None) -> AnswerResponse:
        """Process a query against a document"""
        
        try:
            # Retrieve relevant chunks
            similar_chunks = await self.embedder.search_similar(
                query=question,
                doc_id=document_id, # This argument is now optional in search_similar logic but could be used if we want to scope to a doc, 
                                    # but typically user_id is the primary scope. 
                                    # Correction: backend sends user_id. document_id might be empty or specific. 
                                    # Let's support both.
                top_k=5,
                user_id=user_id
            )
            
            if not similar_chunks:
                return self._create_not_found_response()
            
            # Prepare context for LLM
            context = self._prepare_context(question, similar_chunks)
            
            # Query Gemini
            response = await self._query_gemini(context)
            
            # Parse and validate response
            return self._parse_gemini_response(response, similar_chunks)
            
        except Exception as e:
            logger.error(f"Query processing failed: {e}")
            return self._create_error_response(str(e))
    
    def _prepare_context(self, question: str, chunks: List[Dict]) -> str:
        """Prepare context for Gemini"""
        
        clauses_text = ""
        for i, chunk in enumerate(chunks, 1):
            clauses_text += f"{chunk['clause_id']}: \"{chunk['text']}\"\n"
        
        context = f"""[USER QUESTION]
{question}

[CLAUSES]
{clauses_text}

Respond in JSON format as per instructions."""
        
        return context
    
    async def _query_gemini(self, context: str) -> str:
        """Query Gemini with prepared context"""
        
        try:
            response = self.model.generate_content(
                f"{self.system_prompt}\n\n{context}",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=1000,
                )
            )
            
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini query failed: {e}")
            # If 2.0 fails (not available in region info), fallback to 1.5-flash
            try:
                fallback_model = genai.GenerativeModel('gemini-1.5-flash')
                response = fallback_model.generate_content(
                    f"{self.system_prompt}\n\n{context}",
                     generation_config=genai.types.GenerationConfig(
                        temperature=0.1,
                        max_output_tokens=1000,
                    )
                )
                return response.text
            except Exception as fallback_error:
                logger.error(f"Gemini fallback failed: {fallback_error}")
                raise e
    
    def _parse_gemini_response(self, response_text: str, chunks: List[Dict]) -> AnswerResponse:
        """Parse Gemini response into structured format"""
        
        try:
            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start == -1 or json_end == 0:
                # Try to clean up markdown blocks
                response_text = response_text.replace("```json", "").replace("```", "")
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
            
            if json_start == -1:
                 raise ValueError("No JSON found in response")

            json_text = response_text[json_start:json_end]
            parsed = json.loads(json_text)
            
            # Find the referenced chunk for full text
            referenced_chunk = chunks[0]  # Default to first chunk
            for chunk in chunks:
                if chunk['clause_id'] == parsed.get('clause_id'):
                    referenced_chunk = chunk
                    break
            
            # Calculate consistency/confidence
            # Since chunks don't always have 'score' in v3 responses if not requested specifically or if mocked, handle gracefully
            chunk_score = referenced_chunk.get('score', 0.8) 
            
            base_confidence = float(parsed.get('confidence', chunk_score))
            
            return AnswerResponse(
                answer=parsed.get('answer', 'No answer provided'),
                traceability=TraceabilityInfo(
                    clause_id=parsed.get('clause_id', referenced_chunk['clause_id']),
                    text=parsed.get('clause_text', referenced_chunk['text'])[:500],
                    page=parsed.get('page', referenced_chunk['page']),
                    confidence=base_confidence
                ),
                confidence=base_confidence,
                explanation=parsed.get('explanation', 'Analysis completed')
            )
            
        except Exception as e:
            logger.error(f"Response parsing failed: {e}")
            # Fallback response
            return AnswerResponse(
                answer=response_text[:500] if response_text else "Processing failed",
                traceability=TraceabilityInfo(
                    clause_id=chunks[0]['clause_id'] if chunks else "unknown",
                    text=chunks[0]['text'][:500] if chunks else "No text available",
                    page=chunks[0]['page'] if chunks else 1,
                    confidence=0.3
                ),
                confidence=0.3,
                explanation="Response parsing encountered issues"
            )
    
    def _create_not_found_response(self) -> AnswerResponse:
        """Create response when no relevant information is found"""
        return AnswerResponse(
            answer="Information not found in the provided document sections.",
            traceability=TraceabilityInfo(
                clause_id="N/A",
                text="No matching clauses found in searched sections",
                page=0,
                confidence=0.0
            ),
            confidence=0.0,
            explanation="The document sections searched did not contain information answering this question."
        )
    
    def _create_error_response(self, error_msg: str) -> AnswerResponse:
        """Create error response"""
        return AnswerResponse(
            answer=f"Processing error: {error_msg[:200]}",
            traceability=TraceabilityInfo(
                clause_id="ERROR",
                text="System error occurred",
                page=0,
                confidence=0.0
            ),
            confidence=0.0,
            explanation=f"Technical details: {error_msg[:200]}."
        )