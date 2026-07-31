from exceptions.auth_exceptions import (
    DuplicateUsernameError,
    DuplicateEmailError,
)

from exceptions.not_found_exceptions import (
    VehicleNotFoundError,
    ProposalNotFoundError,
    AddOnNotFoundError,
    ClaimNotFoundError,
)

from exceptions.ownership_exceptions import (
    UnauthorizedVehicleError,
    UnauthorizedProposalError,
    UnauthorizedClaimError,
)

__all__ = [
    # Auth
    "DuplicateUsernameError",
    "DuplicateEmailError",
    # Not Found
    "VehicleNotFoundError",
    "ProposalNotFoundError",
    "AddOnNotFoundError",
    "ClaimNotFoundError",
    # Ownership
    "UnauthorizedVehicleError",
    "UnauthorizedProposalError",
    "UnauthorizedClaimError",
]
