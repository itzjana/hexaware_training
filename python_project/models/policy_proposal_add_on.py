class PolicyProposalAddOn:
    def __init__(self, proposal_addon_id, policy_proposal_id, policy_add_on_id):
        self.__id = proposal_addon_id
        self.__policy_proposal_id = policy_proposal_id
        self.__policy_add_on_id = policy_add_on_id

    @property
    def id(self):
        return self.__id

    @id.setter
    def id(self, value):
        self.__id = value

    @property
    def policy_proposal_id(self):
        return self.__policy_proposal_id

    @policy_proposal_id.setter
    def policy_proposal_id(self, value):
        self.__policy_proposal_id = value

    @property
    def policy_add_on_id(self):
        return self.__policy_add_on_id

    @policy_add_on_id.setter
    def policy_add_on_id(self, value):
        self.__policy_add_on_id = value
