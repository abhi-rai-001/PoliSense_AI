#!/usr/bin/env python3
import subprocess
import sys
import os
import requests

def check_server_running():
    """Check if RAG engine server is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def main():
    print("🔍 RAG Engine Test Suite")
    print("=" * 50)
    
    # Check if server is running
    if not check_server_running():
        print("❌ RAG Engine server is not running!")
        print("Please start the server first:")
        print("   python rag_engine.py")
        sys.exit(1)
    
    print("✅ RAG Engine server is running")
    
    # Check if test file exists
    if not os.path.exists("test_rag_engine.py"):
        print("❌ Test file not found. Make sure test_rag_engine.py exists.")
        sys.exit(1)
    
    # Run tests
    try:
        if len(sys.argv) > 1 and sys.argv[1] == "--pytest":
            # Run with pytest if available
            subprocess.run(["pytest", "test_rag_engine.py", "-v"], check=True)
        else:
            # Run manual tests
            subprocess.run(["python", "test_rag_engine.py"], check=True)
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Tests failed with exit code {e.returncode}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Python not found in PATH")
        sys.exit(1)

if __name__ == "__main__":
    main()
