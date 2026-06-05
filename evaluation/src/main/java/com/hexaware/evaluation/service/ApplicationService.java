package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.ApplicationEntityResDTO;
import com.hexaware.evaluation.dto.ApplicationResDto;
import com.hexaware.evaluation.mapper.ApplicationMapper;
import com.hexaware.evaluation.model.Application;
import com.hexaware.evaluation.model.Job;
import com.hexaware.evaluation.model.JobSeeker;
import com.hexaware.evaluation.repository.ApplicationRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final JobSeekerService jobSeekerService;
    private final ApplicationMapper applicationMapper;

    public void add(int id, String name) {
        //get job by id
        Job job = jobService.getById(id);
        //get job-seeker
        JobSeeker jobSeeker = jobSeekerService.getByUsername(name);
        //prepare application to save
        Application application = new Application();
        application.setJob(job);
        application.setJobSeeker(jobSeeker);
        applicationRepository.save(application);
    }

    public ApplicationResDto getMyApplication(String name, int page, int size) {

        // get jobseeker by name
        JobSeeker jobSeeker = jobSeekerService.getByUsername(name);

        Pageable pageable = PageRequest.of(page,size);

        Page<Application> applications = applicationRepository.findByJobSeeker(jobSeeker,pageable);

        List<ApplicationEntityResDTO> applicationEntityResDTOS = applications
                                                                .getContent()
                                                                .stream()
                                                                .map(applicationMapper::entityToDTO)
                                                                .toList();

        return new ApplicationResDto(
                applications.getTotalPages(),
                applications.getTotalElements(),
                applicationEntityResDTOS
        );

    }
}
