package com.capestone.util;

import com.capestone.dto.PremiumEstimateRequestDTO;
import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;

@Component
public final class EstimatePrice {

    public BigDecimal estimateAmount(PremiumEstimateRequestDTO dto) {

        BigDecimal premium = dto.currentIdv().multiply(getBaseRate(dto.category()));

        premium = premium.multiply(getAgeFactor(dto.manufactureYear()));

        premium = premium.multiply(getUsageFactor(dto.vehicleUsage()));

        premium = premium.multiply(getFuelFactor(dto.fuelType()));

        premium = premium.multiply(getAccidentFactor(dto.accidentHistory(), dto.accidentCount()));

        premium = applyNoClaimBonus(premium, dto.noClaimBonusPercentage());

        premium = premium.add(getOwnerPenalty(dto.ownerCount()));

        return premium.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal getBaseRate(VehicleCategory category) {
        return switch (category) {
            case CAR -> BigDecimal.valueOf(0.03);
            case BIKE, MOTORCYCLE -> BigDecimal.valueOf(0.02);
            case CAMPER_VAN -> BigDecimal.valueOf(0.04);
            case TRUCK -> BigDecimal.valueOf(0.045);
        };
    }

    private static BigDecimal getAgeFactor(Integer manufactureYear) {

        int age = Year.now().getValue() - manufactureYear;

        if (age <= 3)
            return BigDecimal.valueOf(1.00);


        if (age <= 7)
            return BigDecimal.valueOf(1.10);


        if (age <= 12)
            return BigDecimal.valueOf(1.25);


        return BigDecimal.valueOf(1.50);
    }

    private static BigDecimal getUsageFactor(VehicleUsage usage) {
        return usage == VehicleUsage.COMMERCIAL
                ? BigDecimal.valueOf(1.25)
                : BigDecimal.ONE;
    }

    private static BigDecimal getFuelFactor(FuelType fuelType) {

        return switch (fuelType) {
            case PETROL -> BigDecimal.valueOf(1.00);
            case DIESEL -> BigDecimal.valueOf(1.05);
            case CNG -> BigDecimal.valueOf(1.08);
            case ELECTRIC -> BigDecimal.valueOf(0.95);
            case HYBRID -> BigDecimal.valueOf(0.98);
            case LPG -> BigDecimal.valueOf(1.03);
        };
    }

    private static BigDecimal getAccidentFactor(
            Boolean accidentHistory,
            Integer accidentCount) {

        if (Boolean.TRUE.equals(accidentHistory)) {

            int count = accidentCount == null
                    ? 1
                    : accidentCount;

            return BigDecimal.valueOf(
                    1.15 + (count * 0.02)
            );
        }

        return BigDecimal.ONE;
    }

    private static BigDecimal applyNoClaimBonus(
            BigDecimal premium,
            Integer ncbPercentage) {

        if (ncbPercentage == null || ncbPercentage <= 0) {
            return premium;
        }

        BigDecimal discount = premium.multiply(
                BigDecimal.valueOf(ncbPercentage)
                        .divide(BigDecimal.valueOf(100))
        );

        return premium.subtract(discount);
    }

    private static BigDecimal getOwnerPenalty(Integer ownerCount) {

        if (ownerCount == null || ownerCount <= 1) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(
                (ownerCount - 1L) * 1000L
        );
    }
}