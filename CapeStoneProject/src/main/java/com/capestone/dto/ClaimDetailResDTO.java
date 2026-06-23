package com.capestone.dto;

import com.capestone.enums.VehicleCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ClaimDetailResDTO(

        int claimId,
        String incidentDescription,
        String claimStatus,
        String officerNote,
        String customerName,
        String customerAddress,
        String aadharNumber,
        String panNumber,
        String policyName,
        LocalDate policyStartDate,
        LocalDate policyEndDate,
        String registrationNumber,
        String manufacturer,
        String model,
        VehicleCategory vehicleCategory,
        Integer manufactureYear,
        Long currentOdometerKm,
        List<String> documentPaths,
        BigDecimal estimatedAmount,
        BigDecimal offeredAmount,
        BigDecimal suggestedAmount

) {}
