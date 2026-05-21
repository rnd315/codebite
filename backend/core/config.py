from pathlib import Path
from pydantic_settings import BaseSettings

# Resolve .env at the repo root regardless of working directory
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    JWT_SECRET: str
    DATABASE_URL: str = "sqlite+aiosqlite:///./codebite.db"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = str(_ENV_FILE)


settings = Settings()
