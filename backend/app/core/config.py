from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI SaaS Dashboard 2026"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    GROQ_API_KEY: str
    class Config:
        env_file = ".env"
       
        extra = "ignore" 

settings = Settings()