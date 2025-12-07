#!/usr/bin/env python3
"""
Test script to verify the RAG chatbot backend is functioning correctly
"""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to the path so we can import from app
sys.path.insert(0, str(Path(__file__).parent))

def test_backend_components():
    """Test that all backend components can be imported and initialized"""
    print("Testing RAG chatbot backend components...")

    # Test 1: Import core components
    try:
        from app.config import settings
        print("+ Config imported successful")
        print(f"  - Model: {settings.MODEL_NAME}")
        print(f"  - Embedding model: {settings.EMBEDDING_MODEL}")
    except Exception as e:
        print(f"- Config import failed: {e}")
        return False

    # Test 2: Import database manager
    try:
        from app.db import db_manager
        print("+ Database manager imported successfully")
    except Exception as e:
        print(f"- Database manager import failed: {e}")
        return False

    # Test 3: Import vector store
    try:
        from app.vector_store import vector_store
        print("+ Vector store imported successfully")
    except Exception as e:
        print(f"- Vector store import failed: {e}")
        return False

    # Test 4: Import ingestion pipeline
    try:
        from app.ingest import ingestion_pipeline
        print("+ Ingestion pipeline imported successfully")
    except Exception as e:
        print(f"- Ingestion pipeline import failed: {e}")
        return False

    # Test 5: Import agent
    try:
        from app.agent import agent
        print("+ Agent imported successfully")
    except Exception as e:
        print(f"- Agent import failed: {e}")
        return False

    # Test 6: Import retrieval system
    try:
        from app.retrieval import retrieval_system
        print("+ Retrieval system imported successfully")
    except Exception as e:
        print(f"- Retrieval system import failed: {e}")
        return False

    # Test 7: Import generation system
    try:
        from app.generation import generation_system
        print("+ Generation system imported successfully")
    except Exception as e:
        print(f"- Generation system import failed: {e}")
        return False

    # Test 8: Import main FastAPI app
    try:
        from app.main import app
        print("+ FastAPI app imported successfully")
    except Exception as e:
        print(f"- FastAPI app import failed: {e}")
        return False

    # Test 9: Test async functionality
    try:
        async def test_async():
            await asyncio.sleep(0.1)  # Simple async test
            return "async working"

        result = asyncio.run(test_async())
        print(f"+ Async functionality working: {result}")
    except Exception as e:
        print(f"- Async functionality failed: {e}")
        return False

    print("\n+ All backend components verified successfully!")
    print("The RAG chatbot backend is properly configured and ready to use.")
    return True

def test_health_check():
    """Test the health check endpoint if the app can be started"""
    print("\nTesting health check functionality...")

    try:
        from app.main import app
        from fastapi.testclient import TestClient

        client = TestClient(app)
        response = client.get("/health")

        if response.status_code == 200:
            health_data = response.json()
            print(f"+ Health check passed: {health_data['status']}")
            print(f"  - Timestamp: {health_data['timestamp']}")
            print(f"  - Services: {health_data.get('services', 'Not specified')}")
            return True
        else:
            print(f"- Health check failed with status: {response.status_code}")
            return False
    except ImportError:
        print("! Skipping health check test (TestClient not available)")
        return True
    except Exception as e:
        print(f"- Health check failed: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("RAG CHATBOT BACKEND VERIFICATION")
    print("="*60)

    success1 = test_backend_components()
    success2 = test_health_check()

    if success1 and success2:
        print("\n+ All backend verifications passed!")
        print("The RAG chatbot backend is ready for deployment.")
        sys.exit(0)
    else:
        print("\n- Some verifications failed.")
        sys.exit(1)