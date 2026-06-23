package com.capestone.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record QuoteReqDTO(

        int proposalId,

        @NotNull(message = "Calculated amount is required")
        BigDecimal calculatedAmount
) {
}
