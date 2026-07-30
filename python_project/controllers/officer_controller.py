from services.officer_service import OfficerService
from utils.decorators import check_authentication, role_allowed

class OfficerController:
    def __init__(self):
        self.officer_service = OfficerService()

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def list_initiated_proposals(self):
        try:
            return self.officer_service.get_initiated_proposals()
        except Exception as exception:
            print(f"\nERROR: Failed to list initiated proposals: {exception}")
            return []

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def list_my_proposals(self, officer_id):
        try:
            return self.officer_service.get_officer_proposals(officer_id)
        except Exception as exception:
            print(f"\nERROR: Failed to list officer proposals: {exception}")
            return []

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def get_proposal_details(self, proposal_id):
        try:
            return self.officer_service.get_proposal_by_id(proposal_id)
        except Exception as exception:
            print(f"\nERROR: Failed to get proposal details: {exception}")
            return None

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def get_estimated_amount(self, proposal_id):
        try:
            return self.officer_service.calculate_estimated_amount(proposal_id)
        except Exception as exception:
            print(f"\nERROR: Failed to calculate estimated amount: {exception}")
            return 0.0

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def generate_quote(self, proposal_id, officer_id, amount):
        try:
            quote = self.officer_service.generate_quote(proposal_id, officer_id, amount)
            if quote:
                print(f"\nSUCCESS: Quote generated for Proposal {proposal_id}. Amount: ₹{amount:.2f}")
                return quote
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to generate quote: {exception}")
        return None

    def get_vehicle_by_id(self, vehicle_id):
        return self.officer_service.get_vehicle_by_id(vehicle_id)

    def get_policy_by_id(self, policy_id):
        return self.officer_service.get_policy_by_id(policy_id)

    def get_addon_by_id(self, addon_id):
        return self.officer_service.get_addon_by_id(addon_id)

    def get_addons_for_proposal(self, proposal_id):
        return self.officer_service.get_addons_for_proposal(proposal_id)

    def get_customer_by_id(self, customer_id):
        return self.officer_service.get_customer_by_id(customer_id)
