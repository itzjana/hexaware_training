from utils.db import get_connection
from models.quote import Quote
from utils.logger import log_error

class QuoteRepository:
    def save(self, quote, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if quote.id is None:
                cursor.execute(
                    """INSERT INTO quote 
                       (calculated_amount, policy_proposal_id, officer_id) 
                       VALUES (%s, %s, %s)""",
                    (quote.calculated_amount, quote.policy_proposal_id, quote.officer_id)
                )
                if not conn_inherited:
                    conn.commit()
                quote.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE quote SET 
                       calculated_amount = %s, policy_proposal_id = %s, officer_id = %s 
                       WHERE id = %s""",
                    (quote.calculated_amount, quote.policy_proposal_id, quote.officer_id, quote.id)
                )
                if not conn_inherited:
                    conn.commit()
            return quote
        except Exception as exception:
            log_error(f"Save Quote failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_proposal_id(self, proposal_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM quote WHERE policy_proposal_id = %s", (proposal_id,))
            result = cursor.fetchone()
            if result:
                return Quote(
                    quote_id=result['id'],
                    calculated_amount=result['calculated_amount'],
                    policy_proposal_id=result['policy_proposal_id'],
                    officer_id=result['officer_id']
                )
            return None
        except Exception as exception:
            log_error(f"Find Quote by proposal ID failed: {exception}")
            return None
        finally:
            conn.close()
