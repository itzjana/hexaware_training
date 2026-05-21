package com.main;

import com.main.config.AppConfig;
import com.main.model.Insurance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class AppMain {

    public static void main(String[] args) {
        System.out.println("Spring boot framework");
        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext(AppConfig.class);

        Insurance insurance = context.getBean(Insurance.class);
        insurance.details();
        context.close();

    }
}
