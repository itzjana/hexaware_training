package com.hexaware.evaluation.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthorReqDTO(

        @NotBlank(message = "Author Name Required")
        String name,

        @NotBlank(message = "email Required")
        String email
) {
}
