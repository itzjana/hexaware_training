class PolicyAddOn:
    def __init__(self, addon_id, name, description, additional_cost, active=True):
        self.__id = addon_id
        self.__name = name
        self.__description = description
        self.__additional_cost = float(additional_cost)
        self.__active = active

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
    def description(self):
        return self.__description

    @description.setter
    def description(self, value):
        self.__description = value

    @property
    def additional_cost(self):
        return self.__additional_cost

    @additional_cost.setter
    def additional_cost(self, value):
        self.__additional_cost = float(value)

    @property
    def active(self):
        return self.__active

    @active.setter
    def active(self, value):
        self.__active = bool(value)
