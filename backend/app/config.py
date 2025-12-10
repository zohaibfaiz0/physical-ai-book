from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Gemini API
    GEMINI_API_KEY: str
    # Model selection (now only gemini)
    LLM_PROVIDER: str = "gemini"  # Default to gemini
    GEMINI_MODEL: str = "gemini-2.5-flash"  # Default Gemini model

    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Neon Postgres
    NEON_DATABASE_URL: str

    # Qdrant
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION_NAME: str = "physical-ai-book"

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create a single instance of settings
settings = Settings()