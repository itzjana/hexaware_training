package com.app.dao_impl;

import com.app.dao.InsuranceDAO;
import com.app.exception.ResourceNotFoundException;
import com.app.model.Insurance;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.util.List;

@Component
public class InsuranceDAOImpl implements InsuranceDAO {

    private final JdbcTemplate jdbcTemplate;

    public InsuranceDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<Insurance> mapper(){
        return (rs,num)->{
            return new Insurance(
                    rs.getInt("id"),
                    rs.getString("policy_name"),
                    rs.getString("description"),
                    rs.getInt("base_rate")
            );
        };
    }

    @Override
    public void insert(Insurance insurance) {
        String sql ="insert into insurance (policy_name,description,base_rate) values (?,?,?)";
        jdbcTemplate.update(sql,
                    insurance.getPolicyName(),
                    insurance.getDescription(),
                    insurance.getBaseRate());
        System.out.println("Insurance created...");

    }

    @Override
    public void update(Insurance insurance) {
        String sql = "Update insurance set policy_name = ? ,description = ? ,base_rate = ? where id =?";
        jdbcTemplate.update(sql,insurance.getPolicyName(),insurance.getDescription(),insurance.getBaseRate(),insurance.getId());
        System.out.println("Updated Insurance Policy");
    }

    @Override
    public void deleteById(int id) throws ResourceNotFoundException {
        String sql = "Delete from insurance where id = ?";
        int row = jdbcTemplate.update(sql,id);
        if(row <= 0)
            throw new ResourceNotFoundException("Invalid id");
    }

    @Override
    public List<Insurance> getAll() {
        String sql = "select * from insurance";
        return jdbcTemplate.query(sql,mapper());
    }

    @Override
    public Insurance getById(int id) throws ResourceNotFoundException {
        String sql = "select * from insurance where id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, mapper(), id);
        }catch (EmptyResultDataAccessException e){
            throw new ResourceNotFoundException("Invalid id");
        }

    }
}
