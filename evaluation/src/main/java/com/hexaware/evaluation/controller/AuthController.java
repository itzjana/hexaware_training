package com.hexaware.evaluation.controller;

import com.hexaware.evaluation.dto.*;
import com.hexaware.evaluation.service.AuthService;
import com.hexaware.evaluation.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {


    private final JwtUtil jwtUtil;
    private final AuthService authService;

    @PostMapping("/admin/signup")
    public void adminSignup(@Valid @RequestBody AdminReqDTO adminReqDTO){
        authService.adminSignup(adminReqDTO);
    }


    @GetMapping("/login")
    public TokenDTO login(Principal principal){
        String username = principal.getName();
        String token = jwtUtil.generateToken(username);
        return new TokenDTO(username,token);
    }


    @PostMapping("/jobseeker/signup")
    public void jobSeekerSignup(@Valid @RequestBody JobSeekerReqDTO jobSeekerReqDTO){
        authService.jobSeekerSignup(jobSeekerReqDTO);
    }

    @PostMapping("/employee/signup")
    public void employeeSignup(@Valid @RequestBody EmployeeReqDTO employeeReqDTO ){
        authService.employeeSignup(employeeReqDTO);
    }


}
