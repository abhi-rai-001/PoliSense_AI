import asyncio
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/.env')
import json
import time
import logging
from typing import List, Dict
from pathlib import Path
from ..services.document_processor import DocumentProcessor
from ..services.query_engine import QueryEngine

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class BrutalTester:
    def __init__(self):
        self.doc_processor = DocumentProcessor()
        self.query_engine = QueryEngine()
        self.test_cases = self._load_test_cases()
    
    def _load_test_cases(self) -> List[Dict]:
        """Load test cases from JSON file"""
        test_file = Path(__file__).parent / "test_cases.json"
        with open(test_file) as f:
            return json.load(f)
    
    async def run_test_case(self, test_case: Dict) -> Dict:
        """Execute a single test case and return metrics"""
        start_time = time.time()
        
        try:
            # Process document
            doc_id = await self.doc_processor.process_document(test_case["document"])
            
            # Test each question
            results = []
            for question in test_case["questions"]:
                answer = await self.query_engine.query(question["text"], doc_id)
                
                # Calculate accuracy metrics
                is_correct = answer.answer.lower() == question["expected_answer"].lower()
                traceability_score = answer.traceability.confidence
                confidence_score = answer.confidence
                
                results.append({
                    "question": question["text"],
                    "answer": answer.answer,
                    "expected": question["expected_answer"],
                    "is_correct": is_correct,
                    "traceability": {
                        "clause_id": answer.traceability.clause_id,
                        "score": traceability_score,
                        "text": answer.traceability.text[:100] + "..." if answer.traceability.text else ""
                    },
                    "confidence": confidence_score,
                    "explanation": answer.explanation,
                    "processing_time": time.time() - start_time
                })
            
            return {
                "document": test_case["document"],
                "results": results,
                "success_rate": sum(1 for r in results if r["is_correct"]) / len(results),
                "avg_traceability_score": sum(r["traceability"]["score"] for r in results) / len(results),
                "avg_confidence": sum(r["confidence"] for r in results) / len(results),
                "total_processing_time": time.time() - start_time
            }
            
        except Exception as e:
            logger.error(f"Test case failed: {str(e)}")
            return {
                "document": test_case["document"],
                "error": str(e),
                "success_rate": 0.0,
                "avg_traceability_score": 0.0,
                "avg_confidence": 0.0,
                "total_processing_time": time.time() - start_time
            }
    
    async def run_all_tests(self) -> Dict:
        """Execute all test cases and return comprehensive metrics"""
        test_results = []
        
        for test_case in self.test_cases:
            result = await self.run_test_case(test_case)
            test_results.append(result)
        
        # Calculate overall metrics
        success_rates = [r["success_rate"] for r in test_results if "success_rate" in r]
        trace_scores = [r["avg_traceability_score"] for r in test_results if "avg_traceability_score" in r]
        conf_scores = [r["avg_confidence"] for r in test_results if "avg_confidence" in r]
        
        return {
            "test_cases": test_results,
            "overall_success_rate": sum(success_rates) / len(success_rates) if success_rates else 0.0,
            "overall_traceability_score": sum(trace_scores) / len(trace_scores) if trace_scores else 0.0,
            "overall_confidence": sum(conf_scores) / len(conf_scores) if conf_scores else 0.0,
            "performance_benchmark": {
                "avg_processing_time": sum(r["total_processing_time"] for r in test_results) / len(test_results),
                "total_processing_time": sum(r["total_processing_time"] for r in test_results)
            }
        }

async def main():
    tester = BrutalTester()
    results = await tester.run_all_tests()
    
    # Save results
    output_file = Path(__file__).parent / "test_results.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Test completed. Results saved to {output_file}")
    logger.info(f"Overall success rate: {results['overall_success_rate']:.2%}")
    logger.info(f"Overall traceability score: {results['overall_traceability_score']:.2f}")
    logger.info(f"Overall confidence: {results['overall_confidence']:.2f}")

if __name__ == "__main__":
    asyncio.run(main())