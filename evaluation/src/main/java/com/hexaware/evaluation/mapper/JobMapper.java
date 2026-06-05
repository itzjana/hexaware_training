package com.hexaware.evaluation.mapper;

import com.hexaware.evaluation.dto.JobEntityResDTO;
import com.hexaware.evaluation.model.Job;
import org.springframework.stereotype.Component;


@Component
public class JobMapper {

    public JobEntityResDTO entityToDTO(Job job){
        return new JobEntityResDTO(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getSalary(),
                job.getEmployee().getCompanyName()
        );
    }
}
