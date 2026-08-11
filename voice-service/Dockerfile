FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose microservice port
EXPOSE 3005

# Healthcheck — allow long cold start on free tier
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:3005/api/v1/health/live || curl -f http://localhost:3005/api/v1/health || exit 1

# Launch uvicorn web server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3005"]
