package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record InsuranceDTO(
        @NotBlank(message = "Policy name is required")
        String policyName,

        String description,

        @NotNull(message = "Base rate is required")
        BigDecimal baseRate,

        @NotNull(message = "Validity months is required")
        Integer validityMonths,

        @NotNull(message = "select the vehicleUsage")
        VehicleUsage vehicleUsage,

        @NotNull(message = "Select the vehicleCategory ")
        VehicleCategory vehicleCategory,

        @NotNull(message = "Select the FuelType")
        FuelType fuelType


) {
}