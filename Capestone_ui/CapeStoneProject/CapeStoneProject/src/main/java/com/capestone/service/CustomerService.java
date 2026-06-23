package com.capestone.service;

import com.capestone.dto.CustomerDocumentDTO;
import com.capestone.dto.CustomerReqDTO;
import com.capestone.dto.CustomerResDTO;
import com.capestone.dto.CustomerUpdateReqDTO;
import com.capestone.enums.Role;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.exception.UsernameExistsException;
import com.capestone.mapper.CustomerMapper;
import com.capestone.model.Customer;
import com.capestone.model.User;
import com.capestone.repository.CustomerRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {

    private CustomerRepository customerRepository;
    private CustomerMapper customerMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final DocumentService documentService;

    public CustomerResDTO getCustomerByUsername(String username) {
        Customer customer = customerRepository.findByUserUsername(username);
        return customerMapper.entityTODTO(customer);
    }


    public void customerSignup(@Valid CustomerReqDTO customerReqDTO) {

        if(userService.checkUsernameExists(customerReqDTO.username()))
            throw  new UsernameExistsException("Username taken,try different");

        if(userService.checkEmailExists(customerReqDTO.email()))
            throw  new UsernameExistsException("Email already exists.");



        User user = new User();
        user.setUsername(customerReqDTO.username());
        user.setEmail(customerReqDTO.email());
        user.setRole(Role.CUSTOMER);
        String encodedPassword = passwordEncoder.encode(customerReqDTO.password());
        user.setPassword(encodedPassword);

        user = userService.signup(user);

        Customer customer = new Customer();
        customer.setName(customerReqDTO.name());
        customer.setDob(customerReqDTO.dob());
        customer.setAddress(customerReqDTO.address());
        customer.setAadharNumber(customerReqDTO.aadhaarNumber());
        customer.setPanNumber(customerReqDTO.panNumber());
        customer.setUser(user);

        customerRepository.save(customer);
    }


    // for vehicle customer set
    public Customer getCustomer(String username) {
        return customerRepository.findByUserUsername(username);
    }



    public CustomerResDTO updateCustomer(String username, CustomerUpdateReqDTO dto) {

        Customer customer = customerRepository.findByUserUsername(username);
        if (customer == null)
            throw new ResourceNotFoundException("Customer not found");

        customer = customerMapper.updateCustomerFromDTO(dto, customer);

        if(dto.currentPassword() != null && dto.newPassword() != null) {
            User user = customer.getUser();
            if(!passwordEncoder.matches(dto.currentPassword(), user.getPassword()))
                throw new RuntimeException("Current password is incorrect");

            user.setPassword(passwordEncoder.encode(dto.newPassword()));
            userService.signup(user);
        }
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.entityTODTO(updatedCustomer);
    }
}
