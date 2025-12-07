from typing import Dict, Any, List, Optional
from .config import settings
import logging
import re

logger = logging.getLogger(__name__)

class GenerationSystem:
    def __init__(self):
        # Initialize clients based on provider
        if settings.LLM_PROVIDER.lower() == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        else:  # Default to Groq
            from groq import AsyncGroq
            self.groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def build_prompt(self, question: str, context: str, history: Optional[List[Dict[str, Any]]] = None) -> str:
        """Build a formatted prompt for the LLM"""
        prompt_parts = []

        # System message
        prompt_parts.append("You are an expert assistant for the 'Physical AI and Humanoid Robotics' textbook.")
        prompt_parts.append("Your role is to answer questions based on the provided context from the textbook.")
        prompt_parts.append("Always cite the source of information using the format [Chapter X: Section Name] where X is the week number and Section Name is the section title.")
        prompt_parts.append("If the context doesn't contain the information needed to answer the question, say 'I don't have enough information in the provided context to answer this question.'")
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
        prompt_parts.append("Context:")
        prompt_parts.append(context)
        prompt_parts.append("")

        # Add the current question
        prompt_parts.append(f"Question: {question}")
        prompt_parts.append("Answer (with citations):")

        return "\n".join(prompt_parts)

    async def generate_response(self, question: str, context: str,
                               history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Generate response using selected LLM provider (Groq or Gemini)"""
        try:
            # Build the prompt
            prompt = await self.build_prompt(question, context, history)

            if settings.LLM_PROVIDER.lower() == "gemini":
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
                        return {
                            'answer': "I couldn't generate a response. Please try again.",
                            'citations': []
                        }
                except Exception as e:
                    logger.error(f"Gemini generation failed: {e}")
                    return {
                        'answer': f"I encountered an error with the Gemini API: {str(e)}",
                        'citations': []
                    }
            else:
                # Use Groq API (original implementation)
                try:
                    response = await self.groq_client.chat.completions.create(
                        model=settings.MODEL_NAME,
                        messages=[
                            {
                                "role": "system",
                                "content": "You are an expert assistant for the 'Physical AI and Humanoid Robotics' textbook. Answer questions based on the provided context and cite sources using [Chapter X: Section Name] format."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        temperature=0.3,  # Lower temperature for more factual responses
                        max_tokens=1000
                    )

                    # Extract the answer
                    answer = response.choices[0].message.content

                    # Extract citations from the response
                    citations = self._extract_citations(answer)

                    return {
                        'answer': answer,
                        'citations': citations
                    }
                except Exception as e:
                    logger.error(f"Groq generation failed: {e}")
                    return {
                        'answer': f"I encountered an error with the Groq API: {str(e)}",
                        'citations': []
                    }

        except Exception as e:
            logger.error(f"Generation failed: {e}")
            return {
                'answer': "I encountered an error while generating the response. Please try again.",
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