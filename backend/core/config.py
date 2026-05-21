from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    JWT_SECRET: str = "change-me"
    DATABASE_URL: str = "sqlite+aiosqlite:///./codebite.db"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    class Config:
        env_file = ".env"


settings = Settings()
