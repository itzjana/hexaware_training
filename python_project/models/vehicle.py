class Vehicle:
    def __init__(self, vehicle_id, customer_id, registration_number, chassis_number, engine_number, category, manufacturer, model, variant, manufacture_year):
        self.__id = vehicle_id
        self.__customer_id = customer_id
        self.__registration_number = registration_number
        self.__chassis_number = chassis_number
        self.__engine_number = engine_number
        self.__category = category
        self.__manufacturer = manufacturer
        self.__model = model
        self.__variant = variant
        self.__manufacture_year = manufacture_year

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def customer_id(self):
        return self.__customer_id

    @customer_id.setter
    def customer_id(self, value):
        self.__customer_id = value

    @property
    def registration_number(self):
        return self.__registration_number

    @registration_number.setter
    def registration_number(self, value):
        self.__registration_number = value

    @property
    def chassis_number(self):
        return self.__chassis_number

    @chassis_number.setter
    def chassis_number(self, value):
        self.__chassis_number = value

    @property
    def engine_number(self):
        return self.__engine_number

    @engine_number.setter
    def engine_number(self, value):
        self.__engine_number = value

    @property
    def category(self):
        return self.__category

    @category.setter
    def category(self, value):
        self.__category = value

    @property
    def manufacturer(self):
        return self.__manufacturer

    @manufacturer.setter
    def manufacturer(self, value):
        self.__manufacturer = value

    @property
    def model(self):
        return self.__model

    @model.setter
    def model(self, value):
        self.__model = value

    @property
    def variant(self):
        return self.__variant

    @variant.setter
    def variant(self, value):
        self.__variant = value

    @property
    def manufacture_year(self):
        return self.__manufacture_year

    @manufacture_year.setter
    def manufacture_year(self, value):
        self.__manufacture_year = value
