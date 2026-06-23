package com.capestone.mapper;

import com.capestone.dto.CustomerDocumentDTO;
import com.capestone.dto.CustomerResDTO;
import com.capestone.dto.CustomerUpdateReqDTO;
import com.capestone.model.Customer;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerMapper {

    public CustomerResDTO entityTODTO(Customer customer
    ) {

        return new CustomerResDTO(
                customer.getId(),
                customer.getName(),
                customer.getAddress(),
                customer.getDob(),
                customer.getAadharNumber(),
                customer.getPanNumber(),
                customer.getUser().getUsername()

        );
    }

    public Customer updateCustomerFromDTO(
            CustomerUpdateReqDTO dto,
            Customer customer
    ) {

        if (dto.name() != null)
            customer.setName(dto.name());

        if (dto.address() != null)
            customer.setAddress(dto.address());

        if (dto.dob() != null)
            customer.setDob(dto.dob());

        if (dto.aadhaarNumber() != null)
            customer.setAadharNumber(dto.aadhaarNumber());

        if (dto.panNumber() != null)
            customer.setPanNumber(dto.panNumber());

        return customer;
    }
}