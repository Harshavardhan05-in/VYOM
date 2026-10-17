"""
PhishShield AI — Application Settings
"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
from typing import List, Union
import json


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=("settings_",),
    )

    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    api_version: str = "v1"

    allowed_origins: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            v_trimmed = v.strip()
            if v_trimmed.startswith("["):
                try:
                    return json.loads(v_trimmed)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_path: str = "models/phishshield_model.joblib"
    max_url_length: int = 2048
    request_timeout_seconds: int = 30

    # Configurable Cyber Reporting Integration
    reporting_endpoint_url: Union[str, None] = None
    reporting_api_key: Union[str, None] = None
    reporting_department_name: Union[str, None] = None

    # Gmail Add-on Integration Configuration
    gmail_integration_api_key: Union[str, None] = None
    public_dashboard_url: str = "https://phish-shield-ai-pink.vercel.app"
    public_api_url: Union[str, None] = None


settings = Settings()
