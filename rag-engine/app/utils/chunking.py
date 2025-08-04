import os
import re
import logging
import tempfile
from typing import List, Dict, Any, Optional
import httpx
import PyPDF2
import docx
import email.parser
from email.policy import default
from unstructured.partition.auto import partition
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("chunking")

# Import embeddings module
from app.embeddings.pinecone_embedder import store_document_embeddings

async def download_file(url: str) -> str:
    """
    Download a file from a URL and save it to a temporary file.
    
    Args:
        url: URL to download from
        
    Returns:
        Path to the downloaded file
    """
    try:
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_path = temp_file.name
        temp_file.close()
        
        # Download file
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            
            # Write to temporary file
            with open(temp_path, "wb") as f:
                f.write(response.content)
        
        return temp_path
    except Exception as e:
        logger.error(f"Failed to download file: {str(e)}")
        raise

async def extract_text_from_pdf(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text from a PDF file with page numbers and attempt to identify clauses.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        List of dictionaries with text, page number, and clause ID
    """
    try:
        chunks = []
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text = page.extract_text()
                
                # Skip empty pages
                if not text.strip():
                    continue
                
                # Try to identify clauses
                clause_pattern = r'(\d+(?:\.\d+)*\s+[A-Z][^\n.]*)'  # Pattern for clause headings
                clauses = re.finditer(clause_pattern, text)
                
                last_pos = 0
                for clause in clauses:
                    clause_id = clause.group(1).strip()
                    start_pos = clause.start()
                    
                    # Add previous chunk if exists
                    if start_pos > last_pos:
                        prev_text = text[last_pos:start_pos].strip()
                        if prev_text:
                            chunks.append({
                                "text": prev_text,
                                "page": page_num + 1,
                                "clause_id": None
                            })
                    
                    # Find end of clause (next clause or end of page)
                    next_clause = re.search(clause_pattern, text[start_pos+1:])
                    if next_clause:
                        end_pos = start_pos + 1 + next_clause.start()
                    else:
                        end_pos = len(text)
                    
                    # Add clause chunk
                    clause_text = text[start_pos:end_pos].strip()
                    if clause_text:
                        chunks.append({
                            "text": clause_text,
                            "page": page_num + 1,
                            "clause_id": clause_id.split()[0]  # Extract just the number part
                        })
                    
                    last_pos = end_pos
                
                # Add remaining text if any
                if last_pos < len(text):
                    remaining_text = text[last_pos:].strip()
                    if remaining_text:
                        chunks.append({
                            "text": remaining_text,
                            "page": page_num + 1,
                            "clause_id": None
                        })
        
        return chunks
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {str(e)}")
        raise

async def extract_text_from_docx(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text from a DOCX file with paragraph numbers and attempt to identify clauses.
    
    Args:
        file_path: Path to the DOCX file
        
    Returns:
        List of dictionaries with text, paragraph number, and clause ID
    """
    try:
        chunks = []
        doc = docx.Document(file_path)
        
        # Try to identify clauses
        clause_pattern = r'^(\d+(?:\.\d+)*\s+[A-Z][^\n.]*)'  # Pattern for clause headings
        
        current_clause_id = None
        current_clause_text = ""
        para_num = 0
        
        for para in doc.paragraphs:
            para_num += 1
            text = para.text.strip()
            
            # Skip empty paragraphs
            if not text:
                continue
            
            # Check if paragraph is a clause heading
            clause_match = re.match(clause_pattern, text)
            if clause_match:
                # Save previous clause if exists
                if current_clause_text:
                    chunks.append({
                        "text": current_clause_text.strip(),
                        "page": None,  # DOCX doesn't have page info
                        "clause_id": current_clause_id
                    })
                
                # Start new clause
                current_clause_id = clause_match.group(1).split()[0]  # Extract just the number part
                current_clause_text = text
            else:
                # Continue current clause
                current_clause_text += "\n" + text
        
        # Add final clause if exists
        if current_clause_text:
            chunks.append({
                "text": current_clause_text.strip(),
                "page": None,  # DOCX doesn't have page info
                "clause_id": current_clause_id
            })
        
        return chunks
    except Exception as e:
        logger.error(f"Failed to extract text from DOCX: {str(e)}")
        raise

async def extract_text_from_email(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text from an email file.
    
    Args:
        file_path: Path to the email file
        
    Returns:
        List of dictionaries with text
    """
    try:
        # Parse email
        with open(file_path, 'rb') as file:
            parser = email.parser.BytesParser(policy=default)
            msg = parser.parse(file)
        
        # Extract body
        body = ""
        if msg.is_multipart():
            for part in msg.iter_parts():
                if part.get_content_type() == "text/plain":
                    body += part.get_content()
        else:
            body = msg.get_content()
        
        # Create chunk
        return [{
            "text": body.strip(),
            "page": None,
            "clause_id": None
        }]
    except Exception as e:
        logger.error(f"Failed to extract text from email: {str(e)}")
        
        # Fallback to unstructured
        try:
            elements = partition(file_path)
            text = "\n".join([str(element) for element in elements])
            
            return [{
                "text": text.strip(),
                "page": None,
                "clause_id": None
            }]
        except Exception as fallback_error:
            logger.error(f"Fallback extraction failed: {str(fallback_error)}")
            raise

async def process_document(document: str, doc_id: str) -> List[Dict[str, Any]]:
    """
    Process a document from URL or content and store embeddings.
    
    Args:
        document: URL or content of the document
        doc_id: Document ID
        
    Returns:
        List of document chunks
    """
    try:
        # Check if document is a URL
        if document.startswith("http"):
            # Download file
            file_path = await download_file(document)
            
            # Determine file type
            if file_path.lower().endswith(".pdf"):
                chunks = await extract_text_from_pdf(file_path)
            elif file_path.lower().endswith(".docx"):
                chunks = await extract_text_from_docx(file_path)
            elif file_path.lower().endswith(".eml"):
                chunks = await extract_text_from_email(file_path)
            else:
                # Try unstructured for unknown file types
                elements = partition(file_path)
                text = "\n".join([str(element) for element in elements])
                chunks = chunk_text(text)
            
            # Clean up temporary file
            os.unlink(file_path)
        else:
            # Assume document is text content
            chunks = chunk_text(document)
        
        # Add document ID to chunks
        for chunk in chunks:
            chunk["doc_id"] = doc_id
        
        # Store embeddings
        namespace = f"doc_{doc_id}"
        await store_document_embeddings(chunks, namespace)
        
        return chunks
    except Exception as e:
        logger.error(f"Failed to process document: {str(e)}")
        raise

def chunk_text(text: str, chunk_size: int = 1500, overlap: int = 200) -> List[Dict[str, Any]]:
    """
    Split text into overlapping chunks.
    
    Args:
        text: Text to split
        chunk_size: Maximum chunk size in characters
        overlap: Overlap between chunks in characters
        
    Returns:
        List of dictionaries with text chunks
    """
    chunks = []
    start = 0
    
    # Try to identify clauses
    clause_pattern = r'(\d+(?:\.\d+)*\s+[A-Z][^\n.]*)'  # Pattern for clause headings
    clauses = list(re.finditer(clause_pattern, text))
    
    if clauses:
        # Split by clauses
        for i, clause in enumerate(clauses):
            clause_id = clause.group(1).strip().split()[0]  # Extract just the number part
            start_pos = clause.start()
            
            # Find end of clause (next clause or end of text)
            if i < len(clauses) - 1:
                end_pos = clauses[i+1].start()
            else:
                end_pos = len(text)
            
            # Get clause text
            clause_text = text[start_pos:end_pos].strip()
            
            # Split clause into chunks if too large
            if len(clause_text) > chunk_size:
                clause_chunks = split_into_chunks(clause_text, chunk_size, overlap)
                for j, chunk_text in enumerate(clause_chunks):
                    chunks.append({
                        "text": chunk_text,
                        "clause_id": clause_id,
                        "page": None
                    })
            else:
                chunks.append({
                    "text": clause_text,
                    "clause_id": clause_id,
                    "page": None
                })
    else:
        # Split by size if no clauses found
        text_chunks = split_into_chunks(text, chunk_size, overlap)
        for chunk_text in text_chunks:
            chunks.append({
                "text": chunk_text,
                "clause_id": None,
                "page": None
            })
    
    return chunks

def split_into_chunks(text: str, chunk_size: int = 1500, overlap: int = 200) -> List[str]:
    """
    Split text into overlapping chunks.
    
    Args:
        text: Text to split
        chunk_size: Maximum chunk size in characters
        overlap: Overlap between chunks in characters
        
    Returns:
        List of text chunks
    """
    chunks = []
    start = 0
    
    while start < len(text):
        # Calculate end position
        end = start + chunk_size
        if end > len(text):
            end = len(text)
        
        # Adjust end to avoid cutting words
        if end < len(text):
            # Find the last space before the end
            last_space = text.rfind(" ", start, end)
            if last_space > start:
                end = last_space
        
        # Extract chunk
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        # Move start position for next chunk
        start = end - overlap
        if start < 0:
            start = 0
    
    return chunks