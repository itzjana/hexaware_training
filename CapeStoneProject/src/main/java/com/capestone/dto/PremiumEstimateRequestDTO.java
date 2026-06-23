package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;

import java.math.BigDecimal;

public record PremiumEstimateRequestDTO(
        VehicleCategory category,
        Integer manufactureYear,
        BigDecimal currentIdv,
        FuelType fuelType,
        VehicleUsage vehicleUsage,
        Integer ownerCount,
        Boolean accidentHistory,
        Integer accidentCount,
        Integer noClaimBonusPercentage
) {
}