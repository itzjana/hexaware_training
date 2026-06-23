package com.capestone.controller;

import com.capestone.dto.CustomerResDTO;
import com.capestone.dto.CustomerUpdateReqDTO;
import com.capestone.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequestMapping("/api/customers")
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/me")
    public CustomerResDTO getCustomerByUsername(Principal principal){
            return customerService.getCustomerByUsername(principal.getName());
    }

    @PatchMapping("/me/update")
    public CustomerResDTO updateCustomer(Principal principal, @Valid @RequestBody CustomerUpdateReqDTO dto) {
        return customerService.updateCustomer(principal.getName(),dto);
    }

}
