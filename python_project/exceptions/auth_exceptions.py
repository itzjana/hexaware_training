class DuplicateUsernameError(Exception):
    def __init__(self, username):
        self.username = username
        super().__init__(f"Username '{username}' is already taken. Please choose a different one.")

class DuplicateEmailError(Exception):
    def __init__(self, email):
        self.email = email
        super().__init__(f"Email '{email}' is already registered. Please use a different email.")
