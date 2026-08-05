class VoiceServiceException(Exception):
    """Base exception for AI Voice Microservice."""
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class ModelInferenceException(VoiceServiceException):
    """Raised when ONNX neural model inference fails."""
    def __init__(self, message: str):
        super().__init__(message, status_code=500)

class CacheException(VoiceServiceException):
    """Raised when a storage cache operation fails."""
    def __init__(self, message: str):
        super().__init__(message, status_code=500)

class RateLimitExceededException(VoiceServiceException):
    """Raised when client IP exceeds rate limit."""
    def __init__(self, message: str = "Rate limit exceeded (60 requests in 60s)"):
        super().__init__(message, status_code=429)
