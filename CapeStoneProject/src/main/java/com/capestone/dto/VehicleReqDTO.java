package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleCondition;
import com.capestone.enums.VehicleUsage;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VehicleReqDTO(
        @NotNull(message = "Vehicle category is required")
        VehicleCategory category,

        @NotBlank(message = "Registration number is required")
        String registrationNumber,

        @NotBlank(message = "Chassis number is required")
        String chassisNumber,

        @NotBlank(message = "Engine number is required")
        String engineNumber,

        @NotBlank(message = "Manufacturer is required")
        String manufacturer,

        @NotBlank(message = "Model is required")
        String model,

        @NotBlank(message = "Variant is required")
        String variant,

        @NotNull(message = "Manufacture year is required")
        Integer manufactureYear,

        @NotNull(message = "Registration date is required")
        LocalDate registrationDate,

        @NotNull(message = "Fuel type is required")
        FuelType fuelType,

        @NotNull(message = "Engine capacity (CC) is required")
        @Positive(message = "Engine capacity must be positive")
        Integer engineCapacityCc,

        @NotNull(message = "Seating capacity is required")
        @Positive(message = "Seating capacity must be positive")
        Integer seatingCapacity,

        @NotNull(message = "Vehicle usage is required")
        VehicleUsage usage,

        @NotNull(message = "Ex-showroom price is required")
        @Positive(message = "Ex-showroom price must be positive")
        BigDecimal exShowroomPrice,

        @NotNull(message = "Current IDV is required")
        @Positive(message = "Current IDV must be positive")
        BigDecimal currentIdv,

        @NotNull(message = "Owner count is required")
        @Min(value = 0, message = "Owner count cannot be negative")
        Integer ownerCount,

        @NotNull(message = "Vehicle condition is required")
        VehicleCondition condition,

        @NotNull(message = "Current odometer reading is required")
        @Min(value = 0, message = "Odometer reading cannot be negative")
        Long currentOdometerKm,

        @NotNull(message = "Please specify if the vehicle is modified")
        Boolean modifiedVehicle,

        @NotNull(message = "Please specify if the vehicle has accident history")
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
