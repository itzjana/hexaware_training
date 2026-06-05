package com.hexaware.evaluation.controller;

import com.hexaware.evaluation.dto.JobReqDTO;
import com.hexaware.evaluation.dto.JobResDTO;
import com.hexaware.evaluation.service.JobService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/job")
@AllArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/add")
    public void add(@Valid @RequestBody JobReqDTO jobReqDTO, Principal principal){
        jobService.add(jobReqDTO,principal.getName());
    }

    @GetMapping("/all")
    public JobResDTO getAll( @RequestParam(defaultValue = "0", required = false) int page,
                             @RequestParam(defaultValue = "10", required = false) int size){
        return jobService.getAll(page,size);
    }
}
