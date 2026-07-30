from services.customer_service import CustomerService
from utils.decorators import check_authentication, role_allowed

class CustomerController:
    def __init__(self):
        self.customer_service = CustomerService()

    @check_authentication
    @role_allowed("CUSTOMER")
    def add_vehicle(self, customer_id, registration_number, chassis_number, engine_number,
                    category, manufacturer, model, variant, manufacture_year):
        try:
            vehicle = self.customer_service.add_vehicle(
                customer_id, registration_number, chassis_number, engine_number,
                category, manufacturer, model, variant, manufacture_year
            )
            if vehicle:
                print(f"\nSUCCESS: Vehicle '{manufacturer} {model}' added successfully with ID {vehicle.id}.")
                return vehicle
        except Exception as exception:
            print(f"\nERROR: Failed to add vehicle: {exception}")
        return None

    @check_authentication
    @role_allowed("CUSTOMER")
    def list_my_vehicles(self, customer_id):
        try:
            return self.customer_service.get_customer_vehicles(customer_id)
        except Exception as exception:
            print(f"\nERROR: Failed to list vehicles: {exception}")
            return []

    def list_active_policies(self):
        """Public method - no authentication required."""
        try:
            return self.customer_service.get_active_policies()
        except Exception as exception:
            print(f"\nERROR: Failed to list policies: {exception}")
            return []

    def list_active_addons(self):
        """Public method - no authentication required."""
        try:
            return self.customer_service.get_active_addons()
        except Exception as exception:
            print(f"\nERROR: Failed to list add-ons: {exception}")
            return []

    @check_authentication
    @role_allowed("CUSTOMER")
    def initiate_proposal(self, customer_id, vehicle_id, policy_id, add_on_ids=None):
        try:
            proposal = self.customer_service.initiate_proposal(
                customer_id, vehicle_id, policy_id, add_on_ids
            )
            if proposal:
                print(f"\nSUCCESS: Proposal initiated successfully with ID {proposal.id}.")
                return proposal
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to initiate proposal: {exception}")
        return None

    @check_authentication
    @role_allowed("CUSTOMER")
    def list_my_proposals(self, customer_id):
        try:
            return self.customer_service.get_customer_proposals(customer_id)
        except Exception as exception:
            print(f"\nERROR: Failed to list proposals: {exception}")
            return []

    @check_authentication
    @role_allowed("CUSTOMER")
    def get_quote_for_proposal(self, proposal_id):
        try:
            return self.customer_service.get_quote_for_proposal(proposal_id)
        except Exception as exception:
            print(f"\nERROR: Failed to get quote: {exception}")
            return None

    @check_authentication
    @role_allowed("CUSTOMER")
    def make_payment(self, proposal_id):
        try:
            amount = self.customer_service.make_payment(proposal_id)
            print(f"\nSUCCESS: Payment of ₹{amount:.2f} completed. Policy is now ACTIVE!")
            return True
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Payment failed: {exception}")
        return False

    @check_authentication
    @role_allowed("CUSTOMER")
    def cancel_proposal(self, proposal_id, customer_id):
        try:
            self.customer_service.cancel_proposal(proposal_id, customer_id)
            print(f"\nSUCCESS: Proposal {proposal_id} has been cancelled.")
            return True
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to cancel proposal: {exception}")
        return False

    def get_policy_by_id(self, policy_id):
        return self.customer_service.get_policy_by_id(policy_id)

    def get_addon_by_id(self, addon_id):
        return self.customer_service.get_addon_by_id(addon_id)
