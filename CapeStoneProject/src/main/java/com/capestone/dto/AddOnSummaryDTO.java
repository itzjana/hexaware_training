package com.capestone.dto;

import java.math.BigDecimal;

public record AddOnSummaryDTO(
        int id,
        String name,
        BigDecimal additionalCost,
        String description,
        boolean status
) {
}
