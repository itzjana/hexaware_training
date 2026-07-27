import os
from dotenv import load_dotenv

load_dotenv()

class Env:
    # Database Settings
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")

    # Security Settings
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_EXPIRATION_HOURS = os.getenv("JWT_EXPIRATION_HOURS")
    BCRYPT_ROUNDS = os.getenv("BCRYPT_ROUNDS")

    # File Storage Settings
    FILE_UPLOAD_DIR = os.getenv("FILE_UPLOAD_DIR")
    FILE_UPLOAD_PUBLIC_DIR = os.getenv("FILE_UPLOAD_PUBLIC_DIR")

    # Business Settings
    OFFICER_TEMP_PASSWORD = os.getenv("OFFICER_TEMP_PASSWORD")
