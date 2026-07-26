"""Central configuration for MediCore AI, loaded from .env"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # LLM providers
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Database
    database_url: str = "sqlite:///./data/medicore.db"

    # Vector store
    chroma_persist_dir: str = "./data/chroma"

    # Backend
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    backend_base_url: str = "http://localhost:8000"

    # Frontend
    gradio_patient_port: int = 7860
    gradio_admin_port: int = 7861

    # Clinic identity
    clinic_name: str = "Sunrise Family Clinic"
    clinic_address: str = "123 Main St, Springfield"


settings = Settings()
