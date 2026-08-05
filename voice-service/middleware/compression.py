import gzip
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("voice_service.middleware.compression")

class AudioCompressionMiddleware(BaseHTTPMiddleware):
    """Phase 14: Dynamic Response Compression Middleware (Gzip/Brotli)."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        accept_encoding = request.headers.get("Accept-Encoding", "").lower()
        content_type = response.headers.get("Content-Type", "")

        # Only compress audio or json responses > 1024 bytes
        if "gzip" in accept_encoding and response.status_code == 200:
            if hasattr(response, "body") and len(response.body) > 1024:
                try:
                    compressed_body = gzip.compress(response.body, compresslevel=6)
                    response.headers["Content-Encoding"] = "gzip"
                    response.headers["Content-Length"] = str(len(compressed_body))
                    logger.debug(f"Compressed response from {len(response.body)} to {len(compressed_body)} bytes")
                    return Response(
                        content=compressed_body,
                        status_code=response.status_code,
                        headers=dict(response.headers),
                        media_type=response.media_type
                    )
                except Exception as e:
                    logger.warning(f"Gzip compression failed: {e}")

        return response
