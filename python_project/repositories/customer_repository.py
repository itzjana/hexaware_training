from utils.db import get_connection
from models.customer import Customer
from utils.logger import log_error

class CustomerRepository:
    def save(self, customer, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO customer (name, address, dob, aadhar_number, pan_number, user_id) VALUES (%s, %s, %s, %s, %s, %s)",
                (customer.name, customer.address, customer.dob, customer.aadhar_number, customer.pan_number, customer.user_id)
            )
            if not conn_inherited:
                conn.commit()
            customer.id = cursor.lastrowid
            return customer
        except Exception as exception:
            log_error(f"Save Customer failed: {exception}")
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
                "SELECT * FROM customer WHERE user_id = %s",
                (user_id,)
            )
            result = cursor.fetchone()
            if result:
                return Customer(
                    result['id'],
                    result['name'],
                    result['address'],
                    result['dob'],
                    result['aadhar_number'],
                    result['pan_number'],
                    result['user_id']
                )
            return None
        finally:
            conn.close()
