package com.capestone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CustomerReqDTO(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Address is required")
        String address,

        @NotNull(message = "Date of birth is required")
        LocalDate dob,

        @NotBlank(message = "Aadhaar number is required")
        String aadhaarNumber,

        @NotBlank(message = "PAN number is required")
        String panNumber,

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
