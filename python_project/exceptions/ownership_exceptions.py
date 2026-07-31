class UnauthorizedVehicleError(Exception):
    def __init__(self):
        super().__init__("This vehicle does not belong to your account.")

class UnauthorizedProposalError(Exception):
    def __init__(self):
        super().__init__("This proposal does not belong to your account.")

class UnauthorizedClaimError(Exception):
    def __init__(self):
        super().__init__("This claim does not belong to your account.")
