package com.hexaware.evaluation.controller;

import com.hexaware.evaluation.dto.ApplicationResDto;
import com.hexaware.evaluation.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/application")
@AllArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{id}")
    public void add(@PathVariable int id , Principal principal){
        applicationService.add(id,principal.getName());
    }

    @GetMapping("/getmyapplication")
    public ApplicationResDto getMyApplication(Principal principal,
                                                    @RequestParam(defaultValue = "0", required = false) int page,
                                                    @RequestParam(defaultValue = "10", required = false) int size){
        return applicationService.getMyApplication(principal.getName(),page,size);
    }
}
