# API Contracts: RAG Chatbot Backend

**Created**: 2025-12-06
**Status**: Complete
**Feature**: RAG Chatbot Backend with Agent Architecture

## Overview

This document defines the API contracts for the RAG chatbot backend service. All endpoints follow REST principles with JSON request/response bodies.

## Base URL

- Development: `http://localhost:8000`
- Production: `[Deployed URL]`

## Common Headers

All requests should include:
- `Content-Type: application/json`
- `Accept: application/json`

## Error Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "Error code (e.g., VALIDATION_ERROR, INTERNAL_ERROR)",
  "details": "Optional detailed error information"
}
```

## Endpoints

### POST /chat

Initiates a new conversation or continues an existing one with a question to the RAG chatbot.

#### Request

```json
{
  "question": "What is embodied AI?",
  "selected_text": "Optional selected text from the book that should be used as the sole context",
  "conversation_id": "Optional conversation ID to continue an existing conversation"
}
```

#### Request Validation
- `question` (string, required): Must be 1-2000 characters
- `selected_text` (string, optional): If provided, only this text will be used for context (1-5000 characters)
- `conversation_id` (string, optional): UUID format if provided

#### Response (Success)

```json
{
  "answer": "The answer to the question with inline citations like [Weeks 1-2: Foundations]",
  "sources": [
    {
      "chunk_id": "UUID of the source chunk",
      "chapter": "Chapter title",
      "section": "Section name",
      "file_path": "Path to source file",
      "relevance_score": 0.85
    }
  ],
  "conversation_id": "ID of the conversation (newly created or existing)",
  "query_type": "Type of query (conceptual, factual, code-related, comparison)",
  "timestamp": "ISO 8601 timestamp of response"
}
```

#### Response Codes
- `200`: Success - question processed and answer generated
- `400`: Bad Request - validation error in request body
- `422`: Unprocessable Entity - query too complex or unclear
- `500`: Internal Server Error - processing failed

#### Example Request

```json
{
  "question": "Explain the key principles of embodied AI",
  "selected_text": null,
  "conversation_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

#### Example Response

```json
{
  "answer": "Embodied AI is based on the principle that intelligence emerges from the interaction between an agent and its environment [Weeks 1-2: Foundations of Physical AI]. The key principles include situatedness, emergence, and the importance of physical embodiment for true intelligence [Weeks 1-2: Why humanoid form factor is the ultimate frontier for AI].",
  "sources": [
    {
      "chunk_id": "c1b2a3d4-e5f6-7890-1234-567890fedcba",
      "chapter": "Weeks 1-2 – Foundations of Physical AI & Embodied Intelligence",
      "section": "Foundations of Physical AI",
      "file_path": "docs/chapters/01-weeks-1-2-foundations/index.mdx",
      "relevance_score": 0.92
    },
    {
      "chunk_id": "d4c3b2a1-f6e5-0987-4321-abcdef987654",
      "chapter": "Weeks 1-2 – Foundations of Physical AI & Embodied Intelligence",
      "section": "Why humanoid form factor is the ultimate frontier for AI",
      "file_path": "docs/chapters/01-weeks-1-2-foundations/index.mdx",
      "relevance_score": 0.87
    }
  ],
  "conversation_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "query_type": "conceptual",
  "timestamp": "2025-12-06T10:30:00.123Z"
}
```

---

### GET /health

Health check endpoint to verify service availability.

#### Request

No request body required.

#### Response (Success)

```json
{
  "status": "healthy",
  "timestamp": "2025-12-06T10:30:00.123Z",
  "version": "1.0.0",
  "dependencies": {
    "groq": "connected",
    "qdrant": "connected",
    "neon": "connected"
  }
}
```

#### Response Codes
- `200`: All services healthy
- `503`: Service unavailable (one or more dependencies down)

---

### GET /conversations/{id}

Retrieve the history of a specific conversation.

#### Path Parameters
- `id` (string, required): UUID of the conversation to retrieve

#### Response (Success)

```json
{
  "conversation_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "title": "Embodied AI discussion",
  "created_at": "2025-12-06T09:00:00.000Z",
  "updated_at": "2025-12-06T10:30:00.000Z",
  "messages": [
    {
      "id": "m1n2o3p4-q5r6-7890-1234-567890abcdef",
      "role": "user",
      "content": "What is embodied AI?",
      "timestamp": "2025-12-06T09:05:00.000Z"
    },
    {
      "id": "n2o3p4q5-r6s7-8901-2345-67890abcdef1",
      "role": "assistant",
      "content": "Embodied AI is based on the principle that intelligence emerges from the interaction between an agent and its environment [Weeks 1-2: Foundations]",
      "sources": [
        {
          "chunk_id": "c1b2a3d4-e5f6-7890-1234-567890fedcba",
          "chapter": "Weeks 1-2 – Foundations of Physical AI & Embodied Intelligence",
          "section": "Foundations of Physical AI",
          "file_path": "docs/chapters/01-weeks-1-2-foundations/index.mdx"
        }
      ],
      "timestamp": "2025-12-06T09:05:02.000Z",
      "query_type": "conceptual"
    }
  ]
}
```

#### Response Codes
- `200`: Success - conversation history retrieved
- `404`: Conversation not found
- `500`: Internal Server Error

---

### POST /conversations/clear/{id}

Clear the history of a specific conversation (keeps the conversation record but removes messages).

#### Path Parameters
- `id` (string, required): UUID of the conversation to clear

#### Response (Success)

```json
{
  "status": "success",
  "message": "Conversation cleared successfully",
  "conversation_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "cleared_at": "2025-12-06T10:30:00.000Z"
}
```

#### Response Codes
- `200`: Success - conversation history cleared
- `404`: Conversation not found
- `500`: Internal Server Error

---

## Authentication

No authentication required for basic functionality. Optional user identification through user_id in conversation records.

## Rate Limiting

- Anonymous users: 100 requests per hour per IP
- Identified users: 1000 requests per hour per user_id

## CORS Policy

- Allowed origins: `http://localhost:3000`, `https://[github-username].github.io`
- Allowed methods: GET, POST
- Allowed headers: Content-Type, Accept

## Versioning

API versioning is handled through the service version reported in health checks. Breaking changes will result in new major version numbers.