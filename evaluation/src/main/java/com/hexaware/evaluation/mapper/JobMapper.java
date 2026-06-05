package com.hexaware.evaluation.mapper;

import com.hexaware.evaluation.dto.JobEntityResDTO;
import com.hexaware.evaluation.dto.JobResDTO;
import com.hexaware.evaluation.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;


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


    public JobResDTO entityToDTOPagination(Page<Job> jobs, List<JobEntityResDTO> jobEntityResDTOS) {

        return new JobResDTO(
                jobs.getTotalPages(),
                jobs.getTotalElements(),
                jobEntityResDTOS
        );
    }
}
