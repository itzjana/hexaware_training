package com.hexaware.evaluation.mapper;

import com.hexaware.evaluation.dto.ApplicationEntityResDTO;
import com.hexaware.evaluation.dto.ApplicationResDto;
import com.hexaware.evaluation.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

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

    public ApplicationResDto entityToDTOPagination(Page<Application> applications, List<ApplicationEntityResDTO> applicationEntityResDTOS) {

        return new ApplicationResDto(
                applications.getTotalPages(),
                applications.getTotalElements(),
                applicationEntityResDTOS
        );

    }
}
