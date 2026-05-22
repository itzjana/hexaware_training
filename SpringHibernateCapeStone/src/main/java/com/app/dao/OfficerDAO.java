package com.app.dao;

import com.app.model.Officer;
import com.app.model.User;
import org.springframework.stereotype.Component;

@Component
public interface OfficerDAO {
    Officer getByUser(User user);
}
