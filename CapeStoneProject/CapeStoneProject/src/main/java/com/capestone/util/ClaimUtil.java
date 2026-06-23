package com.capestone.util;

import com.capestone.model.Claim;
import com.capestone.model.PolicyProposal;
import com.capestone.model.PolicyProposalAddOn;
import com.capestone.model.Vehicle;
import com.capestone.model.InsurancePolicy;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

public class ClaimUtil {

    public static BigDecimal calculateSuggestedAmount(Claim claim, List<PolicyProposalAddOn> addOns) {
        PolicyProposal proposal = claim.getPolicyProposal();
        if (proposal == null) {
            return BigDecimal.ZERO;
        }

        Vehicle vehicle = proposal.getVehicle();
        InsurancePolicy policy = proposal.getPolicy();
        if (vehicle == null || policy == null) {
            return BigDecimal.ZERO;
        }

        // Base value: current IDV or ex-showroom price or default 500,000
        BigDecimal baseValue = vehicle.getCurrentIdv() != null ? vehicle.getCurrentIdv() :
                (vehicle.getExShowroomPrice() != null ? vehicle.getExShowroomPrice() : BigDecimal.valueOf(500000));

        // Base damage coverage: 15% of vehicle value
        BigDecimal potentialCoverage = baseValue.multiply(BigDecimal.valueOf(0.15));

        // 1. Odometer factor: wear and tear reduces coverage
        // Odo factor = 1.0 - (currentOdometerKm / 300000.0) -> cap at minimum 0.3
        double odometer = claim.getCurrentOdometerKm() != null ? claim.getCurrentOdometerKm() : 0.0;
        double odoFactor = 1.0 - (odometer / 300000.0);
        if (odoFactor < 0.3) {
            odoFactor = 0.3;
        }

        // 2. Age factor: reduces coverage based on age of vehicle
        int currentYear = LocalDate.now().getYear();
        int age = currentYear - (vehicle.getManufactureYear() != null ? vehicle.getManufactureYear() : currentYear);
        double ageFactor = 1.0 - (age * 0.05); // 5% reduction per year
        if (ageFactor < 0.4) {
            ageFactor = 0.4;
        }

        // 3. Policy factor: premium + add-ons increase the coverage multiplier
        BigDecimal baseRate = policy.getBaseRate() != null ? policy.getBaseRate() : BigDecimal.ZERO;
        BigDecimal totalAddonCost = BigDecimal.ZERO;
        if (addOns != null) {
            for (PolicyProposalAddOn addOn : addOns) {
                if (addOn.getPolicyAddOn() != null && addOn.getPolicyAddOn().getAdditionalCost() != null) {
                    totalAddonCost = totalAddonCost.add(addOn.getPolicyAddOn().getAdditionalCost());
                }
            }
        }

        double policyVal = baseRate.add(totalAddonCost).doubleValue();
        double policyFactor = 1.0 + (policyVal / 20000.0);
        if (policyFactor > 1.8) {
            policyFactor = 1.8;
        }

        double finalMultiplier = odoFactor * ageFactor * policyFactor;
        BigDecimal suggested = potentialCoverage.multiply(BigDecimal.valueOf(finalMultiplier));

        // Cap suggested amount at the base value
        if (suggested.compareTo(baseValue) > 0) {
            suggested = baseValue;
        }

        return suggested.setScale(2, RoundingMode.HALF_UP);
    }
}
