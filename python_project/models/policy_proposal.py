class PolicyProposal:
    def __init__(self, proposal_id, status, start_date, end_date, customer_id, vehicle_id, policy_id, officer_id):
        self.__id = proposal_id
        self.__status = status
        self.__start_date = start_date
        self.__end_date = end_date
        self.__customer_id = customer_id
        self.__vehicle_id = vehicle_id
        self.__policy_id = policy_id
        self.__officer_id = officer_id

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def status(self):
        return self.__status

    @status.setter
    def status(self, value):
        self.__status = value

    @property
    def start_date(self):
        return self.__start_date

    @property
    def end_date(self):
        return self.__end_date

    @start_date.setter
    def start_date(self, value):
        self.__start_date = value

    @end_date.setter
    def end_date(self, value):
        self.__end_date = value

    @property
    def customer_id(self):
        return self.__customer_id

    @customer_id.setter
    def customer_id(self, value):
        self.__customer_id = value

    @property
    def vehicle_id(self):
        return self.__vehicle_id

    @vehicle_id.setter
    def vehicle_id(self, value):
        self.__vehicle_id = value

    @property
    def policy_id(self):
        return self.__policy_id

    @policy_id.setter
    def policy_id(self, value):
        self.__policy_id = value

    @property
    def officer_id(self):
        return self.__officer_id

    @officer_id.setter
    def officer_id(self, value):
        self.__officer_id = value
