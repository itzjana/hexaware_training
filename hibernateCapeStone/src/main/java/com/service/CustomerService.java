package com.service;

import com.model.Customer;
import com.model.User;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class CustomerService {

    private final Session session;

    public CustomerService(Session session) {
        this.session = session;
    }

    public Customer getCustomer(User user) {
        Transaction tx = session.beginTransaction();
        Customer customer = session.createQuery("select c from Customer c where c.user=:user", Customer.class)
                .setParameter("user",user)
                .getSingleResult();
        tx.commit();
        return customer;
    }
}
