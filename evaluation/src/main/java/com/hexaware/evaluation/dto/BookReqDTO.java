package com.hexaware.evaluation.dto;

import jakarta.validation.constraints.NotBlank;

public record BookReqDTO(
        @NotBlank(message = "Tilte is required")
        String title,
        @NotBlank(message = "Summary is required")
        String summary
) {
}
