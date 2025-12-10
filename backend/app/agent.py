from typing import Dict, Any, List, Optional
from .config import settings
import logging
from .db import db_manager

logger = logging.getLogger(__name__)

class Agent:
    def __init__(self):
        # Initialize Gemini client
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    async def analyze_query(self, question: str) -> Dict[str, Any]:
        """Analyze query to determine intent, type, and keywords"""
        try:
            prompt = f"""
            Analyze the following question and provide:
            1. Intent: What the user wants to achieve
            2. Type: One of: conceptual, factual, code-related, comparison, procedural
            3. Keywords: Important terms to focus on for retrieval
            4. Complexity: Simple, moderate, or complex

            Question: {question}

            Respond in JSON format with keys: intent, type, keywords, complexity
            """

            # Use Gemini API for query analysis
            try:
                response = await self.model.generate_content_async(
                    prompt,
                    generation_config={
                        "temperature": 0.1,
                        "max_output_tokens": 500,
                        "response_mime_type": "application/json",
                    }
                )

                if response.text:
                    import json
                    analysis = json.loads(response.text)
                    return analysis
                else:
                    logger.warning("Gemini returned empty response for query analysis, using default")
            except Exception as e:
                logger.error(f"Gemini query analysis failed: {e}")

            # If Gemini fails, return default analysis
            return {
                "intent": "information_request",
                "type": "factual",
                "keywords": question.split()[:5],  # Use first 5 words as keywords
                "complexity": "moderate"
            }

        except Exception as e:
            logger.error(f"Query analysis failed: {e}")
            # Return default analysis if all methods fail
            return {
                "intent": "information_request",
                "type": "factual",
                "keywords": question.split()[:5],  # Use first 5 words as keywords
                "complexity": "moderate"
            }

    async def select_strategy(self, question: str, selected_text: Optional[str] = None) -> str:
        """Select retrieval strategy based on query and context"""
        if selected_text is not None and selected_text.strip() != "":
            return "selected_only"
        else:
            return "whole_book"

    async def build_context(self, chunks: List[Dict[str, Any]], selected_text: Optional[str] = None) -> str:
        """Build context string from retrieved chunks"""
        if selected_text is not None and selected_text.strip() != "":
            # Use only the selected text as context
            return f"Context provided by user:\n{selected_text}"
        else:
            # Build context from retrieved chunks
            context_parts = []
            for chunk in chunks:
                content = chunk.get('content', '')
                metadata = chunk.get('metadata', {})
                source_file = chunk.get('source_file', '')

                # Format the chunk with metadata
                formatted_chunk = f"""
                Source: {metadata.get('title', 'Unknown')} - {metadata.get('week', '')}
                File: {source_file}
                Content: {content}

                Score: {chunk.get('score', 0.0)}
                ---
                """
                context_parts.append(formatted_chunk)

            return "\n".join(context_parts)

    async def track_conversation(self, conversation_id: str, question: str, answer: str, sources: List[Dict[str, Any]]):
        """Track conversation in database"""
        try:
            # Check if conversation exists, create if it doesn't
            conversation = await db_manager.get_conversation(conversation_id)
            if not conversation:
                # Create the conversation if it doesn't exist - use the provided conversation_id
                created_conversation_id = await db_manager.create_conversation(
                    conversation_id=conversation_id,
                    user_id=None,
                    title=question[:50] + "..." if len(question) > 50 else question
                )
                # Use the newly created conversation ID for message tracking
                actual_conversation_id = created_conversation_id
            else:
                # Use the existing conversation ID
                actual_conversation_id = conversation_id

            # Add user message
            await db_manager.add_message(
                conversation_id=actual_conversation_id,
                role="user",
                content=question
            )

            # Add assistant message with sources
            await db_manager.add_message(
                conversation_id=actual_conversation_id,
                role="assistant",
                content=answer,
                sources=sources
            )
        except Exception as e:
            logger.error(f"Failed to track conversation: {e}")
            # Don't fail the entire operation if database tracking fails

    async def get_conversation_history(self, conversation_id: str) -> List[Dict[str, Any]]:
        """Get conversation history from database"""
        try:
            # Check if conversation exists first
            conversation = await db_manager.get_conversation(conversation_id)
            if not conversation:
                # If conversation doesn't exist, return empty history
                return []

            return await db_manager.get_conversation_history(conversation_id)
        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []

# Global agent instance
agent = Agent()