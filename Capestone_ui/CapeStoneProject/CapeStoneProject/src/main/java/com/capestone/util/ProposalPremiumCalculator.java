package com.capestone.util;

import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.List;

@Component
public class ProposalPremiumCalculator {

    public BigDecimal calculate(
            VehicleCategory category,
            Integer manufactureYear,
            BigDecimal currentIdv,
            VehicleUsage vehicleUsage,
            Boolean accidentHistory,
            Integer accidentCount,
            Integer noClaimBonusPercentage,
            List<BigDecimal> addOnCosts
    ) {
        BigDecimal idv = currentIdv != null ? currentIdv : BigDecimal.ZERO;

        // Base rate: 3.5% of IDV
        BigDecimal premium = idv.multiply(BigDecimal.valueOf(0.035));

        // Vehicle Category adjustment
        if (VehicleCategory.BIKE.equals(category) || VehicleCategory.MOTORCYCLE.equals(category)) {
            premium = idv.multiply(BigDecimal.valueOf(0.02));
        } else if (VehicleCategory.TRUCK.equals(category)) {
            premium = idv.multiply(BigDecimal.valueOf(0.045));
        }

        // Vehicle Age factor adjustment
        int currentYear = Year.now().getValue();
        int age = currentYear - (manufactureYear != null ? manufactureYear : currentYear);
        if (age > 10) {
            premium = premium.multiply(BigDecimal.valueOf(1.50));
        } else if (age > 5) {
            premium = premium.multiply(BigDecimal.valueOf(1.25));
        } else if (age > 2) {
            premium = premium.multiply(BigDecimal.valueOf(1.10));
        }

        // Surcharge for commercial usage
        if (VehicleUsage.COMMERCIAL.equals(vehicleUsage)) {
            premium = premium.multiply(BigDecimal.valueOf(1.25));
        }

        // Surcharge for accident history
        if (Boolean.TRUE.equals(accidentHistory)) {
            int accidents = accidentCount != null ? accidentCount : 1;
            premium = premium.multiply(BigDecimal.valueOf(1.15 + (accidents * 0.02)));
        }

        // Discount for No Claim Bonus
        if (noClaimBonusPercentage != null && noClaimBonusPercentage > 0) {
            BigDecimal discount = premium.multiply(BigDecimal.valueOf(noClaimBonusPercentage).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            premium = premium.subtract(discount);
        }

        // Add-ons cost
        if (addOnCosts != null) {
            for (BigDecimal cost : addOnCosts) {
                if (cost != null) {
                    premium = premium.add(cost);
                }
            }
        }

        // Apply GST (18%)
        premium = premium.multiply(BigDecimal.valueOf(1.18));

        return premium.setScale(2, RoundingMode.HALF_UP);
    }
}
