package com.capestone.service;

import com.capestone.dto.InsuranceDTO;
import com.capestone.dto.InsurancePolicyResDTO;
import com.capestone.dto.InsuranceResDTO;
import com.capestone.dto.InsuranceUpdateDTO;
import com.capestone.dto.PolicySuggestionReqDTO;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.InsuranceMapper;
import com.capestone.model.Customer;
import com.capestone.model.InsurancePolicy;
import com.capestone.repository.InsurancePolicyRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class InsurancePolicyService {

    private static final Logger logger = LoggerFactory.getLogger(InsurancePolicyService.class);

    private final InsurancePolicyRepository insurancePolicyRepository;
    private final InsuranceMapper insuranceMapper;
    private final CustomerService customerService;


    public List<InsurancePolicyResDTO> getAll() {
        logger.info("Fetching all insurance policies");
        return insurancePolicyRepository
                .findAll()
                .stream()
                .map(insuranceMapper::entityToDTO)
                .toList();
    }

    //currently active
    public List<InsurancePolicyResDTO> getAllActive() {
        return insurancePolicyRepository
                .findAll()
                .stream()
                .filter(InsurancePolicy::getActive)
                .map(insuranceMapper::entityToDTO)
                .toList();
    }

    public InsurancePolicyResDTO getById(int id) {
        logger.info("Fetching insurance policy with id: {}", id);
        InsurancePolicy policy = insurancePolicyRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        return insuranceMapper.entityToDTO(policy);
    }

    public void deleteById(int id) {
        InsurancePolicy insurancePolicy = insurancePolicyRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No Policy found"));
        insurancePolicy.setActive(false);
        insurancePolicyRepository.save(insurancePolicy);
    }


    public InsurancePolicyResDTO update(InsuranceUpdateDTO dto, int id) {

        InsurancePolicy policy = insurancePolicyRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
        policy = insuranceMapper.updateDTOToEntity(dto, policy);
        policy = insurancePolicyRepository.save(policy);
        return insuranceMapper.entityToDTO(policy);
    }

    public InsurancePolicyResDTO insert(InsuranceDTO dto) {
        InsurancePolicy policy = insuranceMapper.dTOToEntity(dto);
        policy = insurancePolicyRepository.save(policy);
        return insuranceMapper.entityToDTO(policy);
    }

    public InsuranceResDTO getALLWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<InsurancePolicy> list = insurancePolicyRepository.findAll(pageable);
        return insuranceMapper.entityToDTO(list);
    }

    public InsurancePolicy getInsurancePolicy(int id) {
        return insurancePolicyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
    }

    // policies by logged-in customer vehicles
    public List<InsurancePolicyResDTO> getSuggestedPoliciesForCustomer(String username) {
        Customer customer = customerService.getCustomer(username);

        List<InsurancePolicy> policies = insurancePolicyRepository.findSuggestedPoliciesByCustomer(customer);
        
        return policies.stream()
                .map(insuranceMapper::entityToDTO)
                .toList();
    }

    // policy by customer input
    public List<InsurancePolicyResDTO> getSuggestedPolicies(PolicySuggestionReqDTO dto) {
        List<InsurancePolicy> policies = insurancePolicyRepository
                .findByVehicleCategoryAndVehicleUsageAndFuelTypeAndActiveTrue(
                        dto.vehicleCategory(),
                        dto.vehicleUsage(),
                        dto.fuelType()
                );
        return policies.stream()
                .map(insuranceMapper::entityToDTO)
                .toList();
    }

    public InsuranceResDTO getALLWithPaginationForPublic(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<InsurancePolicy> list = insurancePolicyRepository.findAllByActiveTrue(pageable);
        return insuranceMapper.entityToDTO(list);
    }
}
