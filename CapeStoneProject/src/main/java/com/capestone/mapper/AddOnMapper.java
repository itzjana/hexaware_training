package com.capestone.mapper;

import com.capestone.dto.AddOnReqDTO;
import com.capestone.dto.AddOnSummaryDTO;
import com.capestone.dto.AddOnUpdatedDTO;
import com.capestone.model.PolicyAddOn;
import org.springframework.stereotype.Component;

@Component
public class AddOnMapper {

    public PolicyAddOn addOnDTOToEntity(AddOnReqDTO dto){
        PolicyAddOn policyAddOn = new PolicyAddOn();
        policyAddOn.setName(dto.name());
        policyAddOn.setDescription(dto.description());
        policyAddOn.setAdditionalCost(dto.additionalCost());
        return policyAddOn;
    }

    public PolicyAddOn updateAddOnFromDTO(AddOnUpdatedDTO dto, PolicyAddOn addOn) {

        if (dto.name() != null)
            addOn.setName(dto.name());
        if (dto.description() != null)
            addOn.setDescription(dto.description());
        if (dto.additionalCost() != null)
            addOn.setAdditionalCost(dto.additionalCost());
        if(dto.active()!=null)
            addOn.setActive(dto.active());

        return addOn;
    }

    public AddOnSummaryDTO entityToDTO(PolicyAddOn addOn) {
        return new AddOnSummaryDTO(
                addOn.getId(),
                addOn.getName(),
                addOn.getAdditionalCost(),
                addOn.getDescription(),
                addOn.getActive()
        );
    }
}
