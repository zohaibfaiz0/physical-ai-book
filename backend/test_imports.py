#!/usr/bin/env python3
"""
Test script to verify all imports work correctly in the RAG chatbot backend
"""

def test_imports():
    print("Testing imports...")

    try:
        from app.config import settings
        print("+ Config import successful")
    except Exception as e:
        print(f"- Config import failed: {e}")
        return False

    try:
        from app.db import db_manager
        print("+ Database import successful")
    except Exception as e:
        print(f"- Database import failed: {e}")
        return False

    try:
        from app.vector_store import vector_store
        print("+ Vector store import successful")
    except Exception as e:
        print(f"- Vector store import failed: {e}")
        return False

    try:
        from app.ingest import ingestion_pipeline
        print("+ Ingest import successful")
    except Exception as e:
        print(f"- Ingest import failed: {e}")
        return False

    try:
        from app.agent import agent
        print("+ Agent import successful")
    except Exception as e:
        print(f"- Agent import failed: {e}")
        return False

    try:
        from app.retrieval import retrieval_system
        print("+ Retrieval import successful")
    except Exception as e:
        print(f"- Retrieval import failed: {e}")
        return False

    try:
        from app.generation import generation_system
        print("+ Generation import successful")
    except Exception as e:
        print(f"- Generation import failed: {e}")
        return False

    try:
        from app.models import ChatRequest, ChatResponse
        print("+ Models import successful")
    except Exception as e:
        print(f"- Models import failed: {e}")
        return False

    try:
        from app.utils import clean_markdown, extract_metadata_from_path
        print("+ Utils import successful")
    except Exception as e:
        print(f"- Utils import failed: {e}")
        return False

    try:
        from app.main import app
        print("+ Main app import successful")
    except Exception as e:
        print(f"- Main app import failed: {e}")
        return False

    print("\nAll imports successful!")
    return True

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("\nAll components imported successfully!")
        print("The RAG chatbot backend is properly configured.")
    else:
        print("\nSome imports failed. Please check the errors above.")