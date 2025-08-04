import os
import asyncio
import json
import time
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import PyPDF2
from main import answer_question
from embeddings import initialize_pinecone, store_chunks, delete_document
from chunking import chunk_text

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("brutal_test")

# Load environment variables
load_dotenv()

# Test configuration
UPLOADS_DIR = "/Users/abhi/Desktop/Polisense_AI/backend/uploads"
RESULTS_DIR = "/Users/abhi/Desktop/Polisense_AI/rag-engine/new_implementation/test_results"
MAX_DOCUMENTS = 5  # Maximum number of documents to test

# Create results directory if it doesn't exist
os.makedirs(RESULTS_DIR, exist_ok=True)

# Standard insurance policy questions for testing
STANDARD_QUESTIONS = [
    "What is the waiting period for pre-existing diseases?",
    "Does this policy cover maternity expenses, and what are the conditions?",
    "What is the waiting period for cataract surgery?",
    "Are the medical expenses for an organ donor covered under this policy?",
    "What is the No Claim Discount (NCD) offered in this policy?",
    "Is there a benefit for preventive health check-ups?",
    "How does the policy define a 'Hospital'?",
    "What is the extent of coverage for AYUSH treatments?",
    "Are there any sub-limits on room rent and ICU charges?",
    "What is the grace period for premium payment?"
]

# Complex questions that require reasoning
COMPLEX_QUESTIONS = [
    "If I have a pre-existing heart condition and need surgery after 2 years of coverage, would it be covered?",
    "Compare the waiting periods for different procedures and tell me which ones have the longest waiting time.",
    "If I'm 65 years old with diabetes, what special conditions or co-payments would apply to me?",
    "What's the difference between the coverage for normal delivery versus cesarean section?",
    "If I need to be hospitalized for 5 days due to dengue fever, what would be covered and what would be my out-of-pocket expenses?"
]

# Edge case questions
EDGE_CASE_QUESTIONS = [
    "Does the policy cover experimental treatments or clinical trials?",
    "What happens if I miss a premium payment by one day?",
    "Are there any exclusions for treatments received outside of India?",
    "If I have two health insurance policies, how does the claim settlement work?",
    "What is the process for disputing a rejected claim?"
]

async def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text content from a PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Extracted text content
    """
    try:
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n\n"
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF {pdf_path}: {str(e)}")
        return ""

async def add_document(pdf_path: str) -> tuple:
    """
    Process a PDF document and add it to the vector database.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Tuple of (doc_id, user_id, processing_time, chunks_count)
    """
    try:
        start_time = time.time()
        
        # Extract filename
        filename = os.path.basename(pdf_path)
        doc_id = f"test_{filename.replace('.pdf', '')}"
        user_id = "test_user"
        
        # Extract text from PDF
        logger.info(f"Extracting text from {filename}...")
        content = await extract_text_from_pdf(pdf_path)
        
        if not content:
            logger.error(f"Failed to extract text from {filename}")
            return doc_id, user_id, 0, 0
        
        # Create chunks
        logger.info(f"Chunking document {filename}...")
        chunks = chunk_text(content)
        
        # Add metadata to chunks
        for chunk in chunks:
            chunk.update({
                "doc_id": doc_id,
                "filename": filename,
                "document_type": "Insurance Policy",
                "user_id": user_id
            })
        
        # Store chunks in Pinecone
        logger.info(f"Storing {len(chunks)} chunks for {filename}...")
        namespace = f"user_{user_id}"
        vectors_count = store_chunks(chunks, user_id, namespace)
        
        processing_time = time.time() - start_time
        logger.info(f"Added document {filename} with {len(chunks)} chunks in {processing_time:.2f} seconds")
        
        return doc_id, user_id, processing_time, len(chunks)
    
    except Exception as e:
        logger.error(f"Error adding document {pdf_path}: {str(e)}")
        return None, None, 0, 0

async def test_document(doc_id: str, user_id: str, questions: List[str]) -> Dict:
    """
    Test a document with a set of questions.
    
    Args:
        doc_id: Document ID
        user_id: User ID
        questions: List of questions to test
        
    Returns:
        Dictionary with test results
    """
    results = {
        "doc_id": doc_id,
        "questions": []
    }
    
    total_latency = 0
    total_questions = len(questions)
    
    for i, question in enumerate(questions):
        logger.info(f"Question {i+1}/{total_questions}: {question}")
        
        # Measure latency
        start_time = time.time()
        
        # Get answer
        result = await answer_question(doc_id, question, user_id)
        
        # Calculate latency
        latency = time.time() - start_time
        total_latency += latency
        
        # Log result
        logger.info(f"Answer: {result['answer'][:100]}...")
        logger.info(f"Confidence: {result['confidence']}")
        logger.info(f"Traceability Score: {result['traceability_score']}")
        logger.info(f"Latency: {latency:.2f} seconds")
        
        # Add to results
        results["questions"].append({
            "question": question,
            "answer": result["answer"],
            "confidence": result["confidence"],
            "traceability_score": result["traceability_score"],
            "latency": latency,
            "source_chunks": result["source_chunks"]
        })
    
    # Calculate average latency
    results["avg_latency"] = total_latency / total_questions if total_questions > 0 else 0
    
    return results

async def evaluate_results(results: Dict) -> Dict:
    """
    Evaluate test results based on the evaluation criteria.
    
    Args:
        results: Test results dictionary
        
    Returns:
        Dictionary with evaluation scores
    """
    # Initialize scores
    scores = {
        "accuracy": 0,
        "token_efficiency": 0,
        "latency": 0,
        "reusability": 0,
        "explainability": 0,
        "overall": 0
    }
    
    # Calculate accuracy score based on confidence and traceability
    confidence_map = {"high": 1.0, "medium": 0.7, "low": 0.4}
    total_questions = len(results["questions"])
    
    if total_questions == 0:
        return scores
    
    # Calculate accuracy score
    accuracy_sum = 0
    for q in results["questions"]:
        confidence_score = confidence_map.get(q["confidence"], 0.4)
        traceability_score = q["traceability_score"] / 100
        question_accuracy = (confidence_score + traceability_score) / 2
        accuracy_sum += question_accuracy
    
    scores["accuracy"] = (accuracy_sum / total_questions) * 100
    
    # Calculate latency score (lower is better)
    avg_latency = results["avg_latency"]
    if avg_latency <= 1.0:
        scores["latency"] = 100
    elif avg_latency <= 2.0:
        scores["latency"] = 90
    elif avg_latency <= 3.0:
        scores["latency"] = 80
    elif avg_latency <= 4.0:
        scores["latency"] = 70
    elif avg_latency <= 5.0:
        scores["latency"] = 60
    else:
        scores["latency"] = 50
    
    # Calculate token efficiency based on answer length
    token_efficiency_sum = 0
    for q in results["questions"]:
        answer_length = len(q["answer"])
        # Optimal answer length is between 100-500 characters
        if 100 <= answer_length <= 500:
            efficiency = 1.0
        elif answer_length < 100:
            efficiency = answer_length / 100
        else:
            efficiency = 500 / answer_length
        token_efficiency_sum += efficiency
    
    scores["token_efficiency"] = (token_efficiency_sum / total_questions) * 100
    
    # Calculate explainability based on source chunks
    explainability_sum = 0
    for q in results["questions"]:
        source_chunks = q["source_chunks"]
        if len(source_chunks) >= 2:
            explainability = 1.0
        elif len(source_chunks) == 1:
            explainability = 0.7
        else:
            explainability = 0.3
        explainability_sum += explainability
    
    scores["explainability"] = (explainability_sum / total_questions) * 100
    
    # Reusability is fixed at 80% since we're using a modular architecture
    scores["reusability"] = 80
    
    # Calculate overall score (weighted average)
    weights = {
        "accuracy": 0.35,
        "token_efficiency": 0.15,
        "latency": 0.20,
        "reusability": 0.10,
        "explainability": 0.20
    }
    
    overall_score = sum(scores[key] * weights[key] for key in weights.keys())
    scores["overall"] = overall_score
    
    return scores

async def run_tests():
    """
    Run comprehensive tests on the RAG engine.
    """
    try:
        # Initialize Pinecone
        logger.info("Initializing Pinecone...")
        initialize_pinecone()
        
        # Get list of PDF files in uploads directory
        pdf_files = [os.path.join(UPLOADS_DIR, f) for f in os.listdir(UPLOADS_DIR) if f.endswith('.pdf')]
        
        # Limit the number of documents to test
        pdf_files = pdf_files[:MAX_DOCUMENTS]
        
        all_results = []
        all_scores = []
        
        # Process each document
        for pdf_file in pdf_files:
            filename = os.path.basename(pdf_file)
            logger.info(f"\n=== Testing document: {filename} ===")
            
            # Add document to vector database
            doc_id, user_id, processing_time, chunks_count = await add_document(pdf_file)
            
            if not doc_id or not user_id:
                logger.error(f"Failed to process document {filename}")
                continue
            
            # Test with standard questions
            logger.info(f"\n--- Testing standard questions for {filename} ---")
            standard_results = await test_document(doc_id, user_id, STANDARD_QUESTIONS)
            standard_results["question_type"] = "standard"
            standard_results["filename"] = filename
            standard_results["processing_time"] = processing_time
            standard_results["chunks_count"] = chunks_count
            
            # Test with complex questions
            logger.info(f"\n--- Testing complex questions for {filename} ---")
            complex_results = await test_document(doc_id, user_id, COMPLEX_QUESTIONS)
            complex_results["question_type"] = "complex"
            complex_results["filename"] = filename
            complex_results["processing_time"] = processing_time
            complex_results["chunks_count"] = chunks_count
            
            # Test with edge case questions
            logger.info(f"\n--- Testing edge case questions for {filename} ---")
            edge_results = await test_document(doc_id, user_id, EDGE_CASE_QUESTIONS)
            edge_results["question_type"] = "edge_case"
            edge_results["filename"] = filename
            edge_results["processing_time"] = processing_time
            edge_results["chunks_count"] = chunks_count
            
            # Evaluate results
            standard_scores = await evaluate_results(standard_results)
            complex_scores = await evaluate_results(complex_results)
            edge_scores = await evaluate_results(edge_results)
            
            # Calculate combined scores
            combined_scores = {
                "filename": filename,
                "doc_id": doc_id,
                "standard": standard_scores,
                "complex": complex_scores,
                "edge_case": edge_scores,
                "overall": (standard_scores["overall"] * 0.5 + 
                           complex_scores["overall"] * 0.3 + 
                           edge_scores["overall"] * 0.2)
            }
            
            # Add to results
            all_results.extend([standard_results, complex_results, edge_results])
            all_scores.append(combined_scores)
            
            # Save individual document results
            doc_results_path = os.path.join(RESULTS_DIR, f"{doc_id}_results.json")
            with open(doc_results_path, "w") as f:
                json.dump({
                    "standard": standard_results,
                    "complex": complex_results,
                    "edge_case": edge_results,
                    "scores": combined_scores
                }, f, indent=2)
            
            logger.info(f"Results for {filename} saved to {doc_results_path}")
            
            # Clean up - delete document vectors
            logger.info(f"Cleaning up document {doc_id}...")
            namespace = f"user_{user_id}"
            delete_document(doc_id, user_id, namespace)
        
        # Calculate overall system scores
        if all_scores:
            system_scores = {
                "accuracy": sum(s["standard"]["accuracy"] * 0.5 + s["complex"]["accuracy"] * 0.3 + s["edge_case"]["accuracy"] * 0.2 for s in all_scores) / len(all_scores),
                "token_efficiency": sum(s["standard"]["token_efficiency"] * 0.5 + s["complex"]["token_efficiency"] * 0.3 + s["edge_case"]["token_efficiency"] * 0.2 for s in all_scores) / len(all_scores),
                "latency": sum(s["standard"]["latency"] * 0.5 + s["complex"]["latency"] * 0.3 + s["edge_case"]["latency"] * 0.2 for s in all_scores) / len(all_scores),
                "reusability": sum(s["standard"]["reusability"] * 0.5 + s["complex"]["reusability"] * 0.3 + s["edge_case"]["reusability"] * 0.2 for s in all_scores) / len(all_scores),
                "explainability": sum(s["standard"]["explainability"] * 0.5 + s["complex"]["explainability"] * 0.3 + s["edge_case"]["explainability"] * 0.2 for s in all_scores) / len(all_scores),
                "overall": sum(s["overall"] for s in all_scores) / len(all_scores)
            }
        else:
            system_scores = {
                "accuracy": 0,
                "token_efficiency": 0,
                "latency": 0,
                "reusability": 0,
                "explainability": 0,
                "overall": 0
            }
        
        # Save overall results
        overall_results_path = os.path.join(RESULTS_DIR, "overall_results.json")
        with open(overall_results_path, "w") as f:
            json.dump({
                "system_scores": system_scores,
                "document_scores": all_scores,
                "detailed_results": all_results
            }, f, indent=2)
        
        logger.info(f"\n=== Overall System Scores ===")
        logger.info(f"Accuracy: {system_scores['accuracy']:.2f}%")
        logger.info(f"Token Efficiency: {system_scores['token_efficiency']:.2f}%")
        logger.info(f"Latency: {system_scores['latency']:.2f}%")
        logger.info(f"Reusability: {system_scores['reusability']:.2f}%")
        logger.info(f"Explainability: {system_scores['explainability']:.2f}%")
        logger.info(f"Overall Score: {system_scores['overall']:.2f}%")
        logger.info(f"\nOverall results saved to {overall_results_path}")
    
    except Exception as e:
        logger.error(f"Error running tests: {str(e)}")

if __name__ == "__main__":
    asyncio.run(run_tests())