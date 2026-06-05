package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.EmployeeReqDTO;
import com.hexaware.evaluation.model.Employee;
import com.hexaware.evaluation.model.User;
import com.hexaware.evaluation.repository.EmployeeRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public void add(@Valid EmployeeReqDTO employeeReqDTO, User user) {
        Employee employee = new Employee();
        employee.setName(employeeReqDTO.name());
        employee.setCompanyName(employeeReqDTO.companyName());
        employee.setUser(user);
        employeeRepository.save(employee);
    }

    public Employee getEmployee(String name) {
        return employeeRepository.findByUserUsername(name);
    }
}
