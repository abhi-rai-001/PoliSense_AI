import re
from typing import List, Dict
import tiktoken

class DocumentChunker:
    def __init__(self, max_tokens=300, overlap_tokens=50):
        self.max_tokens = max_tokens
        self.overlap_tokens = overlap_tokens
        self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def chunk_text(self, text: str, page_number: int = 1, document_type: str = "pdf") -> List[Dict]:
        """Chunk text into semantically meaningful segments"""
        
        # Clean text
        text = self._clean_text(text)
        
        # Split by clauses/sections first
        sections = self._split_by_sections(text)
        
        chunks = []
        for section_idx, section in enumerate(sections):
            if not section.strip():
                continue
                
            # Further split if section is too long
            section_chunks = self._split_long_section(section)
            
            for chunk_idx, chunk in enumerate(section_chunks):
                clause_id = self._generate_clause_id(section_idx, chunk_idx, document_type)
                
                chunks.append({
                    "text": chunk,
                    "clause_id": clause_id,
                    "page": page_number,
                    "token_count": len(self.encoding.encode(chunk)),
                    "section_index": section_idx,
                    "chunk_index": chunk_idx
                })
        
        return chunks
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove page numbers and headers/footers
        text = re.sub(r'Page \d+', '', text)
        text = re.sub(r'\d+\s*$', '', text, flags=re.MULTILINE)
        return text.strip()
    
    def _split_by_sections(self, text: str) -> List[str]:
        """Split text by natural sections/clauses"""
        
        # Common section patterns
        patterns = [
            r'\n\s*\d+\.\s+',  # 1. Section
            r'\n\s*\d+\.\d+\s+',  # 1.1 Subsection
            r'\n\s*[A-Z]\.\s+',  # A. Section
            r'\n\s*\([a-z]\)\s+',  # (a) Subsection
            r'\n\s*Article\s+\d+',  # Article 1
            r'\n\s*Section\s+\d+',  # Section 1
            r'\n\s*Clause\s+\d+',  # Clause 1
        ]
        
        # Try each pattern
        for pattern in patterns:
            sections = re.split(pattern, text)
            if len(sections) > 1:
                return [s.strip() for s in sections if s.strip()]
        
        # Fallback: split by paragraphs
        paragraphs = text.split('\n\n')
        return [p.strip() for p in paragraphs if p.strip()]
    
    def _split_long_section(self, section: str) -> List[str]:
        """Split long sections into smaller chunks"""
        tokens = self.encoding.encode(section)
        
        if len(tokens) <= self.max_tokens:
            return [section]
        
        # Split by sentences
        sentences = re.split(r'(?<=[.!?])\s+', section)
        
        chunks = []
        current_chunk = []
        current_tokens = 0
        
        for sentence in sentences:
            sentence_tokens = len(self.encoding.encode(sentence))
            
            if current_tokens + sentence_tokens > self.max_tokens and current_chunk:
                # Save current chunk
                chunks.append(' '.join(current_chunk))
                
                # Start new chunk with overlap
                overlap_sentences = current_chunk[-2:] if len(current_chunk) >= 2 else current_chunk
                current_chunk = overlap_sentences + [sentence]
                current_tokens = sum(len(self.encoding.encode(s)) for s in current_chunk)
            else:
                current_chunk.append(sentence)
                current_tokens += sentence_tokens
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def _generate_clause_id(self, section_idx: int, chunk_idx: int, doc_type: str) -> str:
        """Generate unique clause ID"""
        return f"{doc_type}_{section_idx+1}.{chunk_idx+1}"