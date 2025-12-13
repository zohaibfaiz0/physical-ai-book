
  FROM python:3.11-alpine

  WORKDIR /app

  # Set PYTHONPATH to ensure imports work correctly
  ENV PYTHONPATH=/app

  # Install only essential build dependencies
  RUN apk add --no-cache gcc g++ curl make

  # Copy and install requirements
  COPY requirements.txt .
  RUN pip install --no-cache-dir --upgrade pip && \
      pip install --no-cache-dir -r requirements.txt && \
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