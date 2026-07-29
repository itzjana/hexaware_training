from utils.db import get_connection
from models.insurance_policy import InsurancePolicy
from utils.logger import log_error, log_info

class InsurancePolicyRepository:
    def save(self, policy, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if policy.id is None:
                cursor.execute(
                    """INSERT INTO insurance_policy 
                       (policy_name, description, base_rate, validity_months, vehicle_category, vehicle_usage, fuel_type, active) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    (policy.policy_name, policy.description, policy.base_rate, policy.validity_months,
                     policy.vehicle_category, policy.vehicle_usage, policy.fuel_type, int(policy.active))
                )
                if not conn_inherited:
                    conn.commit()
                policy.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE insurance_policy SET 
                       policy_name = %s, description = %s, base_rate = %s, validity_months = %s,
                       vehicle_category = %s, vehicle_usage = %s, fuel_type = %s, active = %s 
                       WHERE id = %s""",
                    (policy.policy_name, policy.description, policy.base_rate, policy.validity_months,
                     policy.vehicle_category, policy.vehicle_usage, policy.fuel_type, int(policy.active), policy.id)
                )
                if not conn_inherited:
                    conn.commit()
            return policy
        except Exception as exception:
            log_error(f"Save InsurancePolicy failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_id(self, policy_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM insurance_policy WHERE id = %s", (policy_id,))
            result = cursor.fetchone()
            if result:
                return InsurancePolicy(
                    policy_id=result['id'],
                    policy_name=result['policy_name'],
                    description=result['description'],
                    base_rate=result['base_rate'],
                    validity_months=result['validity_months'],
                    vehicle_category=result['vehicle_category'],
                    vehicle_usage=result['vehicle_usage'],
                    fuel_type=result['fuel_type'],
                    active=bool(result['active'])
                )
            return None
        except Exception as exception:
            log_error(f"Find InsurancePolicy by ID failed: {exception}")
            return None
        finally:
            conn.close()

    def find_all(self, include_inactive=False):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            if include_inactive:
                cursor.execute("SELECT * FROM insurance_policy")
            else:
                cursor.execute("SELECT * FROM insurance_policy WHERE active = 1")
            results = cursor.fetchall()
            policies = []
            for result in results:
                policies.append(
                    InsurancePolicy(
                        policy_id=result['id'],
                        policy_name=result['policy_name'],
                        description=result['description'],
                        base_rate=result['base_rate'],
                        validity_months=result['validity_months'],
                        vehicle_category=result['vehicle_category'],
                        vehicle_usage=result['vehicle_usage'],
                        fuel_type=result['fuel_type'],
                        active=bool(result['active'])
                    )
                )
            return policies
        except Exception as exception:
            log_error(f"Find all InsurancePolicies failed: {exception}")
            return []
        finally:
            conn.close()

    def soft_delete(self, policy_id):
        conn = get_connection()
        if not conn:
            return False
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE insurance_policy SET active = 0 WHERE id = %s", (policy_id,))
            conn.commit()
            return cursor.rowcount > 0
        except Exception as exception:
            log_error(f"Soft delete InsurancePolicy failed: {exception}")
            return False
        finally:
            conn.close()
