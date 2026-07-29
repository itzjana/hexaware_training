import json
import os
from repositories.user_repository import UserRepository
from repositories.customer_repository import CustomerRepository
from repositories.officer_repository import OfficerRepository
from models.user import User
from models.customer import Customer
from models.officer import Officer
from enums import Role
from utils.logger import log_info, log_warning, log_error
from utils.password_util import hash_password, verify_password
from utils.jwt_util import generate_token, decode_token
from utils.env import Env

SESSION_FILE = "session.json"

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.customer_repo = CustomerRepository()
        self.officer_repo = OfficerRepository()

    def check_username_exists(self, username):
        return self.user_repo.find_by_username(username) is not None

    def check_email_exists(self, email):
        return self.user_repo.find_by_email(email) is not None

    def admin_signup(self, username, email, password):
        if self.check_username_exists(username):
            raise ValueError("Username taken, try different")
        if self.check_email_exists(email):
            raise ValueError("Email already exists.")

        hashed_pwd = hash_password(password)
        new_user = User(None, username, email, hashed_pwd, Role.ADMIN.value)
        saved_user = self.user_repo.save(new_user)
        if saved_user:
            log_info(f"Admin registered successfully: {username}")
            return True
        return False

    def officer_signup(self, username, email, name, job_title):
        if self.check_username_exists(username):
            raise ValueError("Username taken, try different")
        if self.check_email_exists(email):
            raise ValueError("Email already exists.")

        # Hash temp password from environment
        temp_password = Env.OFFICER_TEMP_PASSWORD
        hashed_pwd = hash_password(temp_password)

        new_user = User(None, username, email, hashed_pwd, Role.INSURANCE_OFFICER.value)
        saved_user = self.user_repo.save(new_user)

        if saved_user:
            new_officer = Officer(None, name, job_title, saved_user.id)
            saved_officer = self.officer_repo.save(new_officer)
            if saved_officer:
                log_info(f"Officer registered successfully: {username}")
                return True
        return False

    def customer_signup(self, username, email, password, name, dob, address, aadhar_number, pan_number):
        if self.check_username_exists(username):
            raise ValueError("Username taken, try different")
        if self.check_email_exists(email):
            raise ValueError("Email already exists.")

        hashed_pwd = hash_password(password)
        new_user = User(None, username, email, hashed_pwd, Role.CUSTOMER.value)
        saved_user = self.user_repo.save(new_user)

        if saved_user:
            new_customer = Customer(None, name, address, dob, aadhar_number, pan_number, saved_user.id)
            saved_customer = self.customer_repo.save(new_customer)
            if saved_customer:
                log_info(f"Customer registered successfully: {username}")
                return True
        return False

    def login(self, username, password):
        user = self.user_repo.find_by_username(username)
        if user and verify_password(password, user.password):
            token = generate_token(user.email, user.role)
            with open(SESSION_FILE, "w") as file:
                json.dump({"token": token}, file)
            log_info(f"Login successful. User: {username}, Role: {user.role}")
            return user, token
        else:
            log_warning(f"Invalid login attempt for username: {username}")
            raise ValueError("Invalid username or password")

    def get_auto_session(self):
        if not os.path.exists(SESSION_FILE):
            return None
        try:
            with open(SESSION_FILE, "r") as file:
                data = json.load(file)
            token = data.get("token")
            if not token:
                return None
            payload = decode_token(token)
            if not payload:
                return None
            log_info(f"Auto login payload found: {payload['email']}")
            return self.user_repo.find_by_email(payload["email"])
        except Exception as exception:
            log_error(f"Auto session failed: {exception}")
            return None

    def logout(self, email):
        if os.path.exists(SESSION_FILE):
            with open(SESSION_FILE, "w") as file:
                json.dump({}, file)
            log_info(f"User logged out. Email: {email}")
