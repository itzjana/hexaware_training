package com.capestone.service;

import com.capestone.dto.AddOnReqDTO;
import com.capestone.dto.AddOnUpdatedDTO;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.AddOnMapper;
import com.capestone.model.PolicyAddOn;
import com.capestone.repository.AddOnRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AddOnService {
    private final AddOnRepository addOnRepository;
    private final AddOnMapper addOnMapper;

    public List<PolicyAddOn> getAll() {
        return addOnRepository.findAll();
    }

    public void insert(AddOnReqDTO dto) {
        addOnRepository.save(addOnMapper.addOnDTOToEntity(dto));
    }



    public void delete(int id) {
        PolicyAddOn policyAddOn = addOnRepository.findById(id)
                                .orElseThrow(()->new ResourceNotFoundException("Invalid Policy Add-on ID"));

        policyAddOn.setActive(false);
        addOnRepository.save(policyAddOn);
    }

    public void update(AddOnUpdatedDTO updatedAddOn, int id) {
        PolicyAddOn addOn = addOnRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("AddOn not found"));
        addOnRepository.save(addOnMapper.updateAddOnFromDTO(updatedAddOn, addOn));
    }

    public PolicyAddOn getById(int id) {
        return addOnRepository.findById(id).
                orElseThrow(()->new ResourceNotFoundException("Invalid Policy Add-on ID"));
    }

    public List<PolicyAddOn> findAllById(List<Integer> addOnId) {
        return addOnRepository.findAllById(addOnId);
    }
}
