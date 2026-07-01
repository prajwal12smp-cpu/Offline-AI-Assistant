from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "offline_ai_secret_key_for_local_use"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 1 week
    
    DB_URL: str = "sqlite:///./classroom_data.db"
    CHROMA_DATA_PATH: str = "chroma_db_store"

    class Config:
        env_file = ".env"

settings = Settings()
