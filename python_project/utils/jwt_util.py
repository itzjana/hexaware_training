import jwt
from utils.logger import log_error
from datetime import datetime, timedelta, timezone
from utils.env import Env

SECRET_KEY = Env.JWT_SECRET

def generate_token(email, role):
    payload = {
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=Env.JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc) 
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=Env.JWT_ALGORITHM)
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=Env.JWT_ALGORITHM)
        return payload
    except Exception as exception:
        log_error(f"JWT Token Read Failed: {str(exception)}")
        return None