package com.app.util;

import com.app.model.Insurance;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.Nullable;

import java.sql.ResultSet;
import java.sql.SQLException;

public class InsuranceMapperUtil implements RowMapper<Insurance> {
    @Nullable
    @Override
    public Insurance mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Insurance(
                rs.getInt("id"),
                rs.getString("policy_name"),
                rs.getString("description"),
                rs.getInt("base_rate")
        );
    }
}
