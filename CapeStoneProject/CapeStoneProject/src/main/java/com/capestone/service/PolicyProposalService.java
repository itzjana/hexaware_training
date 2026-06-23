package com.capestone.service;

import com.capestone.dto.*;
import com.capestone.enums.NotificationType;
import com.capestone.enums.PolicyStatus;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.PolicyProposalMapper;
import com.capestone.model.*;
import com.capestone.repository.PolicyProposalRepository;
import com.capestone.util.FileUtil;
import com.capestone.util.ProposalPremiumCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PolicyProposalService {

    private final CustomerService customerService;
    private final VehicleService vehicleService;
    private final InsurancePolicyService insurancePolicyService;
    private final PolicyProposalMapper policyProposalMapper;
    private final PolicyProposalRepository policyProposalRepository;
    private final AddOnService addOnService;
    private final PolicyAddOnService policyAddOnService;
    private final NotificationLogService notificationLogService;
    private final OfficerService officerService;
    private final FileUtil fileUtil;
    private final ProposalPremiumCalculator proposalPremiumCalculator;

    @Value("${file.upload.location}")
    private String PROPOSAL_UPLOAD_LOC;


    public PolicyProposalResDTO createProposal(String username, PolicyProposalCreateDTO dto, List<MultipartFile> files) throws IOException {

        Customer customer = customerService.getCustomer(username);
        Vehicle vehicle = vehicleService.getVehicle(dto.vehicleId());
        InsurancePolicy policy = insurancePolicyService.getInsurancePolicy(dto.policyId());

        PolicyProposal proposal = policyProposalMapper.createProposal(customer, vehicle, policy);

        Path uploadPath = Paths.get(PROPOSAL_UPLOAD_LOC);
        Files.createDirectories(uploadPath);
        List<String> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            fileUtil.validateFile(file);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destinationPath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            uploadedFiles.add(filename);
        }

        proposal.setDocumentPaths(uploadedFiles);
        proposal = policyProposalRepository.save(proposal);
        List<PolicyAddOn> addOns = addOnService.findAllById(dto.addOnIds());
        for (PolicyAddOn addOn : addOns) {
            PolicyProposalAddOn proposalAddOn = new PolicyProposalAddOn();
            proposalAddOn.setPolicyProposal(proposal);
            proposalAddOn.setPolicyAddOn(addOn);
            policyAddOnService.save(proposalAddOn);
        }

        return policyProposalMapper.entityToDTO(proposal);
    }

    public List<ProposalSummaryDTO> getSubmittedProposals() {

        return policyProposalRepository
                .findByStatus(PolicyStatus.PROPOSAL_SUBMITTED)
                .stream()
                .map(policyProposalMapper::proposalToSummaryDTO)
                .toList();
    }

    public OfficerProposalListDTO getSubmittedProposalsById(int id) {
        PolicyProposal policyProposal = policyProposalRepository.findById(id)
                                        .orElseThrow(()->new ResourceNotFoundException("Proposal not found"));

        List<PolicyProposalAddOn> addOns = policyAddOnService.getAddOnsByProposal(policyProposal);

        return policyProposalMapper.officerProposalDTO(policyProposal,addOns);
    }


    public PolicyProposal findById(int id) {
        return policyProposalRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Invalid Id"));
    }

    // payment update
    public void save(PolicyProposal proposal) {
        policyProposalRepository.save(proposal);
    }


    public void requestAdditionalDetails(int proposalId, AdditionalDetailsRequiredDTO dto, String username) {
        PolicyProposal proposal = findById(proposalId);
        Officer officer = officerService.findByUserUsername(username);
        proposal.setStatus(PolicyStatus.ADDITIONAL_DETAILS_REQUIRED);
        proposal.setOfficerRemark(dto.officerRemark());
        proposal.setOfficer(officer);
        policyProposalRepository.save(proposal);

        NotificationLog notificationLog = new NotificationLog();
        notificationLog.setNotificationType(NotificationType.ADDITIONAL_DETAILS_REQUIRED);
        notificationLog.setTitle("Further Info Required");
        notificationLog.setMessage(dto.officerRemark());
        notificationLog.setUser(proposal.getCustomer().getUser());
        notificationLogService.save(notificationLog);

    }


    public void resubmitProposal(int proposalId, List<MultipartFile> files) throws IOException {
        PolicyProposal proposal = findById(proposalId);

        Path uploadPath = Paths.get(PROPOSAL_UPLOAD_LOC);
        Files.createDirectories(uploadPath);
        List<String> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            fileUtil.validateFile(file);
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destinationPath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            uploadedFiles.add(filename);
        }

        proposal.setDocumentPaths(uploadedFiles);
        proposal.setStatus(PolicyStatus.UNDER_REVIEW);
        proposal = policyProposalRepository.save(proposal);


        NotificationLog notificationLog = new NotificationLog();
        notificationLog.setNotificationType(NotificationType.CUSTOMER_RESPONSE_RECEIVED);
        notificationLog.setTitle("Customer Uploaded Requested Information");
        notificationLog.setMessage("Proposal #" + proposal.getId() + " has been updated by customer.");
        notificationLog.setUser(proposal.getOfficer().getUser());
        notificationLogService.save(notificationLog);
    }


    public List<ProposalSummaryDTO> getCustomerProposals(String username) {

        Customer customer = customerService.getCustomer(username);
        List<PolicyProposal> list = policyProposalRepository.findByCustomer(customer);
        return list.stream()
                .map(policyProposalMapper::proposalToSummaryDTO)
                .toList();
    }

    public List<ProposalSummaryDTO> getOfficerProposals(String username) {

        Officer officer = officerService.findByUserUsername(username);
        List<PolicyProposal> list = policyProposalRepository.findByOfficer(officer);
        return list.
                stream().map(policyProposalMapper::proposalToSummaryDTO)
                .toList();
    }

    public AdminPolicyDTO getALLProposals(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PolicyProposal> content;

        if (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) {
            content = policyProposalRepository.findAll(pageable);
        } else {
            PolicyStatus policyStatus = PolicyStatus.valueOf(status.toUpperCase());
            content = policyProposalRepository.findByStatus(policyStatus, pageable);
        }

        List<PolicyProposal> list = content.getContent();
        return new AdminPolicyDTO(
                content.getTotalPages(),
                content.getTotalElements(),
                list.stream().map(policyProposalMapper::proposalToSummaryDTO).toList()
        );
    }

    public ProposalPremiumCalculationDTO calculateProposalPremium(int id) {
        PolicyProposal proposal = findById(id);
        List<PolicyProposalAddOn> addOns = policyAddOnService.getAddOnsByProposal(proposal);

        Vehicle vehicle = proposal.getVehicle();

        List<BigDecimal> addOnCosts = new java.util.ArrayList<>();
        if (addOns != null) {
            for (PolicyProposalAddOn addon : addOns) {
                if (addon.getPolicyAddOn() != null) {
                    addOnCosts.add(addon.getPolicyAddOn().getAdditionalCost());
                }
            }
        }

        BigDecimal estimatedAmount = proposalPremiumCalculator.calculate(
                vehicle.getCategory(),
                vehicle.getManufactureYear(),
                vehicle.getCurrentIdv(),
                vehicle.getVehicleUsage(),
                vehicle.getAccidentHistory(),
                vehicle.getAccidentCount(),
                vehicle.getNoClaimBonusPercentage(),
                addOnCosts
        );

        return new ProposalPremiumCalculationDTO(estimatedAmount);
    }
}
