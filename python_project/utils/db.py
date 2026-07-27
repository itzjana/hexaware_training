import mysql.connector
from utils.logger import log_error, log_info
from utils.env import Env

def get_connection():
    """Returns a direct database connection object."""
    try:
        conn = mysql.connector.connect(
            host=Env.DB_HOST,
            port=Env.DB_PORT,
            user=Env.DB_USER,
            password=Env.DB_PASSWORD,
            database=Env.DB_NAME
        )
        # log_info("Database Connection Established")
        return conn
    except Exception as exception:
        log_error(f"Database Connection Failed: {exception}")
        print("\n[ERROR] Database is unavailable. Please verify connection credentials.")
        return None