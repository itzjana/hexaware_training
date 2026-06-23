package com.capestone.service;

import com.capestone.dto.*;
import com.capestone.enums.ClaimStatus;
import com.capestone.enums.PolicyStatus;
import com.capestone.enums.Role;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.model.Claim;
import com.capestone.model.Officer;
import com.capestone.model.User;
import com.capestone.repository.ClaimRepository;
import com.capestone.repository.OfficerRepository;
import com.capestone.repository.PolicyProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.Month;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatService {

    private final UserService userService;
    private final InsurancePolicyService insurancePolicyService;
    private final ClaimService claimService;
    private final PolicyProposalRepository policyProposalRepository;
    private final OfficerRepository officerRepository;
    private final ClaimRepository claimRepository;

    public adminStatDTO getAdminStat() {
        // get all users
        List<User> users = userService.getAllUser();
        long customerCount = users.stream()
                .filter(u -> Role.CUSTOMER.equals(u.getRole()))
                .count();
        long officerCount = users.stream()
                .filter(u -> Role.INSURANCE_OFFICER.equals(u.getRole()))
                .count();
        List<InsurancePolicyResDTO> policyCount = insurancePolicyService.getAll();

        List<Claim> claims =claimService.getAll();

        return new adminStatDTO(
                customerCount,
                officerCount,
                policyCount.size(),
                claims.size()
        );

    }

    public List<AdminPieStat> getProposalStatusDistribution() {
         return policyProposalRepository.countByStatus();
    }


    public List<OfficerPerformanceDTO> getTopOfficers() {
        List<Officer> officers = officerRepository.findAll();

        List<OfficerPerformanceDTO> performanceList = new ArrayList<>();

        for (Officer officer : officers) {

            int proposals = policyProposalRepository.countByOfficer(officer);
            int claims = claimRepository.countByOfficer(officer);
            int total = proposals + claims;
            performanceList.add(new OfficerPerformanceDTO(officer.getName(), proposals, claims, total));

        }

        performanceList.sort(Comparator.comparingInt(OfficerPerformanceDTO::totalHandled));

        return performanceList.stream().limit(5).toList();
    }

    public OfficerStatDTO getOfficerStat(String username) {
        Officer officer = officerRepository.findByUserUsername(username);
        if (officer == null) {
            throw new ResourceNotFoundException("Officer not found");
        }
        long officerClaimsCount = claimRepository.countByOfficer(officer);
        long officerProposalsCount = policyProposalRepository.countByOfficer(officer);
        long initiatedProposalsCount = policyProposalRepository.countByStatus1(PolicyStatus.PROPOSAL_SUBMITTED);
        long initiatedClaimsCount = claimRepository.countByStatus(ClaimStatus.SUBMITTED)
                + claimRepository.countByStatus(ClaimStatus.INITIATED);

        return new OfficerStatDTO(
                officerClaimsCount,
                officerProposalsCount,
                initiatedProposalsCount,
                initiatedClaimsCount
        );
    }
}
