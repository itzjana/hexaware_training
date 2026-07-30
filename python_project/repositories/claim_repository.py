from utils.db import get_connection
from models.claim import Claim
from utils.logger import log_error

class ClaimRepository:
    def save(self, claim, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if claim.id is None:
                cursor.execute(
                    """INSERT INTO claim 
                       (incident_description, status, policy_proposal_id, estimated_amount, offered_amount, officer_id) 
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (claim.incident_description, claim.status, claim.policy_proposal_id,
                     claim.estimated_amount, claim.offered_amount, claim.officer_id)
                )
                if not conn_inherited:
                    conn.commit()
                claim.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE claim SET 
                       incident_description = %s, status = %s, policy_proposal_id = %s,
                       estimated_amount = %s, offered_amount = %s, officer_id = %s 
                       WHERE id = %s""",
                    (claim.incident_description, claim.status, claim.policy_proposal_id,
                     claim.estimated_amount, claim.offered_amount, claim.officer_id, claim.id)
                )
                if not conn_inherited:
                    conn.commit()
            return claim
        except Exception as exception:
            log_error(f"Save Claim failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_id(self, claim_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM claim WHERE id = %s", (claim_id,))
            result = cursor.fetchone()
            if result:
                return Claim(
                    claim_id=result['id'],
                    incident_description=result['incident_description'],
                    status=result['status'],
                    policy_proposal_id=result['policy_proposal_id'],
                    estimated_amount=result['estimated_amount'],
                    offered_amount=result['offered_amount'],
                    officer_id=result['officer_id']
                )
            return None
        except Exception as exception:
            log_error(f"Find Claim by ID failed: {exception}")
            return None
        finally:
            conn.close()

    def find_all_by_status(self, status):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM claim WHERE status = %s", (status,))
            results = cursor.fetchall()
            claims = []
            for result in results:
                claims.append(
                    Claim(
                        claim_id=result['id'],
                        incident_description=result['incident_description'],
                        status=result['status'],
                        policy_proposal_id=result['policy_proposal_id'],
                        estimated_amount=result['estimated_amount'],
                        offered_amount=result['offered_amount'],
                        officer_id=result['officer_id']
                    )
                )
            return claims
        except Exception as exception:
            log_error(f"Find Claims by status failed: {exception}")
            return []
        finally:
            conn.close()

    def find_all_by_customer_id(self, customer_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """SELECT c.* FROM claim c 
                   JOIN policy_proposal p ON c.policy_proposal_id = p.id 
                   WHERE p.customer_id = %s""",
                (customer_id,)
            )
            results = cursor.fetchall()
            claims = []
            for result in results:
                claims.append(
                    Claim(
                        claim_id=result['id'],
                        incident_description=result['incident_description'],
                        status=result['status'],
                        policy_proposal_id=result['policy_proposal_id'],
                        estimated_amount=result['estimated_amount'],
                        offered_amount=result['offered_amount'],
                        officer_id=result['officer_id']
                    )
                )
            return claims
        except Exception as exception:
            log_error(f"Find Claims by customer_id failed: {exception}")
            return []
        finally:
            conn.close()

    def find_all_by_officer_id(self, officer_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM claim WHERE officer_id = %s", (officer_id,))
            results = cursor.fetchall()
            claims = []
            for result in results:
                claims.append(
                    Claim(
                        claim_id=result['id'],
                        incident_description=result['incident_description'],
                        status=result['status'],
                        policy_proposal_id=result['policy_proposal_id'],
                        estimated_amount=result['estimated_amount'],
                        offered_amount=result['offered_amount'],
                        officer_id=result['officer_id']
                    )
                )
            return claims
        except Exception as exception:
            log_error(f"Find Claims by officer_id failed: {exception}")
            return []
        finally:
            conn.close()
