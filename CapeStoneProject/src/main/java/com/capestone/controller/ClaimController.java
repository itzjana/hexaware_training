package com.capestone.controller;

import com.capestone.dto.*;
import com.capestone.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/claim")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void createClaim(@Valid @RequestPart("claim") ClaimReqDTO claimReqDTO,
                            @RequestPart("files") List<MultipartFile> files,
                            Principal principal) throws IOException {
        claimService.createClaim(claimReqDTO, files, principal.getName());
    }

    @GetMapping("/getinitiated")
    public List<ClaimResDTO> getInitiatedClaims() {
        return claimService.getInitiatedClaims();
    }

    @GetMapping("/{id}")
    public ClaimDetailResDTO getClaimById(@PathVariable int id) {
        return claimService.getClaimById(id);
    }

    @PostMapping("/updatestatus/{id}")
    public void claimStatusUpdate(@PathVariable int id, Principal principal,
                                  @Valid @RequestBody ClaimUpdateReqDTO claimUpdateReqDTO) {
        claimService.claimStatusUpdate(id, principal.getName(), claimUpdateReqDTO);
    }

    @GetMapping("/getbycustomer")
    public List<ClaimClientResDTO> getByCustomer(Principal principal) {
        return claimService.getByCustomer(principal.getName());
    }

    @GetMapping("/getbyofficer")
    public List<ClaimClientResDTO> getByOfficer(Principal principal) {
        return claimService.getByOfficer(principal.getName());
    }

    @PostMapping("/{id}/respond")
    public void respondToClaimOffer(@PathVariable int id, Principal principal,
                                    @Valid @RequestBody ClaimRespondDTO dto) {
        claimService.respondToClaimOffer(id, principal.getName(), dto.action());
    }
}
