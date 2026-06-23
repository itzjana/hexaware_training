package com.capestone.dto;

import com.capestone.enums.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record OfficerProposalListDTO(

        int proposalId,
        String customerName,
        String customerAddress,
        String customerPan,
        String customerAadhaar,
        LocalDate dob,
        String policyName,
        BigDecimal policyPrice,
        String vehicleNumber,
        String manufacturer,
        String model,
        String variant,
        VehicleCategory category,
        Integer manufactureYear,
        LocalDate registrationDate,
        FuelType fuelType,
        Integer engineCapacityCc,
        Integer seatingCapacity,
        VehicleUsage usage,
        BigDecimal currentIdv,
        Integer ownerCount,
        VehicleCondition condition,
        Long currentOdometerKm,
        Boolean modifiedVehicle,
        Boolean accidentHistory,
        Integer accidentCount,
        String previousInsurer,
        Integer noClaimBonusPercentage,
        String vehiclePath,
        List<AddOnSummaryDTO> addOns,
        LocalDate startDate,
        LocalDate endDate,
        String officerRemark,
        List<String> documentPaths,
        PolicyStatus status,
        Instant submittedAt

) {
}