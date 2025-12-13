
  FROM python:3.11-alpine

  WORKDIR /app

  # Install only essential build dependencies
  RUN apk add --no-cache gcc g++ curl make

  # Copy and install requirements - install sentence-transformers separately for better caching
  COPY requirements.txt .
  RUN pip install --no-cache-dir --upgrade pip && \
      pip install --no-cache-dir fastapi==0.115.0 uvicorn[standard]==0.30.6 google-generativeai==0.8.0 && \
      pip install --no-cache-dir --force-reinstall --no-deps sentence-transformers==3.0.1 && \
      pip cache purge

  # Copy app code
  COPY app/ ./app/

  # Create non-root user
  RUN adduser -D -s /bin/sh railwayuser && \
      chown -R railwayuser:railwayuser /app
  USER railwayuser

  EXPOSE $PORT 8000

  HEALTHCHECK --interval=30s --timeout=10s --start-period=300s --retries=5 \
    CMD curl -f http://localhost:$PORT/health || exit 1

  CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]