package com.capestone.service;

import com.capestone.dto.EnumResDTO;
import com.capestone.dto.EnumV2ResDTO;
import com.capestone.enums.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class EnumService {


    public EnumResDTO getEnums() {
        List<ClaimStatus> claimStatuses = Arrays.stream(ClaimStatus.values()).toList();
        List<FuelType> fuelTypes = Arrays.stream(FuelType.values()).toList();
        List<JobTitle> jobTitles = Arrays.stream(JobTitle.values()).toList();
        List<NotificationType> notificationTypes = Arrays.stream(NotificationType.values()).toList();
        List<PaymentStatus> paymentStatuses = Arrays.stream(PaymentStatus.values()).toList();
        List<PolicyStatus> policyStatuses = Arrays.stream(PolicyStatus.values()).toList();
        List<Role> role = Arrays.stream(Role.values()).toList();
        List<VehicleCategory> vehicleCategories = Arrays.stream(VehicleCategory.values()).toList();
        List<VehicleCondition> vehicleConditions = Arrays.stream(VehicleCondition.values()).toList();
        List<VehicleUsage> vehicleUsages = Arrays.stream(VehicleUsage.values()).toList();

        return new EnumResDTO(
                claimStatuses,fuelTypes,jobTitles,notificationTypes,paymentStatuses,policyStatuses,role,vehicleCategories,vehicleConditions,vehicleUsages
        );
    }

    public EnumV2ResDTO getEnumsV2() {
        List<ClaimStatus> claimStatuses = Arrays.stream(ClaimStatus.values()).toList();
        List<FuelType> fuelTypes = Arrays.stream(FuelType.values()).toList();
        List<JobTitle> jobTitles = Arrays.stream(JobTitle.values()).toList();
        List<PolicyStatus> policyStatuses = Arrays.stream(PolicyStatus.values()).toList();
        List<VehicleCategory> vehicleCategories = Arrays.stream(VehicleCategory.values()).toList();
        List<VehicleCondition> vehicleConditions = Arrays.stream(VehicleCondition.values()).toList();
        List<VehicleUsage> vehicleUsages = Arrays.stream(VehicleUsage.values()).toList();

        return new EnumV2ResDTO(
                claimStatuses, fuelTypes, jobTitles, policyStatuses, vehicleCategories, vehicleConditions, vehicleUsages
        );
    }
}
