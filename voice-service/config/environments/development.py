from pydantic_settings import BaseSettings

class DevSettings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 3005
    LOG_LEVEL: str = "DEBUG"

dev_settings = DevSettings()
