# Stage 1, Risk 3 fix: real Java judge for Cloud Run.
# Node (for the HTTP server + Supabase auth check) + a real JDK (for javac/java) —
# the exact combination missing from production, where this route previously
# didn't exist as a server at all.

FROM eclipse-temurin:17-jdk-jammy

# Node.js 22.x — required: @supabase/supabase-js's realtime client throws at
# construction time on Node < 22 without native WebSocket support (discovered
# and fixed during local verification of this exact image — see git history).
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./

ENV PORT=8080
EXPOSE 8080

# Cloud Run injects PORT; this must not be hardcoded elsewhere.
CMD ["node", "server.js"]
