FROM python:3.11-alpine

WORKDIR /app

ENV PYTHONPATH=/app

RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    linux-headers \
    libffi-dev \
    openssl-dev \
    curl \
    make \
    gfortran \
    openblas-dev \
    lapack-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip cache purge

RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" || true

COPY app/ ./app/

RUN adduser -D -s /bin/sh railwayuser && \
    chown -R railwayuser:railwayuser /app

USER railwayuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}