package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.AdminReqDTO;
import com.hexaware.evaluation.dto.EmployeeReqDTO;
import com.hexaware.evaluation.dto.JobSeekerReqDTO;
import com.hexaware.evaluation.enums.Role;
import com.hexaware.evaluation.model.User;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JobSeekerService jobSeekerService;
    private final EmployeeService employeeService;

    public void adminSignup(@Valid AdminReqDTO adminReqDTO) {
        User user = new User();
        user.setUsername(adminReqDTO.username());
        user.setRole(Role.ADMIN);
        String encodedPassword = passwordEncoder.encode(adminReqDTO.password());
        user.setPassword(encodedPassword);
        userService.signUp(user);
    }

    public void jobSeekerSignup(@Valid JobSeekerReqDTO jobSeekerReqDTO) {
        User user = new User();
        user.setUsername(jobSeekerReqDTO.username());
        user.setRole(Role.SEEKER);
        String encodedPassword = passwordEncoder.encode(jobSeekerReqDTO.password());
        user.setPassword(encodedPassword);
        user = userService.signUp(user);
        jobSeekerService.add(jobSeekerReqDTO,user);

    }

    public void employeeSignup(@Valid EmployeeReqDTO employeeReqDTO) {
        User user = new User();
        user.setUsername(employeeReqDTO.username());
        user.setRole(Role.EMPLOYEE);
        String encodedPassword = passwordEncoder.encode(employeeReqDTO.password());
        user.setPassword(encodedPassword);
        user = userService.signUp(user);
        employeeService.add(employeeReqDTO,user);
    }
}
