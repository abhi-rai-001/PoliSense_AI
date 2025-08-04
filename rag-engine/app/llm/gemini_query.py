import os
import json
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("gemini_query")

# Initialize Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# System prompt for Gemini
SYSTEM_PROMPT = """
You are a legal and insurance document assistant. You are given a set of relevant clauses from a policy document and a user query. Analyze the text to find if the document answers the user's question. Be precise and logical. If an answer cannot be found, respond with "Information not found." Format the output as JSON with 'answer', 'traceability', and 'confidence'.
"""

async def query_gemini(question: str, relevant_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Query Gemini with a question and relevant chunks.
    
    Args:
        question: User question
        relevant_chunks: List of relevant document chunks
        
    Returns:
        Dictionary with answer, confidence, explanation, and token usage
    """
    try:
        # Format clauses for the prompt
        clauses_text = ""
        for i, chunk in enumerate(relevant_chunks):
            clause_id = chunk.get("clause_id", f"Chunk {i+1}")
            page = chunk.get("page", "Unknown")
            clauses_text += f"{clause_id}: \"{chunk['text']}\" (Page: {page})\n\n"
        
        # Create user prompt
        user_prompt = f"""
[USER QUESTION]
{question}

[CLAUSES]
{clauses_text}

Respond in JSON format as per instructions.
"""
        
        # Initialize Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Generate response
        # Combine system prompt and user prompt since system role is not supported
        combined_prompt = f"{SYSTEM_PROMPT}\n\n{user_prompt}"
        
        response = model.generate_content(
            combined_prompt,
            generation_config={
                "temperature": 0.2,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 1024,
                "response_mime_type": "application/json"
            }
        )
        
        # Parse response
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError:
            # If response is not valid JSON, extract JSON part
            json_start = response.text.find('{')
            json_end = response.text.rfind('}')
            if json_start >= 0 and json_end >= 0:
                json_str = response.text[json_start:json_end+1]
                result = json.loads(json_str)
            else:
                # Fallback to structured response
                result = {
                    "answer": "Failed to parse response as JSON",
                    "traceability": {
                        "clause_id": None,
                        "text": "",
                        "page": None
                    },
                    "confidence": 0.0,
                    "explanation": "Error parsing response"
                }
        
        # Ensure required fields are present
        if "answer" not in result:
            result["answer"] = "No answer provided"
        
        if "traceability" not in result:
            result["traceability"] = {
                "clause_id": None,
                "text": "",
                "page": None
            }
        
        if "confidence" not in result:
            result["confidence"] = 0.5
        
        if "explanation" not in result:
            result["explanation"] = None
        
        # Get token usage
        prompt_tokens = response.usage_metadata.prompt_token_count
        response_tokens = response.usage_metadata.candidates_token_count
        total_tokens = prompt_tokens + response_tokens
        
        # Add token usage to result
        result["prompt_tokens"] = prompt_tokens
        result["response_tokens"] = response_tokens
        result["total_tokens"] = total_tokens
        
        return result
    
    except Exception as e:
        logger.error(f"Failed to query Gemini: {str(e)}")
        
        # Return error response
        return {
            "answer": f"Error: {str(e)}",
            "traceability": {
                "clause_id": None,
                "text": "",
                "page": None
            },
            "confidence": 0.0,
            "explanation": f"Failed to query Gemini: {str(e)}",
            "prompt_tokens": 0,
            "response_tokens": 0,
            "total_tokens": 0
        }