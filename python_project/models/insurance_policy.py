class InsurancePolicy:
    def __init__(self, policy_id, policy_name, description, base_rate, validity_months, vehicle_category, vehicle_usage, fuel_type, active=True):
        self.__id = policy_id
        self.__policy_name = policy_name
        self.__description = description
        self.__base_rate = float(base_rate)
        self.__validity_months = int(validity_months)
        self.__vehicle_category = vehicle_category
        self.__vehicle_usage = vehicle_usage
        self.__fuel_type = fuel_type
        self.__active = active

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def policy_name(self):
        return self.__policy_name

    @policy_name.setter
    def policy_name(self, value):
        self.__policy_name = value

    @property
    def description(self):
        return self.__description

    @description.setter
    def description(self, value):
        self.__description = value

    @property
    def base_rate(self):
        return self.__base_rate

    @base_rate.setter
    def base_rate(self, value):
        self.__base_rate = float(value)

    @property
    def validity_months(self):
        return self.__validity_months

    @validity_months.setter
    def validity_months(self, value):
        self.__validity_months = int(value)

    @property
    def vehicle_category(self):
        return self.__vehicle_category

    @vehicle_category.setter
    def vehicle_category(self, value):
        self.__vehicle_category = value

    @property
    def vehicle_usage(self):
        return self.__vehicle_usage

    @vehicle_usage.setter
    def vehicle_usage(self, value):
        self.__vehicle_usage = value

    @property
    def fuel_type(self):
        return self.__fuel_type

    @fuel_type.setter
    def fuel_type(self, value):
        self.__fuel_type = value

    @property
    def active(self):
        return self.__active

    @active.setter
    def active(self, value):
        self.__active = bool(value)
