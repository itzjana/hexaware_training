package com.app.dao_impl;

import com.app.dao.AuthDAO;
import com.app.exception.UserNotFoundException;
import com.app.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;

@Component
public class AuthDAOImpl implements AuthDAO {

    @PersistenceContext
    private EntityManager em;

    @Override
    public User login(String username, String password) {
        TypedQuery<User> query = em.createQuery("select u from User u where u.username =: username and u.password=:password ", User.class);
        query.setParameter("username",username);
        query.setParameter("password",password);
        User user = query.getSingleResult();
        if(user == null)
            throw new UserNotFoundException("Invalid credential");
        return user;
    }
}
