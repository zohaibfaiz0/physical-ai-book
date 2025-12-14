import os
import asyncio
import hashlib
from pathlib import Path
from typing import List, Dict, Any
import google.generativeai as genai
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .vector_store import vector_store
from .db import db_manager
from .utils import clean_markdown, extract_metadata_from_path
from .config import settings
import logging
import re

logger = logging.getLogger(__name__)

class IngestionPipeline:
    def __init__(self):
        # Initialize Google's embedding model
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.embedding_model = genai.embed_content
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

    async def run_ingestion(self, docs_path: str = "../docs"):
        """Run the complete ingestion pipeline"""
        logger.info("Starting ingestion pipeline...")
        
        # Convert to Path and verify
        docs_path = Path(docs_path)
        
        if not docs_path.exists():
            logger.error(f"❌ Path does not exist: {docs_path}")
            return 0
        
        logger.info(f"✓ Looking for MDX files in: {docs_path}")

        # Get all MDX files
        mdx_files = self._find_mdx_files(str(docs_path))
        logger.info(f"Found {len(mdx_files)} MDX files to process")
        
        if len(mdx_files) == 0:
            logger.warning(f"⚠️ No MDX files found!")
            return 0

        total_chunks = 0

        for i, file_path in enumerate(mdx_files):
            logger.info(f"Processing file {i+1}/{len(mdx_files)}: {file_path.name}")

            try:
                # Read and parse the MDX file
                content, metadata = self._parse_mdx_file(file_path)

                # Add file-specific metadata
                file_metadata = extract_metadata_from_path(str(file_path))
                metadata.update(file_metadata)

                # Split content into chunks
                chunks = self.text_splitter.split_text(content)

                # Generate embeddings for all chunks using Google's API
                embeddings_response = self.embedding_model(
                    model="models/embedding-001",
                    content=chunks,
                    task_type="RETRIEVAL_DOCUMENT"
                )
                embeddings = embeddings_response['embedding']

                # Prepare batch data for vector store
                chunk_data_batch = []
                for j, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                    # Generate numeric ID from string (Qdrant requires int or UUID)
                    original_id = f"{file_path.stem}_chunk_{j}"
                    # Create deterministic numeric ID using hash
                    numeric_id = int(hashlib.md5(original_id.encode()).hexdigest()[:8], 16)
                    
                    chunk_data = {
                        'id': numeric_id,  # Numeric ID for Qdrant
                        'content': chunk,
                        'embedding': embedding,
                        'metadata': {
                            **metadata,
                            'source_file': str(file_path),
                            'chunk_index': j,
                            'original_id': original_id,  # Keep string ID as metadata
                            'file_name': file_path.name
                        }
                    }
                    chunk_data_batch.append(chunk_data)

                # Batch upsert to vector store
                if chunk_data_batch:
                    await vector_store.upsert_documents(chunk_data_batch)
                    
                    # Add to database
                    for chunk in chunks:
                        await db_manager.add_document_chunk(chunk, metadata)

                total_chunks += len(chunks)
                logger.info(f"✓ Processed {len(chunks)} chunks from {file_path.name}")

            except Exception as e:
                logger.error(f"❌ Error processing file {file_path}: {e}", exc_info=True)
                continue

        logger.info(f"🎉 Ingestion completed! Processed {total_chunks} total chunks from {len(mdx_files)} files")
        return total_chunks

    def _find_mdx_files(self, docs_path: str) -> List[Path]:
        """Recursively find all MDX files in the docs directory"""
        docs_dir = Path(docs_path).resolve()
        mdx_files = list(docs_dir.rglob("*.mdx"))
        return mdx_files

    def _parse_mdx_file(self, file_path: Path) -> tuple[str, Dict[str, Any]]:
        """Parse MDX file and extract content and metadata"""
        content = file_path.read_text(encoding='utf-8')

        # Extract frontmatter if present
        frontmatter = {}
        content_without_frontmatter = content

        # Look for YAML frontmatter between --- delimiters
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
        if frontmatter_match:
            frontmatter_str = frontmatter_match.group(1)
            content_without_frontmatter = frontmatter_match.group(2)

            # Parse frontmatter
            for line in frontmatter_str.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip().strip('"\'')

        # Clean the markdown content
        cleaned_content = clean_markdown(content_without_frontmatter)

        return cleaned_content, frontmatter

# Global ingestion instance
ingestion_pipeline = IngestionPipeline()