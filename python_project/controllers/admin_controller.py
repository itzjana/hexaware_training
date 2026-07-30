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
    def toggle_insurance_policy_status(self, policy_id):
        try:
            new_status = self.admin_service.toggle_insurance_policy_status(policy_id)
            if new_status is not None:
                status_str = "activated" if new_status else "deactivated"
                print(f"\nSUCCESS: Insurance Policy ID {policy_id} is now {status_str}.")
                return True
            else:
                print(f"\nERROR: Policy ID {policy_id} not found.")
        except Exception as exception:
            print(f"\nERROR: Failed to toggle status of Insurance Policy: {exception}")
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
    def toggle_policy_add_on_status(self, addon_id):
        try:
            new_status = self.admin_service.toggle_policy_add_on_status(addon_id)
            if new_status is not None:
                status_str = "activated" if new_status else "deactivated"
                print(f"\nSUCCESS: Policy Add-On ID {addon_id} is now {status_str}.")
                return True
            else:
                print(f"\nERROR: Policy Add-On ID {addon_id} not found.")
        except Exception as exception:
            print(f"\nERROR: Failed to toggle status of Policy Add-On: {exception}")
        return False
