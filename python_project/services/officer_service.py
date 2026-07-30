from repositories.policy_proposal_repository import PolicyProposalRepository
from repositories.quote_repository import QuoteRepository
from repositories.vehicle_repository import VehicleRepository
from repositories.insurance_policy_repository import InsurancePolicyRepository
from repositories.policy_add_on_repository import PolicyAddOnRepository
from repositories.customer_repository import CustomerRepository
from models.quote import Quote
from enums import PolicyStatus
from utils.logger import log_info, log_error
from utils.db import get_connection
from datetime import datetime

class OfficerService:
    def __init__(self):
        self.proposal_repo = PolicyProposalRepository()
        self.quote_repo = QuoteRepository()
        self.vehicle_repo = VehicleRepository()
        self.policy_repo = InsurancePolicyRepository()
        self.addon_repo = PolicyAddOnRepository()
        self.customer_repo = CustomerRepository()

    def get_initiated_proposals(self):
        """Get all proposals with PROPOSAL_SUBMITTED status."""
        return self.proposal_repo.find_all_by_status(PolicyStatus.PROPOSAL_SUBMITTED.value)

    def get_officer_proposals(self, officer_id):
        """Get all proposals handled/assigned to this officer."""
        return self.proposal_repo.find_all_handled_by_officer(officer_id)

    def get_proposal_by_id(self, proposal_id):
        return self.proposal_repo.find_by_id(proposal_id)

    def get_vehicle_by_id(self, vehicle_id):
        return self.vehicle_repo.find_by_id(vehicle_id)

    def get_policy_by_id(self, policy_id):
        return self.policy_repo.find_by_id(policy_id)

    def get_addon_by_id(self, addon_id):
        return self.addon_repo.find_by_id(addon_id)

    def get_addons_for_proposal(self, proposal_id):
        return self.proposal_repo.find_addons_for_proposal(proposal_id)

    def get_customer_by_id(self, customer_id):
        """Find customer by customer table id (not user_id)."""
        conn = None
        try:
            from utils.db import get_connection
            from models.customer import Customer
            conn = get_connection()
            if not conn:
                return None
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM customer WHERE id = %s", (customer_id,))
            result = cursor.fetchone()
            if result:
                return Customer(
                    result['id'], result['name'], result['address'],
                    result['dob'], result['aadhar_number'], result['pan_number'], result['user_id']
                )
            return None
        except Exception as exception:
            log_error(f"Find Customer by ID failed: {exception}")
            return None
        finally:
            if conn:
                conn.close()

    def calculate_estimated_amount(self, proposal_id):
        """
        Calculate system estimated amount based on:
        - Policy base rate
        - Add-on costs
        - Vehicle condition multiplier (based on vehicle age)
        """
        proposal = self.proposal_repo.find_by_id(proposal_id)
        if not proposal:
            return 0.0

        # Get policy base rate
        policy = self.policy_repo.find_by_id(proposal.policy_id)
        if not policy:
            return 0.0
        base_amount = float(policy.base_rate)

        # Add add-on costs
        addon_ids = self.proposal_repo.find_addons_for_proposal(proposal_id)
        addon_total = 0.0
        for addon_id in addon_ids:
            addon = self.addon_repo.find_by_id(addon_id)
            if addon:
                addon_total += float(addon.additional_cost)

        total = base_amount + addon_total

        # Apply vehicle condition multiplier based on vehicle age
        vehicle = self.vehicle_repo.find_by_id(proposal.vehicle_id)
        if vehicle:
            current_year = datetime.now().year
            vehicle_age = current_year - int(vehicle.manufacture_year)
            if vehicle_age <= 1:
                multiplier = 1.0     # New vehicle - standard rate
            elif vehicle_age <= 3:
                multiplier = 1.1     # Slightly higher
            elif vehicle_age <= 5:
                multiplier = 1.2     # Moderate increase
            elif vehicle_age <= 10:
                multiplier = 1.35    # Older vehicle premium
            else:
                multiplier = 1.5     # Very old vehicle
            total *= multiplier

        return round(total, 2)

    def generate_quote(self, proposal_id, officer_id, amount):
        """
        Generate a quote for a proposal.
        Assigns the officer to the proposal and sets status to QUOTE_GENERATED.
        """
        proposal = self.proposal_repo.find_by_id(proposal_id)
        if not proposal:
            raise ValueError("Proposal not found.")
        if proposal.status != PolicyStatus.PROPOSAL_SUBMITTED.value:
            raise ValueError("Proposal is not in PROPOSAL_SUBMITTED status.")

        conn = get_connection()
        if not conn:
            raise Exception("Database connection failed.")
        try:
            cursor = conn.cursor()
            # Create quote record
            quote = Quote(
                quote_id=None,
                calculated_amount=amount,
                policy_proposal_id=proposal_id,
                officer_id=officer_id
            )
            saved_quote = self.quote_repo.save(quote, conn_inherited=conn)

            # Update proposal: assign officer and set status
            cursor.execute(
                "UPDATE policy_proposal SET status = %s, officer_id = %s WHERE id = %s",
                (PolicyStatus.QUOTE_GENERATED.value, officer_id, proposal_id)
            )
            conn.commit()
            log_info(f"Quote generated for proposal {proposal_id} by officer {officer_id}. Amount: {amount}")
            return saved_quote
        except Exception as exception:
            conn.rollback()
            log_error(f"Generate quote failed for proposal {proposal_id}: {exception}")
            raise
        finally:
            conn.close()
