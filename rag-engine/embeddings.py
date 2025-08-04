# Import necessary functions from app.embeddings.pinecone_embedder
from app.embeddings.pinecone_embedder import initialize_pinecone, store_document_embeddings, delete_document

# Create an alias for store_document_embeddings as store_chunks
store_chunks = store_document_embeddings