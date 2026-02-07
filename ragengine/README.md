# HackRx RAG Engine

Production-ready LLM-powered query-retrieval microservice optimized for maximum accuracy, minimal latency, and explainable AI.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Run the service:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 📡 API Usage

### Endpoint: POST /api/v1/hackrx/run

**Headers:**
```
Authorization: Bearer fc3848ee29750f0714f4c397a91427f2357c66eb5ba66fdbc5f2dc70d2c72c35
Content-Type: application/json
```

**Request:**
```json
{
    "documents": "https://example.com/policy.pdf",
    "questions": [
        "What is the grace period for premium payment?",
        "Does this policy cover maternity expenses?"
    ]
}
```

**Response:**
```json
{
    "answers": [
        {
            "answer": "The grace period is 30 days from the due date",
            "traceability": {
                "clause_id": "pdf_2.1",
                "text": "Premium payments have a grace period of 30 days...",
                "page": 5,
                "confidence": 0.92
            },
            "confidence": 0.92,
            "explanation": "Clause 2.1 explicitly states the grace period terms"
        }
    ],
    "processing_time": 3.45,
    "document_id": "abc123def456"
}
```

## 🏗️ Architecture

- **FastAPI**: High-performance async web framework
- **Pinecone**: Vector database for semantic search
- **Gemini 2.0 Flash**: LLM for embeddings and query processing
- **pdfplumber**: Advanced PDF text extraction
- **Modular Design**: Easily extensible components

## 🎯 Optimization Features

- ✅ Clause-level document segmentation
- ✅ Hybrid retrieval (semantic + keyword)
- ✅ Token-efficient chunking with overlap
- ✅ Confidence scoring and traceability
- ✅ Production-ready error handling
- ✅ Async processing for low latency

## 📊 Performance Targets

- **Latency**: < 3 seconds per query
- **Accuracy**: > 90% on policy documents
- **Token Efficiency**: < 2000 tokens per query
- **Traceability**: 100% clause attribution