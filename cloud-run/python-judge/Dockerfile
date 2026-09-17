# Isolated Python grading judge for Cloud Run.
# Python 3.11 + Node 22 runtime for HTTP orchestration.
# Runs with unprivileged sandbox user and no network access.

FROM python:3.11-slim

# Install Node.js 22.x
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Add unprivileged sandbox user
RUN useradd -m -s /bin/bash sandbox

WORKDIR /app
COPY package.json ./
COPY server.js ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
