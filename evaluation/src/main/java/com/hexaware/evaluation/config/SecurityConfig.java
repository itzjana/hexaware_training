package com.hexaware.evaluation.config;

import com.hexaware.evaluation.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {


    private final UserService userService;
    private final JwtFilter jwtFilter;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                                //authentication
                                .requestMatchers(HttpMethod.POST, "/api/auth/admin/signup").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/auth/login").authenticated()
                                .requestMatchers(HttpMethod.POST,"/api/auth/employee/signup").permitAll()
                                .requestMatchers(HttpMethod.POST,"/api/auth/jobseeker/signup").permitAll()

                                //job
                                .requestMatchers(HttpMethod.POST,"/api/job/add").hasAuthority("EMPLOYEE")
                                .requestMatchers(HttpMethod.GET,"/api/job/all").authenticated()

                                //application
                                .requestMatchers(HttpMethod.POST,"/api/application/{id}").hasAuthority("SEEKER")
                                .requestMatchers(HttpMethod.GET,"/api/application/getmyapplication").hasAuthority("SEEKER")

                                .anyRequest().authenticated()

                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider dao = new DaoAuthenticationProvider(userService);
        dao.setPasswordEncoder(passwordEncoder());
        return dao;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
