FROM python:3.10-slim

WORKDIR /app

# Install system audio & build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libsndfile1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose microservice port
EXPOSE 3005

# Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3005/api/v1/health || exit 1

# Launch uvicorn web server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3005"]
