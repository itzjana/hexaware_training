package com.capestone.mapper;

import com.capestone.dto.ClaimClientResDTO;
import com.capestone.dto.ClaimDetailResDTO;
import com.capestone.dto.ClaimResDTO;
import com.capestone.model.Claim;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ClaimMapper {

    public ClaimResDTO entityToDTO(Claim claim) {
        return new ClaimResDTO(
                claim.getId(),
                claim.getIncidentDescription(),
                claim.getPolicyProposal().getPolicy().getPolicyName(),
                claim.getPolicyProposal().getStartDate(),
                claim.getPolicyProposal().getVehicle().getCategory(),
                claim.getPolicyProposal().getCustomer().getName()
        );
    }



    public ClaimDetailResDTO entityToDetailDto(Claim claim, BigDecimal suggestedAmount) {
        return new ClaimDetailResDTO(
                claim.getId(),
                claim.getIncidentDescription(),
                claim.getStatus().toString(),
                claim.getOfficerNote(),
                claim.getPolicyProposal().getCustomer().getName(),
                claim.getPolicyProposal().getCustomer().getAddress(),
                claim.getPolicyProposal().getCustomer().getAadharNumber(),
                claim.getPolicyProposal().getCustomer().getPanNumber(),
                claim.getPolicyProposal().getPolicy().getPolicyName(),
                claim.getPolicyProposal().getStartDate(),
                claim.getPolicyProposal().getEndDate(),
                claim.getPolicyProposal().getVehicle().getRegistrationNumber(),
                claim.getPolicyProposal().getVehicle().getManufacturer(),
                claim.getPolicyProposal().getVehicle().getModel(),
                claim.getPolicyProposal().getVehicle().getCategory(),
                claim.getPolicyProposal().getVehicle().getManufactureYear(),
                claim.getCurrentOdometerKm(),
                claim.getDocumentPaths(),
                claim.getEstimatedAmount(),
                claim.getOfferedAmount(),
                suggestedAmount
        );
    }

    public ClaimClientResDTO entityToCustomerDTO(Claim claim) {
        return new ClaimClientResDTO(
                claim.getId(),
                claim.getPolicyProposal().getPolicy().getPolicyName(),
                claim.getPolicyProposal().getVehicle().getRegistrationNumber(),
                claim.getIncidentDescription(),
                claim.getCurrentOdometerKm(),
                claim.getStatus(),
                claim.getPolicyProposal().getStartDate(),
                claim.getPolicyProposal().getEndDate(),
                claim.getEstimatedAmount(),
                claim.getOfferedAmount()
        );
    }
}
