class VehicleNotFoundError(Exception):
    def __init__(self, vehicle_id=None):
        self.vehicle_id = vehicle_id
        msg = f"Vehicle with ID {vehicle_id} was not found." if vehicle_id else "Vehicle not found."
        super().__init__(msg)

class ProposalNotFoundError(Exception):
    def __init__(self, proposal_id=None):
        self.proposal_id = proposal_id
        msg = f"Proposal with ID {proposal_id} was not found." if proposal_id else "Proposal not found."
        super().__init__(msg)

class AddOnNotFoundError(Exception):
    def __init__(self, addon_id=None):
        self.addon_id = addon_id
        msg = f"Policy Add-On with ID {addon_id} was not found." if addon_id else "Policy Add-On not found."
        super().__init__(msg)

class ClaimNotFoundError(Exception):
    def __init__(self, claim_id=None):
        self.claim_id = claim_id
        msg = f"Claim with ID {claim_id} was not found." if claim_id else "Claim not found."
        super().__init__(msg)
