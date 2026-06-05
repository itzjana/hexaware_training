package com.hexaware.evaluation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record JobReqDTO(

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String descrition,

        @NotBlank(message = "Location is required")
        String location,

        @NotNull(message = "salary is required")
        @Positive
        Double salary
) {
}
