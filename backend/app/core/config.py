from pydantic_settings import BaseSettings
from pathlib import Path

# events path
BASE_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    DATABASE_URL: str = ""

    class Config:
        env_file = BASE_DIR / '.env'

settings = Settings()