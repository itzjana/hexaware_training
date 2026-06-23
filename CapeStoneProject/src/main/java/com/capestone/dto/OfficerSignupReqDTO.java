package com.capestone.dto;

import com.capestone.enums.JobTitle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OfficerSignupReqDTO(
        @NotBlank(message = "Username is required")
        @Size(min = 4,message = "Username must be more than 4 Characters")
        String username,

        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Job title is required")
        JobTitle jobTitle
) {
}
