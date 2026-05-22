package com.app.dao_impl;

import com.app.dao.OfficerDAO;
import com.app.model.Officer;
import com.app.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;

@Component
public class OfficerDAOImpl implements OfficerDAO {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Officer getByUser(User user) {
        TypedQuery<Officer> query = em.createQuery("select o from Officer o where o.user=:user", Officer.class);
        query.setParameter("user",user);
        return query.getSingleResult();
    }
}
