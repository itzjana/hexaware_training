package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.JobEntityResDTO;
import com.hexaware.evaluation.dto.JobReqDTO;
import com.hexaware.evaluation.dto.JobResDTO;
import com.hexaware.evaluation.exception.ResourceNotFoundException;
import com.hexaware.evaluation.mapper.JobMapper;
import com.hexaware.evaluation.model.Employee;
import com.hexaware.evaluation.model.Job;
import com.hexaware.evaluation.repository.JobRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final EmployeeService employeeService;
    private final JobMapper jobMapper;

    public void add(@Valid JobReqDTO jobReqDTO, String name) {
        // get emp
        Employee employee = employeeService.getEmployee(name);
        //prepare entity
        Job job = new Job();
        job.setTitle(jobReqDTO.title());
        job.setDescription(jobReqDTO.descrition());
        job.setLocation(jobReqDTO.location());
        job.setSalary(jobReqDTO.salary());
        job.setEmployee(employee);
        jobRepository.save(job);
    }

    public JobResDTO getAll(int page, int size) {

        Pageable pageable = PageRequest.of(page,size);

        Page<Job> jobs = jobRepository.findAll(pageable);

        List<Job> jobList = jobs.getContent();

        List<JobEntityResDTO> jobEntityResDTOS = jobList.stream()
                                                .map(jobMapper::entityToDTO).toList();

        return new JobResDTO(
                jobs.getTotalPages(),
                jobs.getTotalElements(),
                jobEntityResDTOS
        );
    }

    public Job getById(int id) {
        return jobRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No jobs found"));
    }
}
