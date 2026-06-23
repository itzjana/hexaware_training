package com.capestone.controller;

import com.capestone.dto.InsuranceDTO;
import com.capestone.dto.InsurancePolicyResDTO;
import com.capestone.dto.InsuranceResDTO;
import com.capestone.dto.InsuranceUpdateDTO;
import com.capestone.dto.PolicySuggestionReqDTO;
import com.capestone.service.InsurancePolicyService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/insurance")
@CrossOrigin(origins = "http://localhost:5173/")
public class InsurancePolicyController {

    private final InsurancePolicyService insurancePolicyService;

    @GetMapping("/all")
    public List<InsurancePolicyResDTO> getALL() {
        return insurancePolicyService.getAll();
    }

    //currently active
    @GetMapping("/v2/all")
    public List<InsurancePolicyResDTO> getAllActive() {
        return insurancePolicyService.getAllActive();
    }

    @GetMapping("/all/v2")
    public InsuranceResDTO getALLWithPagination(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return insurancePolicyService
                .getALLWithPagination(page,size);
    }

    @GetMapping("/all/public")
    public InsuranceResDTO getALLWithPaginationForPublic(@RequestParam int page, @RequestParam int size) {
        return insurancePolicyService.getALLWithPaginationForPublic(page,size);
    }

    @GetMapping("/getbyid/{id}")
    public InsurancePolicyResDTO getById(
            @PathVariable int id
    ) {
        return insurancePolicyService.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(
            @PathVariable int id
    ) {
        insurancePolicyService.deleteById(id);
    }

    @PutMapping("/update/{id}")
    public InsurancePolicyResDTO update(@Valid @RequestBody InsuranceUpdateDTO dto, @PathVariable int id) {
        return insurancePolicyService.update(dto,id);
    }

    @PostMapping("/insert")
    public InsurancePolicyResDTO insert(@Valid @RequestBody InsuranceDTO dto) {
        return insurancePolicyService.insert(dto);
    }

    // Suggest policies based on the logged-in customer's vehicles
    @PostMapping("/suggested")
    public List<InsurancePolicyResDTO> getSuggestedByCustomerVehicle(Principal principal) {
        return insurancePolicyService.getSuggestedPoliciesForCustomer(principal.getName());
    }

    // Suggest policies based on explicit request body
    @PostMapping("/suggest")
    public List<InsurancePolicyResDTO> getSuggestedPolicies(@Valid @RequestBody PolicySuggestionReqDTO dto) {
        return insurancePolicyService.getSuggestedPolicies(dto);
    }

}

