import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Solar Flare Backend"
    API_V1_STR: str = "/api"
    
    # Database Settings
    # Use SQLite by default for development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./solar_flare.db")
    
    # ISRO PRADAN Configuration
    ISRO_PRADAN_API_URL: str = os.getenv("ISRO_PRADAN_API_URL", "https://pradan.issdc.gov.in/api")
    ISRO_PRADAN_USERNAME: str = os.getenv("ISRO_PRADAN_USERNAME", "test_user")
    ISRO_PRADAN_PASSWORD: str = os.getenv("ISRO_PRADAN_PASSWORD", "test_pass")

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
