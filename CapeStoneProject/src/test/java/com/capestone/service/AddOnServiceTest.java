package com.capestone.service;

import com.capestone.dto.AddOnReqDTO;
import com.capestone.dto.AddOnSummaryDTO;
import com.capestone.dto.AddOnUpdatedDTO;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.AddOnMapper;
import com.capestone.model.PolicyAddOn;
import com.capestone.repository.AddOnRepository;
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
public class AddOnServiceTest {
   
    @Mock
    private AddOnRepository addOnRepository;

    @Mock
    private AddOnMapper addOnMapper;
    
    @InjectMocks
    private AddOnService addOnService;

    private PolicyAddOn addOn1;
    private PolicyAddOn addOn2;
    private PolicyAddOn addOn3;

    //Sample data
    @BeforeEach
    public void sampleData() {
        addOn1 = new PolicyAddOn();
        addOn1.setId(1);
        addOn1.setName("Zero Depreciation");
        addOn1.setDescription("Covers depreciation of replaced parts");
        addOn1.setAdditionalCost(null);
        addOn1.setActive(true);

        addOn2 = new PolicyAddOn();
        addOn2.setId(2);
        addOn2.setName("Road Side Assistance");
        addOn2.setDescription("24/7 roadside help");
        addOn2.setAdditionalCost(null);
        addOn2.setActive(true);

        addOn3 = new PolicyAddOn();
        addOn3.setId(3);
        addOn3.setName("Engine Protection");
        addOn3.setDescription("Covers engine damage");
        addOn3.setAdditionalCost(null);
        addOn3.setActive(true);
    }


    @Test
    public void getAll_ReturnsEmptyList() {
        when(addOnRepository.findAll()).thenReturn(List.of());

        List<AddOnSummaryDTO> actualCall = addOnService.getAll();

        assertThat(actualCall).isEmpty();
    }


    @Test
    void getById_AddOnNotFoundException() {
        when(addOnRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> addOnService.getById(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid Policy Add-on ID");

        verify(addOnRepository, times(1)).findById(99);
    }


    @Test
    void insert_MustCall() {
        AddOnReqDTO dto = new AddOnReqDTO("Engine Protection", "Covers engine damage", null);
        when(addOnMapper.addOnDTOToEntity(dto)).thenReturn(addOn3);
        when(addOnRepository.save(any(PolicyAddOn.class))).thenReturn(addOn3);

        addOnService.insert(dto);

        //Check repo call times
        verify(addOnRepository, times(1)).save(any(PolicyAddOn.class));
    }

    @Test
    void delete_Test() {
        when(addOnRepository.findById(1)).thenReturn(Optional.of(addOn1));

        when(addOnRepository.save(any(PolicyAddOn.class))).thenReturn(addOn1);

        addOnService.delete(1);

        verify(addOnRepository, times(1)).findById(1);
        verify(addOnRepository, times(1)).save(any(PolicyAddOn.class));
    }

    @Test
    void delete_AddOnNotFoundException() {
        when(addOnRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> addOnService.delete(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid Policy Add-on ID");

        verify(addOnRepository, times(1)).findById(99);
    }

    @Test
    void update_Test() {
        AddOnUpdatedDTO updatedDTO = new AddOnUpdatedDTO("Updated Name", "Updated desc",null,true);
        when(addOnRepository.findById(1)).thenReturn(Optional.of(addOn1));
        when(addOnMapper.updateAddOnFromDTO(updatedDTO, addOn1)).thenReturn(addOn1);
        when(addOnRepository.save(any(PolicyAddOn.class))).thenReturn(addOn1);

        addOnService.update(updatedDTO, 1);

        //Check repo call
        verify(addOnRepository, times(1)).save(any(PolicyAddOn.class));
        verify(addOnRepository, times(1)).findById(1);
    }

    @Test
    void update_AddOnNotFound_ThrowsException() {
        AddOnUpdatedDTO updatedDTO = new AddOnUpdatedDTO("Updated Name", "Updated desc",null,true);
        when(addOnRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> addOnService.update(updatedDTO, 99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("AddOn not found");

        verify(addOnRepository, times(1)).findById(99);
    }
}
