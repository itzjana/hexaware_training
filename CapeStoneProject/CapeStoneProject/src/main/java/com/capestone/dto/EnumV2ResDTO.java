package com.capestone.dto;

import com.capestone.enums.*;

import java.util.List;

public record EnumV2ResDTO(
        List<ClaimStatus> claimStatuses,
        List<FuelType> fuelTypes,
        List<JobTitle> jobTitles,
        List<PolicyStatus> policyStatuses,
        List<VehicleCategory> vehicleCategories,
        List<VehicleCondition> vehicleConditions,
        List<VehicleUsage> vehicleUsages
) {
}
