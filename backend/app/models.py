from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class Source(BaseModel):
    chapter: str
    section: str
    content: str
    file_path: str
    relevance_score: Optional[float] = 0.0

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    selected_text: Optional[str] = Field(None, max_length=5000)
    conversation_id: Optional[str] = Field(None, min_length=1)

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    conversation_id: str
    query_type: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: str
    version: str
    services: dict

class ConversationHistoryResponse(BaseModel):
    conversation_id: str
    title: Optional[str] = None
    created_at: str
    updated_at: str
    messages: List[dict]