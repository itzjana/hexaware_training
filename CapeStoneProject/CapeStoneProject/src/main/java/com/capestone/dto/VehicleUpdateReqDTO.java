package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleCondition;
import com.capestone.enums.VehicleUsage;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleUpdateReqDTO(
        String registrationNumber,
        String chassisNumber,
        String engineNumber,
        VehicleCategory category,
        String manufacturer,
        String model,
        String variant,

        @Min(value = 1900, message = "Manufacture year must be at least 1900")
        Integer manufactureYear,

        LocalDate registrationDate,
        FuelType fuelType,

        @Positive(message = "Engine capacity must be positive")
        Integer engineCapacityCc,

        @Positive(message = "Seating capacity must be positive")
        Integer seatingCapacity,

        VehicleUsage usage,

        @Positive(message = "Ex-showroom price must be positive")
        BigDecimal exShowroomPrice,

        @Positive(message = "Current IDV must be positive")
        BigDecimal currentIdv,

        @Min(value = 0, message = "Owner count cannot be negative")
        Integer ownerCount,

        VehicleCondition condition,

        @Min(value = 0, message = "Odometer reading cannot be negative")
        Long currentOdometerKm,

        Boolean modifiedVehicle,
        Boolean accidentHistory,

        @Min(value = 0, message = "Accident count cannot be negative")
        Integer accidentCount,

        String previousInsurer,
        String previousPolicyNumber,
        LocalDate previousPolicyExpiryDate,

        @Min(value = 0, message = "No-claim bonus percentage cannot be negative")
        @Max(value = 100, message = "No-claim bonus percentage cannot exceed 100")
        Integer noClaimBonusPercentage
) {
}
