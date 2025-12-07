import re
from pathlib import Path
from typing import Dict, Any, List
from .models import Source

def clean_markdown(text: str) -> str:
    """Remove frontmatter, code blocks, and other markdown elements from text"""
    # Remove YAML frontmatter
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.DOTALL)

    # Remove code blocks
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)

    # Remove inline code
    text = re.sub(r'`.*?`', '', text)

    # Remove markdown headers but keep the text
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)

    # Remove markdown links but keep the text: [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)

    # Remove markdown bold/italic
    text = re.sub(r'\*{1,2}([^*]+)\*{1,2}', r'\1', text)
    text = re.sub(r'_{1,2}([^_]+)_{1,2}', r'\1', text)

    # Remove extra whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)  # Remove extra blank lines
    text = re.sub(r'[ \t]+', ' ', text)  # Replace multiple spaces/tabs with single space

    return text.strip()

def extract_metadata_from_path(file_path: str) -> Dict[str, Any]:
    """Extract metadata from file path"""
    path = Path(file_path)

    # Extract chapter information from path
    # Expected format: docs/chapters/01-weeks-1-2-foundations/index.mdx
    parts = path.parts

    metadata = {}

    # Look for the chapter directory pattern
    for i, part in enumerate(parts):
        if 'weeks' in part.lower() and any(c.isdigit() for c in part):
            # Extract week info (e.g., from "01-weeks-1-2-foundations" -> "Weeks 1-2")
            week_match = re.search(r'weeks[-_]?(\d+)[-_\s]*(\d+)?', part, re.IGNORECASE)
            if week_match:
                start_week = week_match.group(1)
                end_week = week_match.group(2) if week_match.group(2) else start_week
                metadata['week'] = f"Weeks {start_week}-{end_week}"

            # Extract title from the folder name
            title_match = re.search(r'[-_](\w.*)', part)
            if title_match:
                title = title_match.group(1).replace('-', ' ').replace('_', ' ').title()
                metadata['title'] = title
            else:
                metadata['title'] = part.replace('-', ' ').replace('_', ' ').title()

    # Add file path
    metadata['file_path'] = str(path)

    return metadata

def format_sources(chunks: List[Dict[str, Any]]) -> List[Source]:
    """Format retrieved chunks as Source objects"""
    sources = []
    for chunk in chunks:
        metadata = chunk.get('metadata', {})
        sources.append(Source(
            chapter=metadata.get('title', 'Unknown Chapter'),
            section=metadata.get('week', 'Unknown Section'),
            content=chunk.get('content', '')[:200] + "...",  # Truncate for display
            file_path=chunk.get('source_file', ''),
            relevance_score=chunk.get('score', 0.0)
        ))
    return sources

def calculate_relevance_score(chunk: Dict[str, Any], query: str) -> float:
    """Calculate a basic relevance score based on keyword matching"""
    content = chunk.get('content', '').lower()
    query_lower = query.lower()

    # Count exact matches
    exact_matches = content.count(query_lower)

    # Count word matches
    query_words = query_lower.split()
    word_matches = sum(1 for word in query_words if word in content)

    # Combine scores
    score = (exact_matches * 2 + word_matches) / (len(query_words) + 1)

    # Normalize to 0-1 range
    return min(score, 1.0)