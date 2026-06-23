package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;

import java.math.BigDecimal;
import java.time.Instant;

public record InsurancePolicyResDTO(
        Integer id,
        String policyName,
        String description,
        BigDecimal baseRate,
        Integer validityMonths,
        Boolean active,
        VehicleCategory vehicleCategory,
        VehicleUsage vehicleUsage,
        FuelType fuelType,
        Instant createdAt,
        Instant updatedAt

) {
}