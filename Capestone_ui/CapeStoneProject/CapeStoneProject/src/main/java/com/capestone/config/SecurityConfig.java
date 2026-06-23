package com.capestone.config;

import com.capestone.service.UserService;
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

    // from official doc in-memory authentication

//    @Bean
//    public UserDetailsService users() {
//        UserDetails user1 = User.builder()
//                .username("officer01")
//                // changing {bcrypt} to noop so that plain password can be passed
//                .password("{noop}password123")
//                .roles("OFFICER")
//                .build();
//        UserDetails user2 = User.builder()
//                .username("head01")
//                .password("{noop}password123")
//                .roles("STATION_HEAD")
//                .build();
//        return new InMemoryUserDetailsManager(user1, user2);
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                /* .csrf(c->c.disable()) --> to disable csrf (Cross-Site Request Forgery) that for op like post,put,delete
                                             spring needs ip to verify but for dev purpose we disabling it.*/

                // lambda exp converted to method ref by ide
                .csrf(AbstractHttpConfigurer::disable)

                //this line is to grand access to the api with to authenticated users
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers(HttpMethod.OPTIONS ,"/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/admin/signup").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/officer/signup").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/auth/login").authenticated()
                                .requestMatchers(HttpMethod.POST, "/api/auth/customer/signup").permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/customers/me").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.PATCH, "/api/customers/me/update").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/officer/me").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.PATCH, "/api/officer/me/update").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.GET, "/api/officer/list").hasAuthority("ADMIN")

                                //Insurance API's
                                .requestMatchers(HttpMethod.GET, "/api/insurance/all").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/insurance/all/v2").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/insurance/getbyid/{id}").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/insurance/all/public").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/insurance/suggest").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/insurance/suggested").hasAuthority("CUSTOMER")
                                // Insurance Modify APIs - ADMIN Only
                                .requestMatchers(HttpMethod.POST, "/api/insurance/insert").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/api/insurance/update/{id}").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/insurance/delete/{id}").hasAuthority("ADMIN")

                                //Add On API's
                                .requestMatchers(HttpMethod.POST, "/api/addon/insert").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/api/addon/update/{id}").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/addon/delete/{id}").hasAuthority("ADMIN")

                                .requestMatchers(HttpMethod.GET, "/api/addon/all").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/addon/by-id/{id}").permitAll()

                                // Vehicle APIs - CUSTOMER Only
                                .requestMatchers(HttpMethod.POST, "/api/vehicles/add").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/vehicles/getbycustomer").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/vehicles/getbyid/{id}").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.DELETE, "/api/vehicles/delete/{id}").hasAuthority("CUSTOMER")

                                //Document upload
                                .requestMatchers(HttpMethod.POST, "/api/documents/customer/upload").authenticated()
                                .requestMatchers(HttpMethod.POST,"/api/documents/{id}").authenticated()

                                //Quote API's
                                .requestMatchers(HttpMethod.POST,"api/quote/create").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.GET,"api/quote/customer").hasAuthority("CUSTOMER")

                                //payment
                                .requestMatchers(HttpMethod.POST,"/api/payment/").hasAuthority("CUSTOMER")

                                //Estimate Price
                                .requestMatchers(HttpMethod.POST,"/api/estimate").permitAll()

                                //Policy Proposal
                                .requestMatchers(HttpMethod.POST, "/api/policyproposal/all").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/api/policyproposal/create").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/policyproposal/customer/all").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/api/policyproposal/submitted").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.GET, "/api/policyproposal/{id}").authenticated()
                                .requestMatchers(HttpMethod.POST,"/api/policyPropsal/{proposalId}/resubmit").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.PATCH,"/api/officer/proposal/additional-details/{id}").hasAuthority("INSURANCE_OFFICER")

                                //Claim
                                .requestMatchers(HttpMethod.POST,"/api/claim/add").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET,"/api/claim/getinitiated").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.GET,"/api/claim/{id}").hasAnyAuthority("INSURANCE_OFFICER","CUSTOMER")
                                .requestMatchers(HttpMethod.GET,"/api/claim/getbycustomer").hasAnyAuthority("INSURANCE_OFFICER","CUSTOMER")
                                .requestMatchers(HttpMethod.POST,"/api/claim/updatestatus/{id}").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.GET,"/api/claim/getbyofficer").hasAuthority("INSURANCE_OFFICER")
                                .requestMatchers(HttpMethod.POST,"/api/claim/{id}/respond").hasAuthority("CUSTOMER")
                                //Stat
                                .requestMatchers(HttpMethod.GET,"/api/stat/adminstats").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/stat/by-status").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/stat/officers/top").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/api/stat/officerstats").hasAuthority("INSURANCE_OFFICER")


                                //Reviews
                                .requestMatchers(HttpMethod.POST,"/api/review/add").hasAuthority("CUSTOMER")
                                .requestMatchers(HttpMethod.GET,"/api/review/all").permitAll()

                                //all enums
                                .requestMatchers(HttpMethod.GET,"/api/enums").authenticated()
                                .anyRequest().authenticated()


                        //if no need to authenticate and make api public  --->   .anyRequest().permitAll()
                        //if api call needs to be denied                  --->   .anyRequest().denyAll()

                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.httpBasic(Customizer.withDefaults()); // to say spring that I am using basic authentication method to authenticate

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
