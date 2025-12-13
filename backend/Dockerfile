# Use smaller Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    adduser --disabled-password --gecos '' --uid 1000 railwayuser

# Copy requirements and install packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create non-root user and set permissions
RUN chown -R railwayuser:railwayuser /app

# Switch to non-root user
USER railwayuser

# Expose port (use PORT environment variable for Railway)
EXPOSE $PORT 8000

# Health check using curl (more reliable in Railway)
# Increased start period to allow for initial model download on first run
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
  CMD curl -f http://localhost:$PORT/health || curl -f http://localhost:8000/health || exit 1

# Start command using Railway PORT environment variable
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]