from typing import Dict, Any, List, Optional
from .config import settings
import logging
import re
import google.generativeai as genai

logger = logging.getLogger(__name__)

class GenerationSystem:
    def __init__(self):
        # Initialize Google Gemini client
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    async def build_prompt(self, question: str, context: str, history: Optional[List[Dict[str, Any]]] = None) -> str:
        """Build a formatted prompt for the LLM"""
        prompt_parts = []

        # System message
        prompt_parts.append("You are an expert assistant for the 'Physical AI and Humanoid Robotics' textbook.")
        prompt_parts.append("Your role is to answer questions based on the provided context from the textbook when the question is related to the book content.")
        prompt_parts.append("Always cite the source of information using the format [Chapter X: Section Name] where X is the week number and Section Name is the section title when answering from the textbook context.")
        prompt_parts.append("However, if the question is general (not specifically about the textbook content) or if the provided context is not relevant to the question, use your general knowledge to provide a helpful answer.")
        prompt_parts.append("For general questions, answer to the best of your ability without requiring textbook citations.")
        prompt_parts.append("")

        # Add conversation history if available
        if history:
            prompt_parts.append("Previous conversation:")
            for msg in history[-4:]:  # Use last 4 messages to avoid token limits
                role = msg['role'].upper()
                content = msg['content']
                prompt_parts.append(f"{role}: {content}")
            prompt_parts.append("")

        # Add context
        prompt_parts.append("Context (from textbook):")
        prompt_parts.append(context if context.strip() else "No specific textbook context retrieved.")
        prompt_parts.append("")

        # Add the current question
        prompt_parts.append(f"Question: {question}")
        prompt_parts.append("Answer:")

        return "\n".join(prompt_parts)

    async def generate_response(self, question: str, context: str,
                               history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Generate response using Google Gemini API"""
        try:
            # Check if context is empty or just whitespace
            if not context.strip():
                # No context available, generate a general response
                return await self._generate_general_response(question, history)
            else:
                # Build the prompt with context
                prompt = await self.build_prompt(question, context, history)

                # Use Gemini API
                try:
                    response = await self.model.generate_content_async(
                        prompt,
                        generation_config={
                            "temperature": 0.3,
                            "max_output_tokens": 1000,
                        }
                    )

                    if response.text:
                        answer = response.text
                        citations = self._extract_citations(answer)
                        return {
                            'answer': answer,
                            'citations': citations
                        }
                    else:
                        # If context-based generation fails, try general response
                        return await self._generate_general_response(question, history)
                except Exception as e:
                    logger.error(f"Gemini generation with context failed: {e}")
                    # Try general response as fallback
                    return await self._generate_general_response(question, history)

        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return {
                'answer': "I encountered an error while generating the response. Please try again.",
                'citations': []
            }

    async def _generate_general_response(self, question: str, history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Generate a general response when no context is available"""
        try:
            prompt_parts = []

            # System message for general responses
            prompt_parts.append("You are an expert assistant for the 'Physical AI and Humanoid Robotics' textbook.")
            prompt_parts.append("You can answer general questions about robotics, AI, and related topics.")
            prompt_parts.append("If the question is about the textbook content, but you don't have specific context, provide a general answer based on your knowledge and suggest the user refer to the textbook for more detailed information.")
            prompt_parts.append("Always be helpful, accurate, and provide the best answer you can based on your general knowledge.")
            prompt_parts.append("")

            # Add conversation history if available
            if history:
                prompt_parts.append("Previous conversation:")
                for msg in history[-4:]:  # Use last 4 messages to avoid token limits
                    role = msg['role'].upper()
                    content = msg['content']
                    prompt_parts.append(f"{role}: {content}")
                prompt_parts.append("")

            # Add the current question
            prompt_parts.append(f"Question: {question}")
            prompt_parts.append("Answer:")

            general_prompt = "\n".join(prompt_parts)

            # Use Gemini API for general response
            response = await self.model.generate_content_async(
                general_prompt,
                generation_config={
                    "temperature": 0.5,  # Slightly higher for more creativity
                    "max_output_tokens": 1000,
                }
            )

            if response.text:
                answer = response.text
                return {
                    'answer': answer,
                    'citations': []
                }
            else:
                return {
                    'answer': "I couldn't generate a response. Please try again.",
                    'citations': []
                }
        except Exception as e:
            logger.error(f"General response generation failed: {e}")
            return {
                'answer': f"I encountered an error with the Gemini API: {str(e)}",
                'citations': []
            }

    def _extract_citations(self, text: str) -> List[str]:
        """Extract citations from the response in [Chapter X: Section Name] format"""
        # Pattern to match [Chapter X: Section Name] format
        pattern = r'\[Chapter [^:\]]+:[^\]]+\]'
        citations = re.findall(pattern, text)
        return citations

    async def format_sources(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format retrieved chunks as source objects"""
        sources = []
        for chunk in chunks:
            metadata = chunk.get('metadata', {})
            sources.append({
                'chapter': metadata.get('title', 'Unknown Chapter'),
                'section': metadata.get('week', 'Unknown Section'),
                'content': chunk.get('content', '')[:200] + "...",  # Truncate for display
                'file_path': chunk.get('source_file', ''),
                'relevance_score': chunk.get('score', 0.0)
            })
        return sources

# Global generation instance
generation_system = GenerationSystem()