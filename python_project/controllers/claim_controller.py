from services.claim_service import ClaimService
from utils.decorators import check_authentication, role_allowed

class ClaimController:
    def __init__(self):
        self.claim_service = ClaimService()

    @check_authentication
    @role_allowed("CUSTOMER")
    def raise_claim(self, customer_id, proposal_id, incident_description, estimated_amount):
        try:
            claim = self.claim_service.raise_claim(
                customer_id, proposal_id, incident_description, estimated_amount
            )
            if claim:
                print(f"\nSUCCESS: Claim for Proposal ID {proposal_id} raised successfully with Claim ID {claim.id}.")
                return claim
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to raise claim: {exception}")
        return None

    @check_authentication
    @role_allowed("CUSTOMER")
    def list_my_claims(self, customer_id):
        try:
            return self.claim_service.get_customer_claims(customer_id)
        except Exception as exception:
            print(f"\nERROR: Failed to list claims: {exception}")
            return []

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def list_submitted_claims(self):
        try:
            return self.claim_service.get_submitted_claims()
        except Exception as exception:
            print(f"\nERROR: Failed to list submitted claims: {exception}")
            return []

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def list_my_claims_officer(self, officer_id):
        try:
            return self.claim_service.get_officer_claims(officer_id)
        except Exception as exception:
            print(f"\nERROR: Failed to list officer claims: {exception}")
            return []

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def get_suggested_offer(self, claim_id):
        try:
            return self.claim_service.calculate_suggested_offer(claim_id)
        except Exception as exception:
            print(f"\nERROR: Failed to calculate suggested offer: {exception}")
            return 0.0, 0, 0, 0.0

    @check_authentication
    @role_allowed("INSURANCE_OFFICER")
    def submit_claim_offer(self, claim_id, officer_id, offered_amount):
        try:
            claim = self.claim_service.submit_claim_offer(claim_id, officer_id, offered_amount)
            if claim:
                print(f"\nSUCCESS: Claim ID {claim_id} status updated to OFFERED with amount ₹{offered_amount:.2f}.")
                return claim
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to submit claim offer: {exception}")
        return None

    @check_authentication
    @role_allowed("CUSTOMER")
    def respond_to_offer(self, claim_id, customer_id, accept=True):
        try:
            claim = self.claim_service.respond_to_offer(claim_id, customer_id, accept)
            if claim:
                action_str = "ACCEPTED" if accept else "REJECTED"
                print(f"\nSUCCESS: Claim ID {claim_id} has been {action_str}.")
                return claim
        except ValueError as ve:
            print(f"\nERROR: {ve}")
        except Exception as exception:
            print(f"\nERROR: Failed to respond to claim offer: {exception}")
        return None

    def get_claim_details(self, claim_id):
        try:
            return self.claim_service.get_claim_by_id(claim_id)
        except Exception:
            return None
