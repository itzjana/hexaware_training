package com.config;

import com.model.Officer;
import com.model.User;
import org.hibernate.SessionFactory;

import org.hibernate.cfg.Configuration;

import java.util.Currency;

public class HibernateConfig {

    private static SessionFactory sessionFactory;

    public static SessionFactory getSessionFactory() {

        if(sessionFactory == null){

            Configuration configuration = new Configuration();


            // DB credentials , URLs and dialect
            configuration.setProperty("hibernate.connection.url", "jdbc:mysql://localhost:3306/insurance_db?createDatabaseIfNotExist=true");
            configuration.setProperty("hibernate.connection.username", "root");
            configuration.setProperty("hibernate.connection.password", "password");
            configuration.setProperty("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
            // set the dialect
            configuration.setProperty("hibernate.dialect","org.hibernate.dialect.MySQLDialect");
            // If u want hibernate to generate the DB tables on the fly based on Model classes
            configuration.setProperty("hibernate.hbm2ddl.auto", "update");
            // Add model classes that we will create
            configuration.addAnnotatedClass(User.class);
            configuration.addAnnotatedClass(Currency.class);
            configuration.addAnnotatedClass(Officer.class);

            return  configuration.buildSessionFactory();

        }
        return sessionFactory;
    }

    public static void closeFactory(){
        sessionFactory.close();
    }
}
