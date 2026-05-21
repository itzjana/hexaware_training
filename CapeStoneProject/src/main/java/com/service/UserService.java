package com.service;

import com.exception.ResourceNotFoundException;
import com.model.User;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class UserService {

    public final Session session;
    public UserService(Session session) {
        this.session=session;
    }


}
