package com.capestone.dto;

import com.capestone.enums.VehicleCategory;

import java.time.LocalDate;

public record ClaimResDTO(
        int claimId,
        String incidentDescription,
        String policyName,
        LocalDate StartDate,
        VehicleCategory vehicleCategory,
        String customerName
) {
}
