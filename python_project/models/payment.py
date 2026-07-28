class Payment:
    def __init__(self, payment_id, status, amount, quote_id):
        self.__id = payment_id
        self.__status = status
        self.__amount = float(amount)
        self.__quote_id = quote_id

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
    def amount(self):
        return self.__amount

    @amount.setter
    def amount(self, value):
        self.__amount = float(value)

    @property
    def quote_id(self):
        return self.__quote_id

    @quote_id.setter
    def quote_id(self, value):
        self.__quote_id = value
