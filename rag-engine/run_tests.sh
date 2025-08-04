#!/bin/bash

# Set up environment
echo "Setting up environment..."
source .env 2>/dev/null || echo "Warning: .env file not found. Using system environment variables."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if required directories exist
if [ ! -d "results" ]; then
    echo "Creating results directory..."
    mkdir -p results
fi

if [ ! -d "uploads" ]; then
    echo "Creating uploads directory..."
    mkdir -p uploads
fi

# Check if requirements are installed
echo "Checking dependencies..."
pip3 install -r requirements.txt

# Run the brutal test
echo "Running brutal tests..."
python3 brutal_test.py

# Check if the test was successful
if [ $? -eq 0 ]; then
    echo "Tests completed successfully!"
    echo "Results are available in the 'results' directory."
else
    echo "Tests failed. Please check the logs for more information."
fi