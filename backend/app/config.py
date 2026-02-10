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

    # Embeddings - using Google's embedding API
    EMBEDDING_MODEL: str = "models/embedding-004"

    # Neon Postgres
    NEON_DATABASE_URL: str

    # Qdrant
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION_NAME: str = "physical-ai-book"

    # JWT Secret for auth
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 7860
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create a single instance of settings
settings = Settings()