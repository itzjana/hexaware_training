import bcrypt
from utils.env import Env

# bcrypt works with bytes; decode strings to bytes and back

def hash_password(password):
    salt = bcrypt.gensalt(rounds=int(Env.BCRYPT_ROUNDS))
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False    