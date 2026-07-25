from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Portfolio CMS"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite+aiosqlite:///./portfolio.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production-abc123xyz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "Admin@123456"
    ADMIN_EMAIL: str = "admin@portfolio.com"

    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://mydomain.com"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
