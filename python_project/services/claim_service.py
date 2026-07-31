from repositories.claim_repository import ClaimRepository
from repositories.policy_proposal_repository import PolicyProposalRepository
from repositories.quote_repository import QuoteRepository
from models.claim import Claim
from enums import ClaimStatus, PolicyStatus
from exceptions import (
    ProposalNotFoundError, UnauthorizedProposalError,
    ClaimNotFoundError, UnauthorizedClaimError
)
from utils.logger import log_info, log_error
from datetime import datetime

class ClaimService:
    def __init__(self):
        self.claim_repo = ClaimRepository()
        self.proposal_repo = PolicyProposalRepository()
        self.quote_repo = QuoteRepository()

    def raise_claim(self, customer_id, proposal_id, incident_description, estimated_amount):
        # 1. Verify the proposal exists and belongs to the customer
        proposal = self.proposal_repo.find_by_id(proposal_id)
        if not proposal:
            raise ProposalNotFoundError(proposal_id)
        if proposal.customer_id != customer_id:
            raise UnauthorizedProposalError()

        # 2. Verify the proposal is active
        if proposal.status != PolicyStatus.ACTIVE.value:
            raise ValueError(f"You can only raise claims on ACTIVE policies. Current status: {proposal.status}")

        # 3. Create the claim
        claim = Claim(
            claim_id=None,
            incident_description=incident_description,
            status=ClaimStatus.SUBMITTED.value,
            policy_proposal_id=proposal_id,
            estimated_amount=estimated_amount,
            offered_amount=0.0,
            officer_id=None
        )
        saved = self.claim_repo.save(claim)
        if saved:
            log_info(f"Claim raised successfully: ID {saved.id} for proposal {proposal_id}")
        return saved

    def get_customer_claims(self, customer_id):
        return self.claim_repo.find_all_by_customer_id(customer_id)

    def get_submitted_claims(self):
        return self.claim_repo.find_all_by_status(ClaimStatus.SUBMITTED.value)

    def get_officer_claims(self, officer_id):
        return self.claim_repo.find_all_by_officer_id(officer_id)

    def get_claim_by_id(self, claim_id):
        return self.claim_repo.find_by_id(claim_id)

    def calculate_suggested_offer(self, claim_id):
        """
        Calculate suggested offered amount based on:
        - Quote/payment amount
        - Policy validity (start_date to end_date)
        - Days elapsed since start_date
        """
        claim = self.claim_repo.find_by_id(claim_id)
        if not claim:
            raise ClaimNotFoundError(claim_id)

        proposal = self.proposal_repo.find_by_id(claim.policy_proposal_id)
        if not proposal or not proposal.start_date:
            return 0.0, 0, 0, 0.0

        quote = self.quote_repo.find_by_proposal_id(proposal.id)
        quote_amount = float(quote.calculated_amount) if quote else 0.0

        try:
            # Handle start_date and end_date (either string or date/datetime objects)
            start = proposal.start_date
            if isinstance(start, str):
                start = datetime.strptime(start[:10], '%Y-%m-%d').date()
            elif isinstance(start, datetime):
                start = start.date()

            end = proposal.end_date
            if isinstance(end, str):
                end = datetime.strptime(end[:10], '%Y-%m-%d').date()
            elif isinstance(end, datetime):
                end = end.date()

            current = datetime.now().date()

            total_days = (end - start).days
            elapsed_days = (current - start).days
            elapsed_days = max(0, min(elapsed_days, total_days))

            if total_days > 0:
                suggested_amount = round(quote_amount * (elapsed_days / total_days), 2)
            else:
                suggested_amount = quote_amount

            return suggested_amount, elapsed_days, total_days, quote_amount
        except Exception as e:
            log_error(f"Error calculating suggested claim offer: {e}")
            return 0.0, 0, 0, quote_amount

    def submit_claim_offer(self, claim_id, officer_id, offered_amount):
        claim = self.claim_repo.find_by_id(claim_id)
        if not claim:
            raise ClaimNotFoundError(claim_id)
        if claim.status != ClaimStatus.SUBMITTED.value:
            raise ValueError(f"Claim is not in SUBMITTED status. Current status: {claim.status}")

        claim.offered_amount = offered_amount
        claim.officer_id = officer_id
        claim.status = ClaimStatus.OFFERED.value

        saved = self.claim_repo.save(claim)
        if saved:
            log_info(f"Offer of ₹{offered_amount:.2f} submitted for Claim ID {claim_id} by Officer {officer_id}")
        return saved

    def respond_to_offer(self, claim_id, customer_id, accept=True):
        claim = self.claim_repo.find_by_id(claim_id)
        if not claim:
            raise ClaimNotFoundError(claim_id)

        # Verify proposal belongs to customer
        proposal = self.proposal_repo.find_by_id(claim.policy_proposal_id)
        if not proposal or proposal.customer_id != customer_id:
            raise UnauthorizedClaimError()

        if claim.status != ClaimStatus.OFFERED.value:
            raise ValueError(f"Claim is not in OFFERED status. Current status: {claim.status}")

        claim.status = ClaimStatus.ACCEPTED.value if accept else ClaimStatus.REJECTED.value
        saved = self.claim_repo.save(claim)
        if saved:
            log_info(f"Claim {claim_id} {claim.status} by customer {customer_id}")
        return saved
