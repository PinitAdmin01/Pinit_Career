# Isolated JS grading judge. Node only — no JDK, no dependencies, no secrets.
# This container is never given NEXT_PUBLIC_SUPABASE_URL, any Supabase key, or
# QUEST_SIGNING_SECRET — that is the entire point (see server.js header).

FROM node:22-slim

WORKDIR /app
COPY package.json ./
COPY server.js ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
