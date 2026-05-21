package com.app.dao;

import com.app.exception.ResourceNotFoundException;
import com.app.model.Insurance;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface InsuranceDAO {

    void insert(Insurance insurance);
    void update(Insurance insurance);
    void deleteById(int id) throws ResourceNotFoundException;
    List<Insurance> getAll();
    Insurance getById(int id) throws ResourceNotFoundException;
}
