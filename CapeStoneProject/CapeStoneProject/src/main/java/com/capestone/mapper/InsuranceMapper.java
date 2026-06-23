package com.capestone.mapper;

import com.capestone.dto.*;
import com.capestone.model.InsurancePolicy;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InsuranceMapper {

    public InsurancePolicy dTOToEntity(InsuranceDTO dto) {

        InsurancePolicy policy = new InsurancePolicy();

        policy.setPolicyName(dto.policyName());
        policy.setDescription(dto.description());
        policy.setBaseRate(dto.baseRate());
        policy.setValidityMonths(dto.validityMonths());
        policy.setActive(true);
        policy.setVehicleCategory(dto.vehicleCategory());
        policy.setFuelType(dto.fuelType());
        policy.setVehicleUsage(dto.vehicleUsage());
        return policy;
    }

    public InsurancePolicy updateDTOToEntity(InsuranceUpdateDTO dto, InsurancePolicy policy) {
        if(dto.policyName() != null)
            policy.setPolicyName(dto.policyName());

        if(dto.description() != null)
            policy.setDescription(dto.description());

        if(dto.baseRate() != null)
            policy.setBaseRate(dto.baseRate());

        if(dto.validityMonths() != null) policy.setValidityMonths(dto.validityMonths());

        if(dto.active() != null)
            policy.setActive(dto.active());

        if(dto.vehicleCategory() != null)
            policy.setVehicleCategory(dto.vehicleCategory());

        if(dto.vehicleUsage() != null)
            policy.setVehicleUsage(dto.vehicleUsage());

        if(dto.fuelType() != null)
            policy.setFuelType(dto.fuelType());

        return policy;
    }

    public InsurancePolicyResDTO entityToDTO(InsurancePolicy policy) {

        return new InsurancePolicyResDTO(
                policy.getId(),
                policy.getPolicyName(),
                policy.getDescription(),
                policy.getBaseRate(),
                policy.getValidityMonths(),
                policy.getActive(),
                policy.getVehicleCategory(),
                policy.getVehicleUsage(),
                policy.getFuelType(),
                policy.getCreatedAt(),
                policy.getUpdatedAt()
        );
    }

    public InsuranceResDTO entityToDTO(Page<InsurancePolicy> page) {

        List<InsurancePolicyResDTO> list = page.getContent()
                                                .stream()
                                                .map(this::entityToDTO)
                                                .toList();
        return new InsuranceResDTO(
                page.getTotalElements(),
                page.getTotalPages(),
                list
        );
    }
}