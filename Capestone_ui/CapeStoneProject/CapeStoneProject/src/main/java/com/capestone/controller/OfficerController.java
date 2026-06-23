package com.capestone.controller;

import com.capestone.dto.AdditionalDetailsRequiredDTO;
import com.capestone.dto.OfficerDetailsDTO;
import com.capestone.dto.OfficerResDTO;
import com.capestone.dto.OfficerUpdateReqDTO;
import com.capestone.service.OfficerService;
import com.capestone.service.PolicyProposalService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/officer")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OfficerController {

    private final OfficerService officerService;
    private final PolicyProposalService policyProposalService;

    @GetMapping("/me")
    public OfficerResDTO getCustomerByUserUsername(Principal principal){
        return officerService.getOfficerByUserUsername(principal.getName());
    }

    @PatchMapping("/me/update")
    public OfficerResDTO updateOfficer(Principal principal, @Valid @RequestBody OfficerUpdateReqDTO dto) {
        return officerService.updateOfficer(principal.getName(), dto);
    }

    @PatchMapping("/proposal/additional-details/{id}")
    public void requestAdditionalDetails(@PathVariable int id,
                                         @Valid @RequestBody AdditionalDetailsRequiredDTO dto,
                                         Principal principal) {
        policyProposalService.requestAdditionalDetails(id, dto, principal.getName());
    }

    @GetMapping("/list")
    public List<OfficerDetailsDTO> getAllOfficers() {
        return officerService.getAllOfficersWithStats();
    }

    @GetMapping("/search")
    public OfficerDetailsDTO getAllOfficerByName(@RequestParam String name) {
        return officerService.getAllOfficerByName(name);
    }


}
