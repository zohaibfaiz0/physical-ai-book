from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any, Optional
from .config import settings
import logging

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        try:
            self.client = QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
                prefer_grpc=False  # Using HTTP for compatibility
            )
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant client: {e}")
            # Set client to None to indicate it's not available
            self.client = None
        self.collection_name = settings.QDRANT_COLLECTION_NAME

    async def initialize_collection(self):
        """Create collection if it doesn't exist"""
        try:
            # Check if client is available
            if self.client is None:
                logger.warning("Qdrant client not available, skipping collection initialization")
                return

            # Check if collection exists
            collections = self.client.get_collections()
            collection_names = [c.name for c in collections.collections]

            if self.collection_name not in collection_names:
                # Create collection with 384-dimensional vectors (for all-MiniLM-L6-v2)
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=384,  # all-MiniLM-L6-v2 produces 384-dimensional vectors
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created collection '{self.collection_name}' with 384-dimensional vectors")
            else:
                logger.info(f"Collection '{self.collection_name}' already exists")
        except Exception as e:
            logger.error(f"Failed to initialize collection: {e}")
            # Don't raise the exception to allow the app to continue running

    async def upsert_documents(self, chunks: List[Dict[str, Any]]):
        """Upsert document chunks with embeddings and metadata"""
        try:
            # Check if client is available
            if self.client is None:
                logger.warning("Qdrant client not available, skipping document upsert")
                return

            # Prepare points for upsert
            points = []
            for i, chunk in enumerate(chunks):
                point = models.PointStruct(
                    id=chunk.get('id', i),  # Use provided ID or index
                    vector=chunk['embedding'],  # 384-dimensional vector
                    payload={
                        'content': chunk['content'],
                        'metadata': chunk.get('metadata', {}),
                        'source_file': chunk.get('source_file', ''),
                        'chunk_index': chunk.get('chunk_index', 0)
                    }
                )
                points.append(point)

            # Upsert points to collection
            self.client.upsert(
                collection_name=self.collection_name,
                points=points,
                wait=True
            )
            logger.info(f"Upserted {len(points)} document chunks to Qdrant")
        except Exception as e:
            logger.error(f"Failed to upsert documents: {e}")
            # Don't raise the exception to allow the app to continue running

    async def search(self, query_embedding: List[float], limit: int = 5,
                    filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search for similar vectors with optional metadata filtering"""
        try:
            # Check if client is available
            if self.client is None:
                logger.warning("Qdrant client not available, returning empty search results")
                return []

            # Prepare filters if provided
            qdrant_filters = None
            if filters:
                filter_conditions = []
                for key, value in filters.items():
                    if isinstance(value, str):
                        filter_conditions.append(
                            models.FieldCondition(
                                key=f"metadata.{key}",
                                match=models.MatchValue(value=value)
                            )
                        )
                    elif isinstance(value, list):
                        filter_conditions.append(
                            models.FieldCondition(
                                key=f"metadata.{key}",
                                match=models.MatchAny(any=value)
                            )
                        )

                if filter_conditions:
                    qdrant_filters = models.Filter(
                        must=filter_conditions
                    )

            # Perform search using query_points (new API)
            search_results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_embedding,
                limit=limit,
                query_filter=qdrant_filters,
                with_payload=True,
                with_vectors=False
            )

            # Format results
            results = []
            for hit in search_results.points:  # Access the points attribute in the new API
                results.append({
                    'id': hit.id,
                    'content': hit.payload.get('content', ''),
                    'metadata': hit.payload.get('metadata', {}),
                    'source_file': hit.payload.get('source_file', ''),
                    'score': hit.score,
                    'chunk_index': hit.payload.get('chunk_index', 0)
                })

            return results
        except Exception as e:
            logger.error(f"Search failed: {e}")
            # Return empty results instead of raising an exception
            return []

    async def count_documents(self) -> int:
        """Get the total count of documents in the collection"""
        try:
            # Check if client is available
            if self.client is None:
                logger.warning("Qdrant client not available, returning 0 document count")
                return 0

            count_result = self.client.count(
                collection_name=self.collection_name
            )
            return count_result.count
        except Exception as e:
            logger.error(f"Failed to count documents: {e}")
            return 0

    async def delete_collection(self):
        """Delete the entire collection (use with caution!)"""
        try:
            self.client.delete_collection(collection_name=self.collection_name)
            logger.info(f"Deleted collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Failed to delete collection: {e}")
            raise

# Global vector store instance
vector_store = VectorStore()