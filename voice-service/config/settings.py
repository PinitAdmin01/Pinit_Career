import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "PinIT Careers AI Voice Service"
    APP_VERSION: str = "1.0.0"
    ENV: str = "production"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 3005
    
    # Model & Audio Settings
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    DEFAULT_MODEL_NAME: str = "kokoro-v0_19.onnx"
    SAMPLE_RATE: int = 24000
    DEFAULT_VOICE: str = "af_bella"
    DEFAULT_SPEED: float = 1.0
    
    # Storage & Cache Settings
    CACHE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio_cache")
    ENABLE_SSD_CACHE: bool = True
    
    # Supabase Cloud Storage
    SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://wjheumrorddbkvoczuuw.supabase.co")
    SUPABASE_KEY: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    SUPABASE_BUCKET: str = "voice_audio_cache"
    
    # Security & CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
