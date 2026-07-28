class Customer:
    def __init__(self, customer_id, name, address, dob, aadhar_number, pan_number, user_id):
        self.__id = customer_id
        self.__name = name
        self.__address = address
        self.__dob = dob
        self.__aadhar_number = aadhar_number
        self.__pan_number = pan_number
        self.__user_id = user_id

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, value):
        self.__name = value

    @property
    def address(self):
        return self.__address

    @address.setter
    def address(self, value):
        self.__address = value

    @property
    def dob(self):
        return self.__dob

    @dob.setter
    def dob(self, value):
        self.__dob = value

    @property
    def aadhar_number(self):
        return self.__aadhar_number

    @aadhar_number.setter
    def aadhar_number(self, value):
        self.__aadhar_number = value

    @property
    def pan_number(self):
        return self.__pan_number

    @pan_number.setter
    def pan_number(self, value):
        self.__pan_number = value

    @property
    def user_id(self):
        return self.__user_id

    @user_id.setter
    def user_id(self, value):
        self.__user_id = value
