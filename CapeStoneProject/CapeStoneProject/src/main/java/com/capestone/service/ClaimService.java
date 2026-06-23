package com.capestone.service;

import com.capestone.dto.*;
import com.capestone.enums.ClaimStatus;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.ClaimMapper;
import com.capestone.model.*;
import com.capestone.repository.ClaimRepository;
import com.capestone.util.FileUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyProposalService policyProposalService;
    private final ClaimMapper claimMapper;
    private final OfficerService officerService;
    private final NotificationLogService notificationLogService;
    private final FileUtil fileUtil;
    private final PolicyAddOnService policyAddOnService;

    @Value("${file.upload.location}")
    private String CLAIM_UPLOAD_LOC;


    public void createClaim(@Valid ClaimReqDTO claimReqDTO, List<MultipartFile> files, String name) throws IOException {

        PolicyProposal policyProposal = policyProposalService.findById(claimReqDTO.policyId());

        Path uploadPath = Paths.get(CLAIM_UPLOAD_LOC);
        Files.createDirectories(uploadPath);

        List<String> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            fileUtil.validateFile(file);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destinationPath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            uploadedFiles.add(filename);
        }

        Claim claim = new Claim();
        claim.setIncidentDescription(claimReqDTO.incidentDescription());
        claim.setPolicyProposal(policyProposal);
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setCurrentOdometerKm(claimReqDTO.currentOdometerKm());
        claim.setEstimatedAmount(claimReqDTO.estimatedAmount());
        claim.setDocumentPaths(uploadedFiles);
        claimRepository.save(claim);
    }

    public List<ClaimResDTO> getInitiatedClaims() {
        List<Claim> claims1 = claimRepository.findAllByStatus(ClaimStatus.SUBMITTED);
        List<Claim> claims2 = claimRepository.findAllByStatus(ClaimStatus.INITIATED);
        List<Claim> all = new ArrayList<>();
        all.addAll(claims1);
        all.addAll(claims2);
        return all.stream().map(claimMapper::entityToDTO).toList();
    }

    public ClaimDetailResDTO getClaimById(int id) {
        Claim claim = claimRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Claim not found"));
        List<PolicyProposalAddOn> addOns = policyAddOnService.getAddOnsByProposal(claim.getPolicyProposal());
        java.math.BigDecimal suggestedAmount = com.capestone.util.ClaimUtil.calculateSuggestedAmount(claim, addOns);
        return claimMapper.entityToDetailDto(claim, suggestedAmount);
    }

    public void claimStatusUpdate(int id, String name, @Valid ClaimUpdateReqDTO claimUpdateReqDTO) {
        Claim claim = claimRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Claim not found"));
        Officer officer = officerService.findByUserUsername(name);
        claim.setStatus(claimUpdateReqDTO.status());
        claim.setOfficer(officer);
        claim.setOfficerNote(claimUpdateReqDTO.officerNote());
        if (claimUpdateReqDTO.offeredAmount() != null) {
            claim.setOfferedAmount(claimUpdateReqDTO.offeredAmount());
        }
        claimRepository.save(claim);
    }

    public void respondToClaimOffer(int id, String customerUsername, String action) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        // Verify this claim belongs to the logged-in customer
        if (!claim.getPolicyProposal().getCustomer().getUser().getUsername().equals(customerUsername)) {
            throw new ResourceNotFoundException("Not your claim");
        }

        if (claim.getStatus() != ClaimStatus.OFFERED) {
            throw new IllegalStateException("Claim is not in OFFERED status");
        }

        if ("ACCEPT".equalsIgnoreCase(action)) {
            claim.setStatus(ClaimStatus.ACCEPTED);
        } else if ("REJECT".equalsIgnoreCase(action)) {
            claim.setStatus(ClaimStatus.REJECTED);
        } else {
            throw new IllegalArgumentException("Invalid action: " + action);
        }
        claimRepository.save(claim);
    }


    public List<ClaimClientResDTO> getByCustomer(String name) {

        List<Claim> claims = claimRepository.getByCustomer(name);

        return claims.stream()
                .map(claimMapper::entityToCustomerDTO).toList();
    }

    public List<ClaimClientResDTO> getByOfficer(String name) {
        List<Claim> claims = claimRepository.getByOfficer(name);

        return claims.stream()
                .map(claimMapper::entityToCustomerDTO).toList();
    }


    public List<Claim> getAll() {
        return claimRepository.findAll();
    }
}
