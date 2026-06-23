package com.capestone.dto;

import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record AddOnUpdatedDTO(
        String name,
        String description,
        BigDecimal additionalCost,
        Boolean active
) {
}
