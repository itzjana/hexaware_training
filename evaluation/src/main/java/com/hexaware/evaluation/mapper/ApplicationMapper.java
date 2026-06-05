package com.hexaware.evaluation.mapper;

import com.hexaware.evaluation.dto.ApplicationEntityResDTO;
import com.hexaware.evaluation.model.Application;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationEntityResDTO entityToDTO(Application application){
        return new ApplicationEntityResDTO(
                application.getId(),
                application.getAppliedAt(),
                application.getJob().getTitle(),
                application.getJob().getEmployee().getCompanyName()
        );
    }
}
