from repositories.vehicle_repository import VehicleRepository
from repositories.policy_proposal_repository import PolicyProposalRepository
from repositories.quote_repository import QuoteRepository
from repositories.insurance_policy_repository import InsurancePolicyRepository
from repositories.policy_add_on_repository import PolicyAddOnRepository
from repositories.customer_repository import CustomerRepository
from models.vehicle import Vehicle
from models.policy_proposal import PolicyProposal
from models.payment import Payment
from enums import PolicyStatus, PaymentStatus
from utils.logger import log_info, log_error
from utils.db import get_connection
from datetime import datetime

class CustomerService:
    def __init__(self):
        self.vehicle_repo = VehicleRepository()
        self.proposal_repo = PolicyProposalRepository()
        self.quote_repo = QuoteRepository()
        self.policy_repo = InsurancePolicyRepository()
        self.addon_repo = PolicyAddOnRepository()
        self.customer_repo = CustomerRepository()

    def add_vehicle(self, customer_id, registration_number, chassis_number, engine_number,
                    category, manufacturer, model, variant, manufacture_year):
        vehicle = Vehicle(
            vehicle_id=None,
            customer_id=customer_id,
            registration_number=registration_number,
            chassis_number=chassis_number,
            engine_number=engine_number,
            category=category,
            manufacturer=manufacturer,
            model=model,
            variant=variant,
            manufacture_year=manufacture_year
        )
        saved = self.vehicle_repo.save(vehicle)
        if saved:
            log_info(f"Vehicle added successfully: {registration_number} (ID: {saved.id})")
        return saved

    def get_customer_vehicles(self, customer_id):
        return self.vehicle_repo.find_by_customer_id(customer_id)

    def get_vehicle_by_id(self, vehicle_id):
        return self.vehicle_repo.find_by_id(vehicle_id)

    def get_active_policies(self):
        return self.policy_repo.find_all(include_inactive=False)

    def get_active_addons(self):
        return self.addon_repo.find_all(include_inactive=False)

    def initiate_proposal(self, customer_id, vehicle_id, policy_id, add_on_ids=None):
        # Verify the vehicle belongs to the customer
        vehicle = self.vehicle_repo.find_by_id(vehicle_id)
        if not vehicle or vehicle.customer_id != customer_id:
            raise ValueError("Vehicle not found or does not belong to you.")

        # Verify the policy exists and is active
        policy = self.policy_repo.find_by_id(policy_id)
        if not policy or not policy.active:
            raise ValueError("Policy not found or is inactive.")

        # Create proposal with status PROPOSAL_SUBMITTED
        proposal = PolicyProposal(
            proposal_id=None,
            status=PolicyStatus.PROPOSAL_SUBMITTED.value,
            start_date=None,
            end_date=None,
            customer_id=customer_id,
            vehicle_id=vehicle_id,
            policy_id=policy_id,
            officer_id=None
        )
        saved_proposal = self.proposal_repo.save(proposal)
        if not saved_proposal:
            raise Exception("Failed to create proposal.")

        # Save add-on associations
        if add_on_ids:
            for addon_id in add_on_ids:
                self.proposal_repo.save_proposal_addon(saved_proposal.id, addon_id)

        log_info(f"Proposal initiated: ID {saved_proposal.id} for customer {customer_id}")
        return saved_proposal

    def get_customer_proposals(self, customer_id):
        return self.proposal_repo.find_all_by_customer_id(customer_id)

    def get_quote_for_proposal(self, proposal_id):
        return self.quote_repo.find_by_proposal_id(proposal_id)

    def get_policy_by_id(self, policy_id):
        return self.policy_repo.find_by_id(policy_id)

    def get_addon_by_id(self, addon_id):
        return self.addon_repo.find_by_id(addon_id)

    def make_payment(self, proposal_id):
        """Make payment for a quoted proposal, updating proposal status to ACTIVE."""
        proposal = self.proposal_repo.find_by_id(proposal_id)
        if not proposal:
            raise ValueError("Proposal not found.")
        if proposal.status != PolicyStatus.QUOTE_GENERATED.value:
            raise ValueError("Proposal is not in QUOTE_GENERATED status.")

        quote = self.quote_repo.find_by_proposal_id(proposal_id)
        if not quote:
            raise ValueError("No quote found for this proposal.")

        conn = get_connection()
        if not conn:
            raise Exception("Database connection failed.")
        try:
            cursor = conn.cursor()
            # Insert payment record
            cursor.execute(
                "INSERT INTO payment (status, amount, quote_id) VALUES (%s, %s, %s)",
                (PaymentStatus.SUCCESS.value, quote.calculated_amount, quote.id)
            )
            # Update proposal status to ACTIVE and set dates
            now = datetime.now().strftime('%Y-%m-%d')
            policy = self.policy_repo.find_by_id(proposal.policy_id)
            if policy:
                from dateutil.relativedelta import relativedelta
                end_date = (datetime.now() + relativedelta(months=policy.validity_months)).strftime('%Y-%m-%d')
            else:
                end_date = None
            cursor.execute(
                "UPDATE policy_proposal SET status = %s, start_date = %s, end_date = %s WHERE id = %s",
                (PolicyStatus.ACTIVE.value, now, end_date, proposal_id)
            )
            conn.commit()
            log_info(f"Payment successful for proposal {proposal_id}. Amount: {quote.calculated_amount}")
            return quote.calculated_amount
        except Exception as exception:
            conn.rollback()
            log_error(f"Payment failed for proposal {proposal_id}: {exception}")
            raise
        finally:
            conn.close()

    def cancel_proposal(self, proposal_id, customer_id):
        """Cancel a proposal that is in QUOTE_GENERATED status."""
        proposal = self.proposal_repo.find_by_id(proposal_id)
        if not proposal:
            raise ValueError("Proposal not found.")
        if proposal.customer_id != customer_id:
            raise ValueError("This proposal does not belong to you.")
        if proposal.status != PolicyStatus.QUOTE_GENERATED.value:
            raise ValueError("Only proposals with QUOTE_GENERATED status can be cancelled.")

        proposal.status = PolicyStatus.REJECTED.value
        self.proposal_repo.save(proposal)
        log_info(f"Proposal {proposal_id} cancelled by customer {customer_id}")
        return True
