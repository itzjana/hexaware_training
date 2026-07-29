from utils.db import get_connection
from models.officer import Officer
from utils.logger import log_error

class OfficerRepository:
    def save(self, officer, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO officer (name, job_title, user_id) VALUES (%s, %s, %s)",
                (officer.name, officer.job_title, officer.user_id)
            )
            if not conn_inherited:
                conn.commit()
            officer.id = cursor.lastrowid
            return officer
        except Exception as exception:
            log_error(f"Save Officer failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_user_id(self, user_id):
        conn = get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "SELECT * FROM officer WHERE user_id = %s",
                (user_id,)
            )
            result = cursor.fetchone()
            if result:
                return Officer(
                    result['id'],
                    result['name'],
                    result['job_title'],
                    result['user_id']
                )
            return None
        finally:
            conn.close()
