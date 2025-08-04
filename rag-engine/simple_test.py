import os
import asyncio
import json
import logging
from dotenv import load_dotenv
from main import answer_question

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("simple_test")

# Load environment variables
load_dotenv()

async def run_test():
    """
    Run a simple test of the answer_question function
    """
    try:
        # Test document ID
        document_id = "test_document"
        
        # Test questions
        questions = [
            "What is the waiting period for pre-existing diseases?",
            "Does this policy cover maternity expenses?"
        ]
        
        # Test each question
        for question in questions:
            logger.info(f"Testing question: {question}")
            
            # Get answer
            answer = await answer_question(question, document_id)
            
            # Log answer
            logger.info(f"Answer: {json.dumps(answer, indent=2)}")
            
    except Exception as e:
        logger.error(f"Error running test: {str(e)}")
        raise

# Run the test
if __name__ == "__main__":
    asyncio.run(run_test())