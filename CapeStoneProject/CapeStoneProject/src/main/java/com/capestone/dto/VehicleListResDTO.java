package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleCondition;
import com.capestone.enums.VehicleUsage;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleListResDTO(

        Integer id,
        VehicleCategory category,
        String registrationNumber,
        String chassisNumber,
        String engineNumber,
        String manufacturer,
        String model,
        String variant,
        Integer manufactureYear,
        LocalDate registrationDate,
        FuelType fuelType,
        Integer engineCapacityCc,
        Integer seatingCapacity,
        VehicleUsage usage,
        BigDecimal exShowroomPrice,
        BigDecimal currentIdv,
        String documentPath,
        Integer ownerCount,
        VehicleCondition condition,
        Long currentOdometerKm,
        Boolean modifiedVehicle,
        Boolean accidentHistory,
        Integer accidentCount,
        String previousInsurer,
        String previousPolicyNumber,
        LocalDate previousPolicyExpiryDate,
        Integer noClaimBonusPercentage,
        LocalDate createdDate,
        LocalDate updatedDate
) {
}