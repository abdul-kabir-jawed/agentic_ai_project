# main.py
"""Top-level entry point for Uvicorn.
This file imports the FastAPI `app` instance from the backend module.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Explicitly load .env from the backend directory
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / "backend" / ".env"
load_dotenv(dotenv_path=ENV_PATH, verbose=True, override=True)

from backend.main import app
