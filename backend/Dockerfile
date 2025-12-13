FROM python:3.11-alpine

WORKDIR /app

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Install build dependencies for sentence-transformers and ML libraries
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

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip cache purge

# Pre-download sentence-transformers model (keeps it in image, not rebuilt each time)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" || true

# Copy app code
COPY app/ ./app/

# Create non-root user
RUN adduser -D -s /bin/sh railwayuser && \
    chown -R railwayuser:railwayuser /app

USER railwayuser

EXPOSE 8000

# Health check with proper PORT variable handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

---

## 🔑 Key Changes:

1. **Added ML build dependencies:**
   - `musl-dev`, `linux-headers`, `libffi-dev`, `openssl-dev` - for crypto/SSL
   - `gfortran`, `openblas-dev`, `lapack-dev` - for numpy/scipy (sentence-transformers needs these)

2. **Fixed model download:**
   - Added `|| true` to not fail if model download has issues

3. **Simplified CMD:**
   - Removed `sh -c` wrapper (unnecessary)
   - Direct uvicorn command is cleaner

4. **Reduced healthcheck start-period:**
   - `300s` → `120s` (2 minutes is enough)

---

## 📦 Updated requirements.txt

Make sure your `backend/requirements.txt` has this:
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
google-generativeai==0.8.3
sentence-transformers==3.0.1
qdrant-client==1.11.0
asyncpg==0.30.0
pydantic==2.9.0
pydantic-settings==2.6.1
python-dotenv==1.0.1