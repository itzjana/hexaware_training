from repositories.insurance_policy_repository import InsurancePolicyRepository
from repositories.policy_add_on_repository import PolicyAddOnRepository
from models.insurance_policy import InsurancePolicy
from models.policy_add_on import PolicyAddOn
from utils.logger import log_info, log_error

class AdminService:
    def __init__(self):
        self.policy_repo = InsurancePolicyRepository()
        self.addon_repo = PolicyAddOnRepository()

    def create_insurance_policy(self, name, description, base_rate, validity_months, vehicle_category, vehicle_usage, fuel_type):
        policy = InsurancePolicy(
            policy_id=None,
            policy_name=name,
            description=description,
            base_rate=base_rate,
            validity_months=validity_months,
            vehicle_category=vehicle_category,
            vehicle_usage=vehicle_usage,
            fuel_type=fuel_type,
            active=True
        )
        saved_policy = self.policy_repo.save(policy)
        if saved_policy:
            log_info(f"Insurance policy created successfully: {name} (ID: {saved_policy.id})")
        return saved_policy

    def list_insurance_policies(self, include_inactive=False):
        return self.policy_repo.find_all(include_inactive)

    def soft_delete_insurance_policy(self, policy_id):
        success = self.policy_repo.soft_delete(policy_id)
        if success:
            log_info(f"Insurance policy soft deleted: {policy_id}")
        else:
            log_error(f"Failed to soft delete insurance policy: {policy_id}")
        return success

    def create_policy_add_on(self, name, description, additional_cost):
        addon = PolicyAddOn(
            addon_id=None,
            name=name,
            description=description,
            additional_cost=additional_cost,
            active=True
        )
        saved_addon = self.addon_repo.save(addon)
        if saved_addon:
            log_info(f"Policy Add-On created successfully: {name} (ID: {saved_addon.id})")
        return saved_addon

    def list_policy_add_ons(self, include_inactive=False):
        return self.addon_repo.find_all(include_inactive)

    def soft_delete_policy_add_on(self, addon_id):
        success = self.addon_repo.soft_delete(addon_id)
        if success:
            log_info(f"Policy Add-On soft deleted: {addon_id}")
        else:
            log_error(f"Failed to soft delete policy add-on: {addon_id}")
        return success
