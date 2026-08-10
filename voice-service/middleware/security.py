import time
import uuid
import logging
from collections import defaultdict
from fastapi import Request, HTTPException, Response
from starlette.middleware.base import BaseHTTPMiddleware
from config.settings import settings

logger = logging.getLogger("voice_service.middleware.security")

# In-memory Rate Limiting Store: client_ip -> list of timestamps
RATE_LIMIT_STORE = defaultdict(list)
MAX_REQUESTS_PER_MINUTE = 60
WINDOW_SECONDS = 60.0

class SecurityAndRateLimitMiddleware(BaseHTTPMiddleware):
    """Phase 13: Security & Rate Limiting Middleware."""

    async def dispatch(self, request: Request, call_next):
        client_ip = "127.0.0.1"
        try:
            if request.client and hasattr(request.client, "host"):
                client_ip = request.client.host or "127.0.0.1"
        except Exception:
            client_ip = "127.0.0.1"
            
        now = time.time()

        # Clean old timestamps outside window
        timestamps = [t for t in RATE_LIMIT_STORE[client_ip] if now - t < WINDOW_SECONDS]
        RATE_LIMIT_STORE[client_ip] = timestamps

        # Enforce rate limit (skip health check endpoint)
        if not request.url.path.startswith("/api/v1/health") and request.url.path not in ["/", "/health", "/docs", "/openapi.json"]:
            if len(timestamps) >= MAX_REQUESTS_PER_MINUTE:
                logger.warning(f"Rate limit exceeded for IP {client_ip} ({len(timestamps)} requests in 60s)")
                return Response(
                    content='{"detail": "Rate limit exceeded. Maximum 60 requests per minute allowed."}',
                    status_code=429,
                    media_type="application/json",
                    headers={"Retry-After": "60"}
                )

            # Record current request timestamp
            RATE_LIMIT_STORE[client_ip].append(now)

        # Generate or capture distributed Request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id

        try:
            # Process request
            response = await call_next(request)
        except Exception as err:
            logger.error(f"Middleware error: {err}")
            response = Response(
                content=f'{{"error": "Internal Server Error", "detail": "{str(err)}"}}',
                status_code=500,
                media_type="application/json"
            )

        # Inject Security & Tracing Headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-RateLimit-Limit"] = str(MAX_REQUESTS_PER_MINUTE)
        response.headers["X-RateLimit-Remaining"] = str(max(0, MAX_REQUESTS_PER_MINUTE - len(timestamps) - 1))

        return response
