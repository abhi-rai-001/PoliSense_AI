import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str = "polisense-index"
    BEARER_TOKEN: str
    PORT: int = 8000
    SKIP_AUTH: bool = False
    
    # Model Config
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    GENERATION_MODEL: str = "gemini-1.5-flash"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
