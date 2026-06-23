package com.capestone.dto;

import java.math.BigDecimal;

public record AddOnSummaryDTO(
        String name,
        BigDecimal additionalCost
) {
}
