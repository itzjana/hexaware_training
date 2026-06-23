package com.capestone.mapper;

import com.capestone.dto.*;
import com.capestone.enums.PolicyStatus;
import com.capestone.model.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class PolicyProposalMapper {


    public PolicyProposal createProposal(Customer customer, Vehicle vehicle, InsurancePolicy policy) {
        PolicyProposal proposal = new PolicyProposal();
        proposal.setCustomer(customer);
        proposal.setVehicle(vehicle);
        proposal.setPolicy(policy);
        proposal.setStatus(PolicyStatus.PROPOSAL_SUBMITTED);
        return proposal;
    }

    public PolicyProposalResDTO entityToDTO(PolicyProposal proposal
    ) {

        return new PolicyProposalResDTO(
                proposal.getId(),
                proposal.getStatus(),
                proposal.getSubmittedAt()
        );
    }

    public ProposalSummaryDTO proposalToSummaryDTO(PolicyProposal proposal) {

        return new ProposalSummaryDTO(
                proposal.getId(),
                proposal.getPolicy().getPolicyName(),
                proposal.getVehicle().getRegistrationNumber(),
                proposal.getVehicle().getModel(),
                proposal.getVehicle().getManufacturer(),
                proposal.getStatus().name(),
                proposal.getSubmittedAt()
        );
    }

    public OfficerProposalListDTO officerProposalDTO(PolicyProposal policyProposal, List<PolicyProposalAddOn> addOns) {

        List<AddOnSummaryDTO> addOnDTOs = addOns
                                            .stream()
                                            .map(addOn -> new AddOnSummaryDTO(
                                                    addOn.getPolicyAddOn().getId(),
                                            addOn.getPolicyAddOn().getName(),
                                            addOn.getPolicyAddOn().getAdditionalCost(), addOn.getPolicyAddOn().getDescription()))
                                            .toList();


        return new OfficerProposalListDTO(
                policyProposal.getId(),

                // Customer
                policyProposal.getCustomer().getName(),
                policyProposal.getCustomer().getAddress(),
                policyProposal.getCustomer().getPanNumber(),
                policyProposal.getCustomer().getAadharNumber(),
                policyProposal.getCustomer().getDob(),

                // Policy
                policyProposal.getPolicy().getPolicyName(),
                policyProposal.getPolicy().getBaseRate(),

                // Vehicle
                policyProposal.getVehicle().getRegistrationNumber(),
                policyProposal.getVehicle().getManufacturer(),
                policyProposal.getVehicle().getModel(),
                policyProposal.getVehicle().getVariant(),
                policyProposal.getVehicle().getCategory(),
                policyProposal.getVehicle().getManufactureYear(),
                policyProposal.getVehicle().getRegistrationDate(),
                policyProposal.getVehicle().getFuelType(),
                policyProposal.getVehicle().getEngineCapacityCc(),
                policyProposal.getVehicle().getSeatingCapacity(),
                policyProposal.getVehicle().getVehicleUsage(),
                policyProposal.getVehicle().getCurrentIdv(),
                policyProposal.getVehicle().getOwnerCount(),
                policyProposal.getVehicle().getVehicleCondition(),
                policyProposal.getVehicle().getCurrentOdometerKm(),
                policyProposal.getVehicle().getModifiedVehicle(),
                policyProposal.getVehicle().getAccidentHistory(),
                policyProposal.getVehicle().getAccidentCount(),
                policyProposal.getVehicle().getPreviousInsurer(),
                policyProposal.getVehicle().getNoClaimBonusPercentage(),
                policyProposal.getVehicle().getDocumentPath(),
                addOnDTOs,
                policyProposal.getStartDate(),
                policyProposal.getEndDate(),
                policyProposal.getOfficerRemark(),
                policyProposal.getDocumentPaths(),
                policyProposal.getStatus(),
                policyProposal.getSubmittedAt()
        );
    }
}