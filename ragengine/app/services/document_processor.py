import hashlib
import httpx
import pdfplumber
from docx import Document
import email
from email.policy import default
import logging
from typing import List, Dict, Optional
import io
from ..utils.chunking import DocumentChunker
from ..embeddings.pinecone_embedder import PineconeEmbedder

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.chunker = DocumentChunker()
        self.embedder = PineconeEmbedder()
    
    async def process_document(self, document_input: str, user_id: str = None, doc_type: str = "text") -> str:
        """Process document and return document ID"""
        
        # Generate document ID based on content hash to avoid duplication
        # Using first 200 chars + user_id for hash to ensure uniqueness per user if needed
        hash_input = f"{document_input[:5000]}{user_id}"
        doc_id = hashlib.md5(hash_input.encode()).hexdigest()[:12]
        
        # We generally re-process to ensure embeddings are up to date, 
        # but could skip if we trusted the existence check in Embedder.
        # For now, we'll proceed with processing.
        
        text_chunks = []
        
        # Check if input is a URL (Legacy behavior support)
        if document_input.startswith(('http://', 'https://')):
            text_chunks = await self._process_url(document_input, doc_type)
        else:
            # Assume raw text content
            text_chunks = self.chunker.chunk_text(document_input, document_type=doc_type)
            
        # Store embeddings with user_id
        await self.embedder.store_document(doc_id, text_chunks, user_id)
        
        logger.info(f"Processed document {doc_id} with {len(text_chunks)} chunks for user {user_id}")
        return doc_id
    
    async def _process_url(self, url: str, doc_type: str = "text") -> List[Dict]:
        """Download and process document from URL"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', '').lower()
            
            # Use explicit doc_type if provided, otherwise infer from content-type
            if doc_type == "pdf" or 'pdf' in content_type:
                return self._extract_pdf_text(response.content)
            elif doc_type == "docx" or 'word' in content_type or 'docx' in content_type:
                return self._extract_docx_text(response.content)
            else:
                 # Fallback to text
                 return self.chunker.chunk_text(response.text, document_type="text")
    
    def _extract_pdf_text(self, pdf_content: bytes) -> List[Dict]:
        """Extract text from PDF with clause-level segmentation"""
        chunks = []
        
        try:
            with pdfplumber.open(io.BytesIO(pdf_content)) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text()
                    if text:
                        page_chunks = self.chunker.chunk_text(
                            text, 
                            page_number=page_num,
                            document_type="pdf"
                        )
                        chunks.extend(page_chunks)
        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            
        return chunks
    
    def _extract_docx_text(self, docx_content: bytes) -> List[Dict]:
        """Extract text from DOCX"""
        chunks = []
        try:
            doc = Document(io.BytesIO(docx_content))
            
            full_text = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    full_text.append(paragraph.text)
            
            text = '\n'.join(full_text)
            chunks = self.chunker.chunk_text(text, document_type="docx")
        except Exception as e:
             logger.error(f"Error extracting DOCX text: {e}")
        
        return chunks