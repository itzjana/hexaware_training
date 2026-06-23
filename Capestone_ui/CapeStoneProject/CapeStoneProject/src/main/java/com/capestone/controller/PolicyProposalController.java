package com.capestone.controller;


import com.capestone.dto.*;
import com.capestone.service.PolicyProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/policyproposal")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PolicyProposalController {

    private final PolicyProposalService policyProposalService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PolicyProposalResDTO createProposal(Principal principal,
                                               @Valid @RequestPart("proposal")
                                               PolicyProposalCreateDTO dto,
                                               @RequestPart("files") List<MultipartFile> files) throws IOException {
        return policyProposalService.createProposal(
                principal.getName(),
                dto,
                files
        );
    }

    @GetMapping("/all")
    public AdminPolicyDTO getALLProposals(@RequestParam(required = false) String status,
                                          @RequestParam(required = false, defaultValue = "0") int page,
                                          @RequestParam(required = false, defaultValue = "5") int size) {
        return policyProposalService.getALLProposals(status, page, size);
    }

    @GetMapping("/submitted")
    public List<ProposalSummaryDTO> getSubmittedProposals() {
        return policyProposalService.getSubmittedProposals();
    }

    @GetMapping("/{id}")
    public OfficerProposalListDTO getSubmittedProposalsById(@PathVariable int id) {
        return policyProposalService.getSubmittedProposalsById(id);
    }

    @GetMapping("/customer/all")
    public List<ProposalSummaryDTO> getMyProposals(Principal principal) {
        return policyProposalService.getCustomerProposals(principal.getName());
    }

    @GetMapping("/officer/all")
    public List<ProposalSummaryDTO> getMyProposalsByOfficer(Principal principal) {
        return policyProposalService.getOfficerProposals(principal.getName());
    }

    @PatchMapping(value = "/{proposalId}/resubmit",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void resubmitProposal(@PathVariable int proposalId,@RequestPart("files") List<MultipartFile> files) throws IOException {
        policyProposalService.resubmitProposal(proposalId,files);
    }

    @GetMapping("/{id}/calculate-premium")
    public ProposalPremiumCalculationDTO calculatePremium(@PathVariable int id) {
        return policyProposalService.calculateProposalPremium(id);
    }


}