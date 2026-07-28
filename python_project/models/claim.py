class Claim:
    def __init__(self, claim_id, incident_description, status, policy_proposal_id, estimated_amount, offered_amount, officer_id):
        self.__id = claim_id
        self.__incident_description = incident_description
        self.__status = status
        self.__policy_proposal_id = policy_proposal_id
        self.__estimated_amount = float(estimated_amount)
        self.__offered_amount = float(offered_amount)
        self.__officer_id = officer_id

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def incident_description(self):
        return self.__incident_description

    @incident_description.setter
    def incident_description(self, value):
        self.__incident_description = value

    @property
    def status(self):
        return self.__status

    @status.setter
    def status(self, value):
        self.__status = value

    @property
    def policy_proposal_id(self):
        return self.__policy_proposal_id

    @policy_proposal_id.setter
    def policy_proposal_id(self, value):
        self.__policy_proposal_id = value

    @property
    def estimated_amount(self):
        return self.__estimated_amount

    @estimated_amount.setter
    def estimated_amount(self, value):
        self.__estimated_amount = float(value)

    @property
    def offered_amount(self):
        return self.__offered_amount

    @offered_amount.setter
    def offered_amount(self, value):
        self.__offered_amount = float(value)

    @property
    def officer_id(self):
        return self.__officer_id

    @officer_id.setter
    def officer_id(self, value):
        self.__officer_id = value
