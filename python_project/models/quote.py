class Quote:
    def __init__(self, quote_id, calculated_amount, policy_proposal_id, officer_id):
        self.__id = quote_id
        self.__calculated_amount = float(calculated_amount)
        self.__policy_proposal_id = policy_proposal_id
        self.__officer_id = officer_id

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def calculated_amount(self):
        return self.__calculated_amount

    @calculated_amount.setter
    def calculated_amount(self, value):
        self.__calculated_amount = float(value)

    @property
    def policy_proposal_id(self):
        return self.__policy_proposal_id

    @policy_proposal_id.setter
    def policy_proposal_id(self, value):
        self.__policy_proposal_id = value

    @property
    def officer_id(self):
        return self.__officer_id

    @officer_id.setter
    def officer_id(self, value):
        self.__officer_id = value
