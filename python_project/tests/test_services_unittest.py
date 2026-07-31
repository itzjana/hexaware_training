import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime, date

from utils.password_util import hash_password, verify_password
from utils.jwt_util import generate_token, decode_token
from services.auth_service import AuthService
from services.admin_service import AdminService
from services.claim_service import ClaimService
from services.customer_service import CustomerService

from models.user import User
from models.customer import Customer
from models.insurance_policy import InsurancePolicy
from models.claim import Claim
from models.vehicle import Vehicle
from models.policy_proposal import PolicyProposal

class TestPasswordJWT(unittest.TestCase):
    # 1. Password utility test
    def test_password_utility(self):
        pw = "mysecret123"
        hashed = hash_password(pw)
        self.assertNotEqual(hashed, pw)
        self.assertTrue(verify_password(pw, hashed))
        self.assertFalse(verify_password("wrongpassword", hashed))

    # 2. JWT utility test
    def test_jwt_utility(self):
        email = "test@example.com"
        role = "CUSTOMER"
        token = generate_token(email, role)
        self.assertIsNotNone(token)
        payload = decode_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["email"], email)
        self.assertEqual(payload["role"], role)

class TestAuthService(unittest.TestCase):
    @patch("services.auth_service.UserRepository")
    @patch("services.auth_service.CustomerRepository")
    @patch("services.auth_service.OfficerRepository")
    def setUp(self, MockOffRepo, MockCustRepo, MockUserRepo):
        self.auth_service = AuthService()
        self.auth_service.user_repo = MockUserRepo.return_value
        self.auth_service.customer_repo = MockCustRepo.return_value
        self.auth_service.officer_repo = MockOffRepo.return_value

    # 3. Check username exists
    def test_auth_check_username_exists(self):
        self.auth_service.user_repo.find_by_username.return_value = User(1, "user1", "email1", "pwd", "CUSTOMER")
        self.assertTrue(self.auth_service.check_username_exists("user1"))
        
        self.auth_service.user_repo.find_by_username.return_value = None
        self.assertFalse(self.auth_service.check_username_exists("user2"))

    # 4. Admin signup success
    def test_auth_admin_signup_success(self):
        self.auth_service.user_repo.find_by_username.return_value = None
        self.auth_service.user_repo.find_by_email.return_value = None
        self.auth_service.user_repo.save.return_value = User(1, "admin", "admin@test.com", "hashed", "ADMIN")
        
        res = self.auth_service.admin_signup("admin", "admin@test.com", "pass")
        self.assertTrue(res)

class TestServices(unittest.TestCase):
    # 5. Create insurance policy test
    @patch("services.admin_service.InsurancePolicyRepository")
    @patch("services.admin_service.PolicyAddOnRepository")
    def test_admin_create_insurance_policy(self, MockAddonRepo, MockPolicyRepo):
        admin_service = AdminService()
        admin_service.policy_repo = MockPolicyRepo.return_value
        admin_service.addon_repo = MockAddonRepo.return_value
        
        mock_policy = InsurancePolicy(1, "Car Insurance", "Desc", 1000.0, 12, "Four Wheeler", "Personal", "Petrol", True)
        admin_service.policy_repo.save.return_value = mock_policy
        
        policy = admin_service.create_insurance_policy("Car Insurance", "Desc", 1000.0, 12, "Four Wheeler", "Personal", "Petrol")
        self.assertEqual(policy.id, 1)

    # 6. Raise claim success test
    @patch("services.claim_service.ClaimRepository")
    @patch("services.claim_service.PolicyProposalRepository")
    @patch("services.claim_service.QuoteRepository")
    def test_raise_claim_success(self, MockQuoteRepo, MockPropRepo, MockClaimRepo):
        claim_service = ClaimService()
        claim_service.claim_repo = MockClaimRepo.return_value
        claim_service.proposal_repo = MockPropRepo.return_value
        claim_service.quote_repo = MockQuoteRepo.return_value
        
        proposal = PolicyProposal(10, "ACTIVE", "2026-01-01", "2027-01-01", 1, 2, 3, 4)
        claim_service.proposal_repo.find_by_id.return_value = proposal
        claim_service.claim_repo.save.return_value = Claim(1, "Accident", "SUBMITTED", 10, 500.0, 0.0, None)
        
        c = claim_service.raise_claim(1, 10, "Accident", 500.0)
        self.assertEqual(c.id, 1)

    # 7. Add vehicle test
    @patch("services.customer_service.VehicleRepository")
    @patch("services.customer_service.PolicyProposalRepository")
    @patch("services.customer_service.QuoteRepository")
    @patch("services.customer_service.InsurancePolicyRepository")
    @patch("services.customer_service.PolicyAddOnRepository")
    @patch("services.customer_service.CustomerRepository")
    def test_customer_add_vehicle(self, MockCustRepo, MockAddonRepo, MockPolRepo, MockQuoteRepo, MockPropRepo, MockVehRepo):
        customer_service = CustomerService()
        customer_service.vehicle_repo = MockVehRepo.return_value
        
        vehicle = Vehicle(1, 1, "MH-12-AB-1234", "C123", "E123", "Four Wheeler", "Honda", "City", "VXI", 2022)
        customer_service.vehicle_repo.save.return_value = vehicle
        
        v = customer_service.add_vehicle(1, "MH-12-AB-1234", "C123", "E123", "Four Wheeler", "Honda", "City", "VXI", 2022)
        self.assertEqual(v.id, 1)

if __name__ == "__main__":
    unittest.main()
