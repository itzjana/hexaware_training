package com.capestone.mapper;

import com.capestone.dto.OfficerDetailsDTO;
import com.capestone.dto.OfficerResDTO;
import com.capestone.dto.OfficerUpdateReqDTO;
import com.capestone.model.Officer;
import org.springframework.stereotype.Component;

@Component

public class OfficerMapper {


    public OfficerResDTO officerEntityToDTO(Officer officer){
        return new OfficerResDTO(
                officer.getId(),
                officer.getName(),
                officer.getJobTitle()
        );
    }

    public Officer updateOfficerFromDTO(OfficerUpdateReqDTO dto, Officer officer) {
        if (dto.name() != null)
            officer.setName(dto.name());
        return officer;
    }

    public OfficerDetailsDTO adminStat(Officer officer,int proposals,int claims){


        return new OfficerDetailsDTO(
                officer.getId(),
                officer.getUser().getId(),
                officer.getUser().getUsername(),
                officer.getUser().getEmail(),
                officer.getName(),
                officer.getJobTitle(),
                proposals,
                claims
        );
    }
}
