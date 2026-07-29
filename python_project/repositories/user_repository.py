from utils.db import get_connection
from models.user import User
from utils.logger import log_error

class UserRepository:
    def find_by_id(self, user_id):
        conn = get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM users WHERE id = %s", 
                (user_id,)
            )
            result = cursor.fetchone()
            if result:
                return User(result['id'], result['username'], result['email'], result['password'], result['role'])
            return None
        finally:
            conn.close()

    def find_by_username(self, username):
        conn = get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM users WHERE username = %s", 
                (username,)
            )
            result = cursor.fetchone()
            if result:
                return User(result['id'], result['username'], result['email'], result['password'], result['role'])
            return None
        finally:
            conn.close()

    def find_by_email(self, email):
        conn = get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM users WHERE email = %s", 
                (email,)
            )
            result = cursor.fetchone()
            if result:
                return User(result['id'], result['username'], result['email'], result['password'], result['role'])
            return None
        finally:
            conn.close()

    def save(self, user, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
                (user.username, user.email, user.password, user.role)
            )
            if not conn_inherited:
                conn.commit()
            user.id = cursor.lastrowid
            return user
        except Exception as exception:
            log_error(f"Save User failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()
