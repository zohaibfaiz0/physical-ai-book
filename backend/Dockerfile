# Use slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only requirements first (layer caching)
COPY requirements.txt .

# Install Python packages with no cache
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Pre-download model to cache during build (Railway friendly)
RUN python -c "from sentence_transformers import SentenceTransformer; import os; os.environ['TOKENIZERS_PARALLELISM'] = 'false'; model = SentenceTransformer('all-MiniLM-L6-v2'); print('Model all-MiniLM-L6-v2 cached successfully')"

# Copy ONLY app code (not entire backend folder)
COPY app/ ./app/

# Create non-root user for security
RUN adduser --disabled-password --gecos '' --uid 1000 railwayuser && \
    chown -R railwayuser:railwayuser /app

# Switch to non-root user
USER railwayuser

# Expose port (use PORT environment variable for Railway)
EXPOSE $PORT 8000

# Health check using curl (more reliable in Railway)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || curl -f http://localhost:8000/health || exit 1

# Start command using Railway PORT environment variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]