package com.hexaware.evaluation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobSeekerReqDTO(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Resume Summary is required")
        String resumeSummary,

        @NotBlank(message = "Username is required")
        @Size(min = 3,message = "Have more than 3 character")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min=6,message = "Have more than 6 character")
        String password
) {
}
