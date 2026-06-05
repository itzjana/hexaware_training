package com.hexaware.evaluation.mapper;

import com.hexaware.evaluation.dto.LoginResDTO;
import com.hexaware.evaluation.model.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public LoginResDTO entityToDTO(User user) {
        return new LoginResDTO(user.getId(), user.getUsername(), user.getUsername(),user.getRole());
    }
}
