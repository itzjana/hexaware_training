package com.capestone.controller;

import com.capestone.dto.*;
import com.capestone.service.StatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stat")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class StatController {

    private final StatService statService;


    @GetMapping("/adminstats")
    public adminStatDTO getAdminStat() {
        return statService.getAdminStat();
    }


    @GetMapping("/proposals/by-status")
    public List<AdminPieStat> proposalsByStatus() {
        return statService.getProposalStatusDistribution();
    }


    @GetMapping("/officers/top")
    public List<OfficerPerformanceDTO> getTopOfficers() {
        return statService.getTopOfficers();
    }

    @GetMapping("/officerstats")
    public OfficerStatDTO getOfficerStat(Principal principal) {
        return statService.getOfficerStat(principal.getName());
    }
}
