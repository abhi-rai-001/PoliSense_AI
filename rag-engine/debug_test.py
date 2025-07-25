import requests
import json
import time

BASE_URL = "http://localhost:8000"
TEST_USER_ID = "test_user_123"

def debug_rag_engine():
    print("🔍 Debugging RAG Engine...")
    
    # Clear documents first
    try:
        requests.delete(f"{BASE_URL}/clear_all_documents")
        print("✅ Cleared existing documents")
    except:
        pass
    
    # Add a simple test document
    test_doc = {
        "doc_id": "simple_policy",
        "content": """
        TRAVEL INSURANCE POLICY
        
        ACCIDENTAL DEATH BENEFIT
        Coverage: If the insured dies due to an accident during a covered trip, 
        the beneficiary will receive $100,000 (Sum Insured).
        
        This benefit applies to:
        - Road accidents
        - Air accidents  
        - Other accidental deaths during travel
        
        EXCLUSIONS
        - Pre-existing medical conditions
        - Hazardous activities
        """,
        "filename": "simple_policy.pdf",
        "user_id": TEST_USER_ID,
        "document_type": "insurance"
    }
    
    # Add document
    response = requests.post(f"{BASE_URL}/add_document", json=test_doc)
    print(f"📄 Document added: {response.json()}")
    
    time.sleep(2)  # Wait for indexing
    
    # Test different queries
    queries = [
        "What is the accidental death benefit amount?",
        "If I die in a road accident, what will my family receive?",
        "Am I covered for accidental death?",
        "What is the sum insured for death benefits?"
    ]
    
    for question in queries:
        print(f"\n❓ Query: {question}")
        
        query = {
            "question": question,
            "user_id": TEST_USER_ID
        }
        
        response = requests.post(f"{BASE_URL}/query", json=query)
        data = response.json()
        
        print(f"   Decision: {data.get('Decision', 'N/A')}")
        print(f"   Amount: {data.get('Amount', 'N/A')}")
        print(f"   Summary: {data.get('Justification', {}).get('Summary', 'N/A')}")
        
        # Show relevant chunks if available
        if 'sources' in data:
            print(f"   Sources found: {len(data['sources'])}")
            for i, source in enumerate(data['sources'][:2]):
                print(f"     Source {i+1}: {source.get('content', '')[:100]}...")

if __name__ == "__main__":
    debug_rag_engine()