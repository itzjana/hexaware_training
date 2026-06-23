package com.capestone.dto;

import com.capestone.enums.*;

import java.util.List;

public record EnumResDTO(
        List<ClaimStatus> claimStatuses,
        List<FuelType> fuelTypes,
        List<JobTitle> jobTitles,
        List<NotificationType> notificationTypes,
        List<PaymentStatus> paymentStatuses,
        List<PolicyStatus> policyStatuses,
        List<Role> role,
        List<VehicleCategory> vehicleCategories,
        List<VehicleCondition> vehicleConditions,
        List<VehicleUsage> vehicleUsages
) {
}
