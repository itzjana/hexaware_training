package com.service;


import com.model.User;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserService {

    public final Session session;
    public UserService(Session session) {
        this.session=session;
    }


    public User authenticateUser(String username, String password) {
        Transaction tx = session.beginTransaction();
        User user = session.createQuery("from User where username=:username and password=:password", User.class)
                .setParameter("username", username)
                .setParameter("password", password)
                .uniqueResult();
        tx.commit();

        return user;
    }

}
