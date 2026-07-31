import pytest
import os
import json
from unittest.mock import MagicMock, patch, mock_open
from datetime import datetime, date

from utils.password_util import hash_password, verify_password
from utils.jwt_util import generate_token, decode_token
from services.auth_service import AuthService
from services.admin_service import AdminService
from services.claim_service import ClaimService
from services.customer_service import CustomerService
from services.officer_service import OfficerService

from models.user import User
from models.customer import Customer
from models.officer import Officer
from models.insurance_policy import InsurancePolicy
from models.policy_add_on import PolicyAddOn
from models.claim import Claim
from models.vehicle import Vehicle
from models.policy_proposal import PolicyProposal
from models.quote import Quote
from enums import Role, ClaimStatus, PolicyStatus, PaymentStatus

# 1. Utility test - Password hashing
def test_password_utility():
    pw = "mysecret123"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed)
    assert not verify_password("wrongpassword", hashed)

# 2. Utility test - JWT Token generation & decoding
def test_jwt_utility():
    email = "test@example.com"
    role = "CUSTOMER"
    token = generate_token(email, role)
    assert token is not None
    payload = decode_token(token)
    assert payload is not None
    assert payload["email"] == email
    assert payload["role"] == role

# Fixture for AuthService
@pytest.fixture
def auth_service():
    with patch("services.auth_service.UserRepository") as MockUserRepo, \
         patch("services.auth_service.CustomerRepository") as MockCustRepo, \
         patch("services.auth_service.OfficerRepository") as MockOffRepo:
        
        service = AuthService()
        service.user_repo = MockUserRepo.return_value
        service.customer_repo = MockCustRepo.return_value
        service.officer_repo = MockOffRepo.return_value
        yield service

# 3. AuthService test - check username exists
def test_auth_check_username_exists(auth_service):
    auth_service.user_repo.find_by_username.return_value = User(1, "user1", "email1", "pwd", "CUSTOMER")
    assert auth_service.check_username_exists("user1") is True
    
    auth_service.user_repo.find_by_username.return_value = None
    assert auth_service.check_username_exists("user2") is False

# 4. AuthService test - admin signup success
def test_auth_admin_signup_success(auth_service):
    auth_service.user_repo.find_by_username.return_value = None
    auth_service.user_repo.find_by_email.return_value = None
    auth_service.user_repo.save.return_value = User(1, "admin", "admin@test.com", "hashed", "ADMIN")
    
    res = auth_service.admin_signup("admin", "admin@test.com", "pass")
    assert res is True

# Fixture for AdminService
@pytest.fixture
def admin_service():
    with patch("services.admin_service.InsurancePolicyRepository") as MockPolicyRepo, \
         patch("services.admin_service.PolicyAddOnRepository") as MockAddonRepo:
        service = AdminService()
        service.policy_repo = MockPolicyRepo.return_value
        service.addon_repo = MockAddonRepo.return_value
        yield service

# 5. AdminService test - create insurance policy
def test_admin_create_insurance_policy(admin_service):
    mock_policy = InsurancePolicy(1, "Car Insurance", "Desc", 1000.0, 12, "Four Wheeler", "Personal", "Petrol", True)
    admin_service.policy_repo.save.return_value = mock_policy
    
    policy = admin_service.create_insurance_policy("Car Insurance", "Desc", 1000.0, 12, "Four Wheeler", "Personal", "Petrol")
    assert policy.id == 1
    assert policy.policy_name == "Car Insurance"

# Fixture for ClaimService
@pytest.fixture
def claim_service():
    with patch("services.claim_service.ClaimRepository") as MockClaimRepo, \
         patch("services.claim_service.PolicyProposalRepository") as MockPropRepo, \
         patch("services.claim_service.QuoteRepository") as MockQuoteRepo:
        service = ClaimService()
        service.claim_repo = MockClaimRepo.return_value
        service.proposal_repo = MockPropRepo.return_value
        service.quote_repo = MockQuoteRepo.return_value
        yield service

# 6. ClaimService test - raise claim success
def test_raise_claim_success(claim_service):
    proposal = PolicyProposal(10, "ACTIVE", "2026-01-01", "2027-01-01", 1, 2, 3, 4)
    claim_service.proposal_repo.find_by_id.return_value = proposal
    claim_service.claim_repo.save.return_value = Claim(1, "Accident", "SUBMITTED", 10, 500.0, 0.0, None)
    
    c = claim_service.raise_claim(1, 10, "Accident", 500.0)
    assert c.id == 1
    assert c.status == "SUBMITTED"

# Fixture for CustomerService
@pytest.fixture
def customer_service():
    with patch("services.customer_service.VehicleRepository") as MockVehRepo, \
         patch("services.customer_service.PolicyProposalRepository") as MockPropRepo, \
         patch("services.customer_service.QuoteRepository") as MockQuoteRepo, \
         patch("services.customer_service.InsurancePolicyRepository") as MockPolRepo, \
         patch("services.customer_service.PolicyAddOnRepository") as MockAddonRepo, \
         patch("services.customer_service.CustomerRepository") as MockCustRepo:
        
        service = CustomerService()
        service.vehicle_repo = MockVehRepo.return_value
        service.proposal_repo = MockPropRepo.return_value
        service.quote_repo = MockQuoteRepo.return_value
        service.policy_repo = MockPolRepo.return_value
        service.addon_repo = MockAddonRepo.return_value
        service.customer_repo = MockCustRepo.return_value
        yield service

# 7. CustomerService test - add vehicle
def test_customer_add_vehicle(customer_service):
    vehicle = Vehicle(1, 1, "MH-12-AB-1234", "C123", "E123", "Four Wheeler", "Honda", "City", "VXI", 2022)
    customer_service.vehicle_repo.save.return_value = vehicle
    
    v = customer_service.add_vehicle(1, "MH-12-AB-1234", "C123", "E123", "Four Wheeler", "Honda", "City", "VXI", 2022)
    assert v.id == 1

# Fixture for OfficerService
@pytest.fixture
def officer_service():
    with patch("services.officer_service.PolicyProposalRepository") as MockPropRepo, \
         patch("services.officer_service.QuoteRepository") as MockQuoteRepo, \
         patch("services.officer_service.VehicleRepository") as MockVehRepo, \
         patch("services.officer_service.InsurancePolicyRepository") as MockPolRepo, \
         patch("services.officer_service.PolicyAddOnRepository") as MockAddonRepo, \
         patch("services.officer_service.CustomerRepository") as MockCustRepo:
         
         service = OfficerService()
         service.proposal_repo = MockPropRepo.return_value
         service.quote_repo = MockQuoteRepo.return_value
         service.vehicle_repo = MockVehRepo.return_value
         service.policy_repo = MockPolRepo.return_value
         service.addon_repo = MockAddonRepo.return_value
         service.customer_repo = MockCustRepo.return_value
         yield service

# 8. OfficerService test - calculate estimated amount
def test_officer_calculate_estimated_amount(officer_service):
    proposal = PolicyProposal(10, "PROPOSAL_SUBMITTED", None, None, 1, 2, 3, None)
    policy = InsurancePolicy(3, "Car Policy", "Desc", 1000.0, 12, "Four Wheeler", "Personal", "Petrol", True)
    vehicle = Vehicle(2, 1, "MH-12-AB-1234", "C123", "E123", "Four Wheeler", "Honda", "City", "VXI", 2024)
    
    officer_service.proposal_repo.find_by_id.return_value = proposal
    officer_service.policy_repo.find_by_id.return_value = policy
    officer_service.proposal_repo.find_addons_for_proposal.return_value = []
    officer_service.vehicle_repo.find_by_id.return_value = vehicle
    
    with patch("services.officer_service.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 7, 30)
        
        est = officer_service.calculate_estimated_amount(10)
        assert est == 1100.0
