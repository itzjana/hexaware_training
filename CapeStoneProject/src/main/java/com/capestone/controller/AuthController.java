package com.capestone.controller;

import com.capestone.dto.*;
import com.capestone.model.User;
import com.capestone.service.CustomerService;
import com.capestone.service.OfficerService;
import com.capestone.service.UserService;
import com.capestone.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {


    private final JwtUtil jwtUtil;
    private final OfficerService officerService;
    private final CustomerService customerService;
    private final UserService userService;

    @PostMapping("/admin/signup")
    public void adminSignup(@Valid @RequestBody AdminReqDTO adminReqDTO){
        officerService.adminSignup(adminReqDTO);
    }


    @PostMapping("/officer/signup")
    public void officerSignup(@Valid @RequestBody OfficerSignupReqDTO officerSignupReqDTO){
        officerService.officerSignup(officerSignupReqDTO);
    }

    @GetMapping("/login")
    public TokenDTO login(Principal principal){
        String username = principal.getName();
        String token = jwtUtil.generateToken(username);
        User user =(User) userService.loadUserByUsername(username);
        return new TokenDTO(username,token,user.getRole());
    }

    @PostMapping("/customer/signup")
    public void customerSignup(@Valid @RequestBody CustomerReqDTO customerReqDTO){
        customerService.customerSignup(customerReqDTO);
    }


}
