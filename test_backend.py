#!/usr/bin/env python3
"""
Test script to verify backend functionality
"""
import requests
import json
import time
import sys

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get("http://127.0.0.1:8000/health")
        if response.status_code == 200:
            data = response.json()
            print(f"OK Health check passed: {data['status']}")
            print(f"  Services: {data['services']}")
            return True
        else:
            print(f"XX Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"XX Health check error: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\nTesting chat endpoint...")
    try:
        # Test conversation ID format
        import uuid
        conversation_id = str(uuid.uuid4())

        payload = {
            "question": "What is Physical AI?",
            "selected_text": None,
            "conversation_id": conversation_id
        }

        response = requests.post(
            "http://127.0.0.1:8000/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            # The chat endpoint might return streaming response or JSON
            try:
                data = response.json()
                print(f"OK Chat test passed")
                print(f"  Response keys: {list(data.keys())}")
                print(f"  Conversation ID: {data.get('conversation_id', 'N/A')}")
                return True
            except:
                # If it's a streaming response, just check that we got content
                print(f"OK Chat test passed (streaming response)")
                print(f"  Response length: {len(response.text)}")
                return True
        else:
            print(f"XX Chat test failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except Exception as e:
        print(f"XX Chat test error: {e}")
        return False

def test_conversation():
    """Test conversation functionality"""
    print("\nTesting conversation functionality...")
    try:
        # Create a conversation ID
        import uuid
        conversation_id = str(uuid.uuid4())

        # Send first message
        payload1 = {
            "question": "What are the key concepts in Physical AI?",
            "selected_text": None,
            "conversation_id": conversation_id
        }

        response1 = requests.post(
            "http://127.0.0.1:8000/chat",
            json=payload1,
            headers={"Content-Type": "application/json"}
        )

        if response1.status_code != 200:
            print(f"XX First message failed: {response1.status_code}")
            print(f"  Response: {response1.text}")
            return False

        # Get conversation history
        try:
            response2 = requests.get(f"http://127.0.0.1:8000/conversations/{conversation_id}")
            if response2.status_code == 200:
                data = response2.json()
                print(f"OK Conversation test passed")
                print(f"  Messages in history: {len(data.get('messages', []))}")
                return True
            else:
                print(f"XX Get conversation failed: {response2.status_code}")
                print(f"  Response: {response2.text}")
                return False
        except Exception as e:
            print(f"XX Get conversation error: {e}")
            return False

    except Exception as e:
        print(f"XX Conversation test error: {e}")
        return False

def main():
    """Run all tests"""
    print("Running backend functionality tests...\n")

    tests = [
        ("Health Check", test_health),
        ("Chat Endpoint", test_chat),
        ("Conversation", test_conversation)
    ]

    passed = 0
    total = len(tests)

    for name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running {name}...")
        print('='*50)

        if test_func():
            passed += 1
            print(f"OK {name} PASSED")
        else:
            print(f"XX {name} FAILED")

    print(f"\n{'='*50}")
    print(f"Test Results: {passed}/{total} passed")
    print('='*50)

    if passed == total:
        print("SUCCESS: All tests passed! Backend is working correctly.")
        return True
    else:
        print("FAILURE: Some tests failed. Backend needs fixes.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)