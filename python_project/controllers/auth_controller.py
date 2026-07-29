from services.auth_service import AuthService
from validators.validators import is_valid_email, is_valid_password

class AuthController:
    def __init__(self):
        self.auth_service = AuthService()

    def admin_signup(self, username, email, password):
        if not is_valid_email(email) or not is_valid_password(password):
            return False
        try:
            if self.auth_service.admin_signup(username, email, password):
                print("\nSUCCESS: Admin Registration Successful.")
                return True
        except Exception as exception:
            print(f"\nERROR: Admin Registration Failed: {exception}")
        return False

    def officer_signup(self, username, email, name, job_title):
        if not is_valid_email(email):
            return False
        try:
            if self.auth_service.officer_signup(username, email, name, job_title):
                print("\nSUCCESS: Officer Registration Successful.")
                return True
        except Exception as exception:
            print(f"\nERROR: Officer Registration Failed: {exception}")
        return False

    def customer_signup(self, username, email, password, name, dob, address, aadhar_number, pan_number):
        if not is_valid_email(email) or not is_valid_password(password):
            return False
        try:
            if self.auth_service.customer_signup(
                username=username,
                email=email,
                password=password,
                name=name,
                dob=dob,
                address=address,
                aadhar_number=aadhar_number,
                pan_number=pan_number
            ):
                print("\nSUCCESS: Customer Registration Successful.")
                return True
        except Exception as exception:
            print(f"\nERROR: Customer Registration Failed: {exception}")
        return False

    def login(self, username, password):
        try:
            user, token = self.auth_service.login(username, password)
            if user:
                print(f"\nSUCCESS: Login Successful! Welcome, {user.username}.")
                return user, token
        except Exception as exception:
            print(f"\nERROR: Login Failed: {exception}")
        return None

    def get_auto_session(self):
        return self.auth_service.get_auto_session()

    def logout(self, email):
        self.auth_service.logout(email)
