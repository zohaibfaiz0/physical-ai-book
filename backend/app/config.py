from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Groq API
    GROQ_API_KEY: str
    # Gemini API
    GEMINI_API_KEY: str
    # Model selection (groq or gemini)
    LLM_PROVIDER: str = "groq"  # Default to groq, can be "gemini"
    MODEL_NAME: str = "llama-3.3-70b-versatile"  # Default Groq model
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