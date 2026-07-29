from services.admin_service import AdminService
from utils.decorators import check_authentication, role_allowed

class AdminController:
    def __init__(self):
        self.admin_service = AdminService()

    @check_authentication
    @role_allowed("ADMIN")
    def create_insurance_policy(self, name, description, base_rate, validity_months, vehicle_category, vehicle_usage, fuel_type):
        try:
            policy = self.admin_service.create_insurance_policy(
                name, description, base_rate, validity_months, vehicle_category, vehicle_usage, fuel_type
            )
            if policy:
                print(f"\nSUCCESS: Insurance Policy '{name}' created successfully with ID {policy.id}.")
                return True
        except Exception as exception:
            print(f"\nERROR: Failed to create Insurance Policy: {exception}")
        return False

    @check_authentication
    @role_allowed("ADMIN")
    def list_insurance_policies(self, include_inactive=False):
        try:
            return self.admin_service.list_insurance_policies(include_inactive)
        except Exception as exception:
            print(f"\nERROR: Failed to list Insurance Policies: {exception}")
            return []

    @check_authentication
    @role_allowed("ADMIN")
    def soft_delete_insurance_policy(self, policy_id):
        try:
            if self.admin_service.soft_delete_insurance_policy(policy_id):
                print(f"\nSUCCESS: Insurance Policy ID {policy_id} deactivated (soft deleted).")
                return True
            else:
                print(f"\nERROR: Policy ID {policy_id} not found or already inactive.")
        except Exception as exception:
            print(f"\nERROR: Failed to delete Insurance Policy: {exception}")
        return False

    @check_authentication
    @role_allowed("ADMIN")
    def create_policy_add_on(self, name, description, additional_cost):
        try:
            addon = self.admin_service.create_policy_add_on(name, description, additional_cost)
            if addon:
                print(f"\nSUCCESS: Policy Add-On '{name}' created successfully with ID {addon.id}.")
                return True
        except Exception as exception:
            print(f"\nERROR: Failed to create Policy Add-On: {exception}")
        return False

    @check_authentication
    @role_allowed("ADMIN")
    def list_policy_add_ons(self, include_inactive=False):
        try:
            return self.admin_service.list_policy_add_ons(include_inactive)
        except Exception as exception:
            print(f"\nERROR: Failed to list Policy Add-Ons: {exception}")
            return []

    @check_authentication
    @role_allowed("ADMIN")
    def soft_delete_policy_add_on(self, addon_id):
        try:
            if self.admin_service.soft_delete_policy_add_on(addon_id):
                print(f"\nSUCCESS: Policy Add-On ID {addon_id} deactivated (soft deleted).")
                return True
            else:
                print(f"\nERROR: Policy Add-On ID {addon_id} not found or already inactive.")
        except Exception as exception:
            print(f"\nERROR: Failed to delete Policy Add-On: {exception}")
        return False
