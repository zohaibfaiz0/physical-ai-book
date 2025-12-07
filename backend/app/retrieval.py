from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from .vector_store import vector_store
from .config import settings
import logging

logger = logging.getLogger(__name__)

class RetrievalSystem:
    def __init__(self):
        # Initialize the embedding model for queries
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

    async def embed_query(self, question: str) -> List[float]:
        """Generate embedding for a query"""
        embedding = self.embedding_model.encode(question).tolist()
        return embedding

    async def retrieve(self, question: str, selected_text: Optional[str] = None,
                      filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Retrieve relevant chunks based on strategy"""
        if selected_text is not None and selected_text.strip() != "":
            # Use only selected text strategy
            return await self._retrieve_selected_text(selected_text)
        else:
            # Use whole book strategy with vector search
            return await self._retrieve_whole_book(question, filters)

    async def _retrieve_selected_text(self, selected_text: str) -> List[Dict[str, Any]]:
        """Handle retrieval when user provides specific text"""
        # Generate embedding for the selected text
        embedding = self.embedding_model.encode(selected_text).tolist()

        # Return as a single chunk with high relevance
        return [{
            'id': 'selected_text_chunk',
            'content': selected_text,
            'metadata': {'source': 'user_selected'},
            'score': 1.0,  # Highest relevance
            'source_file': 'user_input'
        }]

    async def _retrieve_whole_book(self, question: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Handle retrieval from the entire book using vector search"""
        try:
            # Generate embedding for the question
            query_embedding = await self.embed_query(question)

            # Perform vector search
            results = await vector_store.search(
                query_embedding=query_embedding,
                limit=5,
                filters=filters
            )

            return results
        except Exception as e:
            logger.error(f"Vector store retrieval failed: {e}")
            # Return empty results instead of failing the entire request
            return []

    async def retrieve_with_metadata_filter(self, question: str, metadata_filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Retrieve with specific metadata filters"""
        try:
            # Generate embedding for the question
            query_embedding = await self.embed_query(question)

            # Perform vector search with metadata filters
            results = await vector_store.search(
                query_embedding=query_embedding,
                limit=5,
                filters=metadata_filters
            )

            return results
        except Exception as e:
            logger.error(f"Vector store retrieval with metadata filters failed: {e}")
            # Return empty results instead of failing the entire request
            return []

# Global retrieval instance
retrieval_system = RetrievalSystem()