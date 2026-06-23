package com.capestone.dto;

import com.capestone.enums.ClaimStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ClaimClientResDTO(
        int claimId,
        String policyName,
        String vehicleNumber,
        String incidentDescription,
        Long currentOdometerKm,
        ClaimStatus status,
        LocalDate policyStartDate,
        LocalDate policyEndDate,
        BigDecimal estimatedAmount,
        BigDecimal offeredAmount
) {
}
