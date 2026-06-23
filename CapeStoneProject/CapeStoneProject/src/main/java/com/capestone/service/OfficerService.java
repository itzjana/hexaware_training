package com.capestone.service;

import com.capestone.dto.*;
import com.capestone.enums.Role;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.exception.UsernameExistsException;
import com.capestone.mapper.OfficerMapper;
import com.capestone.model.Officer;
import com.capestone.model.User;
import com.capestone.repository.ClaimRepository;
import com.capestone.repository.OfficerRepository;
import com.capestone.repository.PolicyProposalRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final OfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final OfficerMapper officerMapper;
    private final PolicyProposalRepository policyProposalRepository;
    private final ClaimRepository claimRepository;

    @Value("${officer.temp.password}")
    private String tempPassword;


    public void officerSignup(@Valid OfficerSignupReqDTO officerSignupReqDTO) {

        //check for valid username
        if(userService.checkUsernameExists(officerSignupReqDTO.username()))
            throw  new UsernameExistsException("Username taken,try different");

        if(userService.checkEmailExists(officerSignupReqDTO.email()))
            throw  new UsernameExistsException("Email already exists.");

        User user = new User();
        user.setUsername(officerSignupReqDTO.username());
        user.setEmail(officerSignupReqDTO.email());
        user.setRole(Role.INSURANCE_OFFICER);
        String encodedPassword = passwordEncoder.encode(tempPassword);
        user.setPassword(encodedPassword);

        user = userService.signup(user);

        Officer officer = new Officer();
        officer.setName(officerSignupReqDTO.name());
        officer.setUser(user);
        officer.setJobTitle(officerSignupReqDTO.jobTitle());

        officerRepository.save(officer);


    }

    public void adminSignup( AdminReqDTO adminReqDTO) {
        User user = new User();
        user.setUsername(adminReqDTO.username());
        user.setEmail(adminReqDTO.email());
        user.setRole(Role.ADMIN);
        String encodedPassword = passwordEncoder.encode(adminReqDTO.password());
        user.setPassword(encodedPassword);
        userService.signup(user);
    }


    public OfficerResDTO getOfficerByUserUsername(String username) {
        return officerMapper.officerEntityToDTO(officerRepository.findByUserUsername(username));
    }


    public OfficerResDTO updateOfficer(String username, OfficerUpdateReqDTO dto) {
        Officer officer = officerRepository.findByUserUsername(username);
        if (officer == null)
            throw new ResourceNotFoundException("Officer not found");
        officer = officerMapper.updateOfficerFromDTO(dto, officer);
        if (dto.password() != null && !dto.password().isBlank()) {
            User user = officer.getUser();
            user.setPassword(passwordEncoder.encode(dto.password()));
            userService.signup(user);
        }
        Officer updatedOfficer = officerRepository.save(officer);
        return officerMapper.officerEntityToDTO(updatedOfficer);
    }

    //quote gen
    public Officer findByUserUsername(String username) {
        return officerRepository.findByUserUsername(username);
    }


    public List<OfficerDetailsDTO> getAllOfficersWithStats() {

        List<Officer> officers = officerRepository.findAll();

        List<OfficerDetailsDTO> dto = new ArrayList<>();

        for (Officer officer : officers) {
            int proposals = policyProposalRepository.countByOfficer(officer);
            int claims = claimRepository.countByOfficer(officer);
            dto.add(officerMapper.adminStat(officer,proposals,claims));
        }
        return dto;
    }

    public OfficerDetailsDTO getAllOfficerByName(String name) {

        Officer officer = officerRepository.findByName(name);
        int proposals = policyProposalRepository.countByOfficer(officer);
        int claims = claimRepository.countByOfficer(officer);
        return officerMapper.adminStat(officer,proposals,claims);
    }
}
