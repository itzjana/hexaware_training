package com.app.dao;

import com.app.model.User;
import org.springframework.stereotype.Component;

@Component
public interface AuthDAO {
    User login(String username,String password);
}
