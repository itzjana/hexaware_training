from utils.db import get_connection
from models.policy_proposal import PolicyProposal
from utils.logger import log_error

class PolicyProposalRepository:
    def save(self, proposal, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if proposal.id is None:
                cursor.execute(
                    """INSERT INTO policy_proposal 
                       (status, start_date, end_date, customer_id, vehicle_id, policy_id, officer_id) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                    (proposal.status, proposal.start_date, proposal.end_date, proposal.customer_id,
                     proposal.vehicle_id, proposal.policy_id, proposal.officer_id)
                )
                if not conn_inherited:
                    conn.commit()
                proposal.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE policy_proposal SET 
                       status = %s, start_date = %s, end_date = %s, customer_id = %s,
                       vehicle_id = %s, policy_id = %s, officer_id = %s 
                       WHERE id = %s""",
                    (proposal.status, proposal.start_date, proposal.end_date, proposal.customer_id,
                     proposal.vehicle_id, proposal.policy_id, proposal.officer_id, proposal.id)
                )
                if not conn_inherited:
                    conn.commit()
            return proposal
        except Exception as exception:
            log_error(f"Save PolicyProposal failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_id(self, proposal_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM policy_proposal WHERE id = %s", (proposal_id,))
            result = cursor.fetchone()
            if result:
                return PolicyProposal(
                    proposal_id=result['id'],
                    status=result['status'],
                    start_date=result['start_date'],
                    end_date=result['end_date'],
                    customer_id=result['customer_id'],
                    vehicle_id=result['vehicle_id'],
                    policy_id=result['policy_id'],
                    officer_id=result['officer_id']
                )
            return None
        except Exception as exception:
            log_error(f"Find PolicyProposal by ID failed: {exception}")
            return None
        finally:
            conn.close()

    def find_all_by_status(self, status):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM policy_proposal WHERE status = %s", (status,))
            results = cursor.fetchall()
            proposals = []
            for result in results:
                proposals.append(
                    PolicyProposal(
                        proposal_id=result['id'],
                        status=result['status'],
                        start_date=result['start_date'],
                        end_date=result['end_date'],
                        customer_id=result['customer_id'],
                        vehicle_id=result['vehicle_id'],
                        policy_id=result['policy_id'],
                        officer_id=result['officer_id']
                    )
                )
            return proposals
        except Exception as exception:
            log_error(f"Find PolicyProposals by status failed: {exception}")
            return []
        finally:
            conn.close()

    def find_all_by_customer_id(self, customer_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM policy_proposal WHERE customer_id = %s", (customer_id,))
            results = cursor.fetchall()
            proposals = []
            for result in results:
                proposals.append(
                    PolicyProposal(
                        proposal_id=result['id'],
                        status=result['status'],
                        start_date=result['start_date'],
                        end_date=result['end_date'],
                        customer_id=result['customer_id'],
                        vehicle_id=result['vehicle_id'],
                        policy_id=result['policy_id'],
                        officer_id=result['officer_id']
                    )
                )
            return proposals
        except Exception as exception:
            log_error(f"Find PolicyProposals by customer ID failed: {exception}")
            return []
        finally:
            conn.close()

    def find_all_handled_by_officer(self, officer_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM policy_proposal WHERE officer_id = %s", (officer_id,))
            results = cursor.fetchall()
            proposals = []
            for result in results:
                proposals.append(
                    PolicyProposal(
                        proposal_id=result['id'],
                        status=result['status'],
                        start_date=result['start_date'],
                        end_date=result['end_date'],
                        customer_id=result['customer_id'],
                        vehicle_id=result['vehicle_id'],
                        policy_id=result['policy_id'],
                        officer_id=result['officer_id']
                    )
                )
            return proposals
        except Exception as exception:
            log_error(f"Find PolicyProposals by officer ID failed: {exception}")
            return []
        finally:
            conn.close()

    def save_proposal_addon(self, proposal_id, addon_id, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return False
        try:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO policy_proposal_add_on (policy_proposal_id, policy_add_on_id) VALUES (%s, %s)",
                (proposal_id, addon_id)
            )
            if not conn_inherited:
                conn.commit()
            return True
        except Exception as exception:
            log_error(f"Save PolicyProposalAddOn failed: {exception}")
            return False
        finally:
            if not conn_inherited:
                conn.close()

    def find_addons_for_proposal(self, proposal_id):
        conn = get_connection()
        if not conn:
            return []
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT policy_add_on_id FROM policy_proposal_add_on WHERE policy_proposal_id = %s", (proposal_id,))
            results = cursor.fetchall()
            return [result['policy_add_on_id'] for result in results]
        except Exception as exception:
            log_error(f"Find add-ons for proposal failed: {exception}")
            return []
        finally:
            conn.close()
