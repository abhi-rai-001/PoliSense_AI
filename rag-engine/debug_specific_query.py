import requests
import json

BASE_URL = "http://localhost:8000"
TEST_USER_ID = "user123"  # Changed to match frontend

def debug_specific_query():
    print("🔍 Debugging Specific Query Response...")
    
    # Test the exact query that's giving generic responses
    query = {
        "question": "Will my surgery due to a pre-existing illness during travel be reimbursed?",
        "user_id": TEST_USER_ID
    }
    
    response = requests.post(f"{BASE_URL}/query", json=query)
    data = response.json()
    
    print(f"📋 Full Response:")
    print(json.dumps(data, indent=2))
    
    print(f"\n🔍 Analysis:")
    print(f"   Decision: {data.get('Decision')}")
    print(f"   Amount: {data.get('Amount')}")
    print(f"   Answer: {data.get('answer')}")
    
    if 'Justification' in data:
        print(f"   Summary: {data['Justification'].get('Summary')}")
        if 'Clauses' in data['Justification']:
            print(f"   Clauses: {len(data['Justification']['Clauses'])} found")
            for i, clause in enumerate(data['Justification']['Clauses'][:2]):
                print(f"     Clause {i+1}: {clause}")
    
    if 'sources' in data:
        print(f"\n📚 Sources ({len(data['sources'])}):")
        for i, source in enumerate(data['sources'][:3]):
            content = source.get('content', '')[:200]
            print(f"   Source {i+1}: {content}...")
            print(f"   Filename: {source.get('filename', 'N/A')}")
            print(f"   Chunk ID: {source.get('chunk_id', 'N/A')}")
            print()

if __name__ == "__main__":
    debug_specific_query()
