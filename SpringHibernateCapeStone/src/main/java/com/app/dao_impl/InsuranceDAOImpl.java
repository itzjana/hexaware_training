package com.app.dao_impl;

import com.app.dao.InsuranceDAO;
import com.app.dao.OfficerDAO;
import com.app.exception.ResourceNotFoundException;
import com.app.model.InsurancePolicy;
import com.app.model.Officer;
import com.app.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Transactional
public class InsuranceDAOImpl implements InsuranceDAO {

    @PersistenceContext
    private EntityManager em;

    private OfficerDAOImpl officerDAOImpl;

    @Autowired
    public InsuranceDAOImpl(OfficerDAOImpl officerDAOImpl) {
        this.officerDAOImpl = officerDAOImpl;
    }

    @Override
    public void addInsurance(InsurancePolicy insurance, User user) {
        Officer officer = officerDAOImpl.getByUser(user);
        insurance.setOfficer(officer);
        em.persist(insurance);
        System.out.println("New Insurance Policy Added...");
    }

    @Override
    public void deleteById(int id) {
        em.remove(getById(id));
    }

    @Override
    public InsurancePolicy getById(int id) throws NoResultException {
        TypedQuery<InsurancePolicy> query = em.createQuery("select I from InsurancePolicy I where id=:id", InsurancePolicy.class);
        query.setParameter("id",id);
        InsurancePolicy insurancePolicy = query.getSingleResult();
        return insurancePolicy;
    }

    @Override
    public List<InsurancePolicy> getAll() {
        TypedQuery<InsurancePolicy> query =
                em.createQuery("select i from InsurancePolicy i", InsurancePolicy.class);
        List<InsurancePolicy> list = query.getResultList();
        if(list.isEmpty())
            throw new ResourceNotFoundException("No Insurance available at the moment");
        return list;
    }

    @Override
    public void update(InsurancePolicy insurance) {
        em.merge(insurance);
        System.out.println("Insurance updated");
    }
}
