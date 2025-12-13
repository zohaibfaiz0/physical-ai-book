# Use smaller Python image and multi-stage build to reduce size
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# Pre-download model to cache
RUN python -c "from sentence_transformers import SentenceTransformer; import os; os.environ['TOKENIZERS_PARALLELISM'] = 'false'; model = SentenceTransformer('all-MiniLM-L6-v2'); print('Model all-MiniLM-L6-v2 cached successfully')"

# Production stage
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    adduser --disabled-password --gecos '' --uid 1000 railwayuser

# Copy installed packages from builder stage
COPY --from=builder /root/.local /home/railwayuser/.local

# Copy application code
COPY app/ ./app/

# Create non-root user and set permissions
RUN chown -R railwayuser:railwayuser /app
ENV PATH=/home/railwayuser/.local/bin:$PATH

# Switch to non-root user
USER railwayuser

# Expose port (use PORT environment variable for Railway)
EXPOSE $PORT 8000

# Health check using curl (more reliable in Railway)
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || curl -f http://localhost:8000/health || exit 1

# Start command using Railway PORT environment variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]