package com.main.config;


import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;


@Configuration
@ComponentScan("com.main")
public class AppConfig {
    static {
        System.out.println("App config loaded");
    }
}
