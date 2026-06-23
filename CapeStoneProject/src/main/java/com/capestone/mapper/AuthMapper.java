package com.capestone.mapper;

import com.capestone.dto.LoginResDTO;
import com.capestone.model.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public LoginResDTO entityToDTO(User user) {
        return new LoginResDTO(user.getId(), user.getUsername(), user.getUsername(),user.getRole());
    }
}
