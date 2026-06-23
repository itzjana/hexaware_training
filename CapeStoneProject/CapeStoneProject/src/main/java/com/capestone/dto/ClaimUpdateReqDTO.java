package com.capestone.dto;

import com.capestone.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ClaimUpdateReqDTO(
        @NotNull(message = "Need Status")
        ClaimStatus status,

        String officerNote,

        BigDecimal offeredAmount
) {
}
