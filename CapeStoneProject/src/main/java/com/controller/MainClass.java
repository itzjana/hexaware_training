package com.controller;


import com.config.HibernateConfig;
import com.enums.Role;
import com.exception.ResourceNotFoundException;
import com.model.User;
import com.service.UserService;
import org.hibernate.Session;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class MainClass {
    public static void main(String[] args) {
        Session session = HibernateConfig.getSessionFactory().openSession();
        Scanner sc = new Scanner(System.in);

        UserService userService = new UserService(session);





        sc.close();
        session.close();
    }
}
