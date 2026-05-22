package com.app.dao;

import com.app.model.InsurancePolicy;
import com.app.model.User;
import jakarta.persistence.NoResultException;

import java.util.List;

public interface InsuranceDAO {
    void addInsurance(InsurancePolicy insurance, User user);

    void deleteById(int id);

    InsurancePolicy getById(int id) throws NoResultException;

    List<InsurancePolicy> getAll();

    void update(InsurancePolicy insurance);
}
