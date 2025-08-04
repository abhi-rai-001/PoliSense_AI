import re
import logging
from typing import List, Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("traceability")

def extract_traceability_info(result: Dict[str, Any], relevant_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Extract traceability information from LLM result and relevant chunks.
    
    Args:
        result: LLM result dictionary
        relevant_chunks: List of relevant document chunks
        
    Returns:
        Dictionary with traceability information
    """
    try:
        # Initialize traceability info
        traceability = {
            "clause_id": None,
            "text": "",
            "page": None
        }
        
        # Check if result already has traceability information
        if "traceability" in result and isinstance(result["traceability"], dict):
            # Extract from result
            if "clause_id" in result["traceability"]:
                traceability["clause_id"] = result["traceability"]["clause_id"]
            
            if "text" in result["traceability"]:
                traceability["text"] = result["traceability"]["text"]
            
            if "page" in result["traceability"]:
                traceability["page"] = result["traceability"]["page"]
        
        # If traceability info is incomplete, try to extract from answer
        if not traceability["clause_id"] or not traceability["text"]:
            # Try to extract clause ID from answer
            clause_pattern = r'(?:clause|section)\s+(\d+(?:\.\d+)*)'  # Pattern for clause references
            clause_match = re.search(clause_pattern, result["answer"], re.IGNORECASE)
            
            if clause_match:
                traceability["clause_id"] = clause_match.group(1)
            
            # Try to find the most relevant chunk
            if relevant_chunks:
                # Sort chunks by relevance score
                sorted_chunks = sorted(relevant_chunks, key=lambda x: x.get("score", 0), reverse=True)
                
                # Get the most relevant chunk
                top_chunk = sorted_chunks[0]
                
                # Use chunk information if not already set
                if not traceability["clause_id"] and "clause_id" in top_chunk and top_chunk["clause_id"]:
                    traceability["clause_id"] = top_chunk["clause_id"]
                
                if not traceability["text"] and "text" in top_chunk:
                    # Extract a relevant snippet (first 200 characters)
                    traceability["text"] = top_chunk["text"][:200] + "..." if len(top_chunk["text"]) > 200 else top_chunk["text"]
                
                if not traceability["page"] and "page" in top_chunk and top_chunk["page"]:
                    traceability["page"] = top_chunk["page"]
        
        # If still no text, use a generic message
        if not traceability["text"]:
            traceability["text"] = "No specific text reference found"
        
        return traceability
    
    except Exception as e:
        logger.error(f"Failed to extract traceability info: {str(e)}")
        
        # Return default traceability info
        return {
            "clause_id": None,
            "text": "Error extracting traceability information",
            "page": None
        }