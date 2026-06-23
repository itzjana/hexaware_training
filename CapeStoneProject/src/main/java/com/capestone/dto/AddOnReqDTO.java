package com.capestone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record AddOnReqDTO(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull
        String description,
        @NotNull(message = "Additional cost is required")
        BigDecimal additionalCost
) {
}
