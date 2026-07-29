from utils.db import get_connection
from models.policy_add_on import PolicyAddOn
from utils.logger import log_error, log_info

class PolicyAddOnRepository:
    def save(self, addon, conn_inherited=None):
        conn = conn_inherited if conn_inherited else get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor()
            if addon.id is None:
                cursor.execute(
                    """INSERT INTO policy_add_on 
                       (name, description, additional_cost, active) 
                       VALUES (%s, %s, %s, %s)""",
                    (addon.name, addon.description, addon.additional_cost, int(addon.active))
                )
                if not conn_inherited:
                    conn.commit()
                addon.id = cursor.lastrowid
            else:
                cursor.execute(
                    """UPDATE policy_add_on SET 
                       name = %s, description = %s, additional_cost = %s, active = %s 
                       WHERE id = %s""",
                    (addon.name, addon.description, addon.additional_cost, int(addon.active), addon.id)
                )
                if not conn_inherited:
                    conn.commit()
            return addon
        except Exception as exception:
            log_error(f"Save PolicyAddOn failed: {exception}")
            raise
        finally:
            if not conn_inherited:
                conn.close()

    def find_by_id(self, addon_id):
        conn = get_connection()
        if not conn:
            return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM policy_add_on WHERE id = %s", (addon_id,))
            result = cursor.fetchone()
            if result:
                return PolicyAddOn(
                    addon_id=result['id'],
                    name=result['name'],
                    description=result['description'],
                    additional_cost=result['additional_cost'],
                    active=bool(result['active'])
                )
            return None
        except Exception as exception:
            log_error(f"Find PolicyAddOn by ID failed: {exception}")
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
                cursor.execute("SELECT * FROM policy_add_on")
            else:
                cursor.execute("SELECT * FROM policy_add_on WHERE active = 1")
            results = cursor.fetchall()
            addons = []
            for result in results:
                addons.append(
                    PolicyAddOn(
                        addon_id=result['id'],
                        name=result['name'],
                        description=result['description'],
                        additional_cost=result['additional_cost'],
                        active=bool(result['active'])
                    )
                )
            return addons
        except Exception as exception:
            log_error(f"Find all PolicyAddOns failed: {exception}")
            return []
        finally:
            conn.close()

    def soft_delete(self, addon_id):
        conn = get_connection()
        if not conn:
            return False
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE policy_add_on SET active = 0 WHERE id = %s", (addon_id,))
            conn.commit()
            return cursor.rowcount > 0
        except Exception as exception:
            log_error(f"Soft delete PolicyAddOn failed: {exception}")
            return False
        finally:
            conn.close()
