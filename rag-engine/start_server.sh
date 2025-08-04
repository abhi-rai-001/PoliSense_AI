#!/bin/bash

# Set up environment
echo "Setting up environment..."
source .env 2>/dev/null || echo "Warning: .env file not found. Using system environment variables."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if requirements are installed
echo "Checking dependencies..."
pip3 install -r requirements.txt

# Start the server
echo "Starting RAG Engine server..."
cd app
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload