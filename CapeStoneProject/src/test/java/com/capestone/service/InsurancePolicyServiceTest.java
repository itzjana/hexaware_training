package com.capestone.service;

import com.capestone.dto.InsuranceDTO;
import com.capestone.dto.InsurancePolicyResDTO;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.InsuranceMapper;
import com.capestone.model.InsurancePolicy;
import com.capestone.repository.InsurancePolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InsurancePolicyServiceTest {
 
    @Mock
    private InsurancePolicyRepository insurancePolicyRepository;
 
    @Mock
    private InsuranceMapper insuranceMapper;
 
    @InjectMocks
    private InsurancePolicyService insurancePolicyService;

    private InsurancePolicy policy1;
    private InsurancePolicy policy2;
    private InsurancePolicyResDTO resDTO1;
    private InsurancePolicyResDTO resDTO2;

    // Common Sample data for all test cases 
    @BeforeEach
    public void sampleData() {
        policy1 = new InsurancePolicy();
        policy1.setId(1);
        policy1.setPolicyName("Basic Cover");
        policy1.setBaseRate(null);
        policy1.setValidityMonths(12);
        policy1.setActive(true);

        policy2 = new InsurancePolicy();
        policy2.setId(2);
        policy2.setPolicyName("Comprehensive Cover");
        policy2.setBaseRate(null);
        policy2.setValidityMonths(12);
        policy2.setActive(true);

        // Dummy response DTOs (mapper will return these in tests)
        resDTO1 = new InsurancePolicyResDTO(1, "Basic Cover", "desc",  null, 12, true, null, null, null, null, null);
        resDTO2 = new InsurancePolicyResDTO(2, "Comprehensive Cover", "desc",  null, 12, true, null, null, null, null, null);
    }



    @Test
    public void getAll_MustReturnPolicies() {
        when(insurancePolicyRepository.findAll()).thenReturn(List.of(policy1, policy2));
        when(insuranceMapper.entityToDTO(policy1)).thenReturn(resDTO1);
        when(insuranceMapper.entityToDTO(policy2)).thenReturn(resDTO2);

        List<InsurancePolicyResDTO> actualCall = insurancePolicyService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().policyName()).isEqualTo("Basic Cover");
        assertThat(actualCall.get(1).policyName()).isEqualTo("Comprehensive Cover");
    }

    @Test
    public void getAll_ReturnsEmptyList() {
        when(insurancePolicyRepository.findAll()).thenReturn(List.of());

        List<InsurancePolicyResDTO> actualCall = insurancePolicyService.getAll();

        assertThat(actualCall).isEmpty();
    }

    @Test
    void getById_PolicyExists() {
        when(insurancePolicyRepository.findById(1)).thenReturn(Optional.of(policy1));
        when(insurancePolicyRepository.findById(2)).thenReturn(Optional.of(policy2));
        when(insuranceMapper.entityToDTO(policy1)).thenReturn(resDTO1);
        when(insuranceMapper.entityToDTO(policy2)).thenReturn(resDTO2);

        assertThat(insurancePolicyService.getById(1).policyName()).isEqualTo("Basic Cover");
        assertThat(insurancePolicyService.getById(2).policyName()).isEqualTo("Comprehensive Cover");
    }

    @Test
    void getById_PolicyNotFoundException() {
        when(insurancePolicyRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> insurancePolicyService.getById(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Policy not found");

        verify(insurancePolicyRepository, times(1)).findById(99);
    }

  

    @Test
    void insert_MustSave() {
        when(insuranceMapper.dTOToEntity(any(InsuranceDTO.class))).thenReturn(policy1);
        when(insurancePolicyRepository.save(any(InsurancePolicy.class))).thenReturn(policy1);
        when(insuranceMapper.entityToDTO(policy1)).thenReturn(resDTO1);

        InsuranceDTO dto = new InsuranceDTO("Basic Cover", "desc",  null, 12, null, null, null);

        InsurancePolicyResDTO actualCall = insurancePolicyService.insert(dto);

        assertThat(actualCall.policyName()).isEqualTo("Basic Cover");

        verify(insurancePolicyRepository, times(1)).save(any(InsurancePolicy.class));
    }
  

    @Test
    void deleteById() {
        when(insurancePolicyRepository.findById(1)).thenReturn(Optional.of(policy1));

        when(insurancePolicyRepository.save(any(InsurancePolicy.class))).thenReturn(policy1);

        insurancePolicyService.deleteById(1);

        // Check repo call times
        verify(insurancePolicyRepository, times(1)).findById(1);
        verify(insurancePolicyRepository, times(1)).save(any(InsurancePolicy.class));
    }

    @Test
    void deleteById_PolicyNotFoundException() {
        when(insurancePolicyRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> insurancePolicyService.deleteById(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("No Policy found");

        verify(insurancePolicyRepository, times(1)).findById(99);
    }
}
