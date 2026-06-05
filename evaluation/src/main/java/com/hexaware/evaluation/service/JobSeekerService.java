package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.JobSeekerReqDTO;
import com.hexaware.evaluation.model.JobSeeker;
import com.hexaware.evaluation.model.User;
import com.hexaware.evaluation.repository.JobSeekerRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;

    public void add(@Valid JobSeekerReqDTO jobSeekerReqDTO, User user) {

        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setName(jobSeekerReqDTO.name());
        jobSeeker.setResumeSummary(jobSeekerReqDTO.resumeSummary());
        jobSeeker.setUser(user);
        jobSeekerRepository.save(jobSeeker);

    }

    public JobSeeker getByUsername(String name) {
        return jobSeekerRepository.findByUserUsername(name);
    }
}
