package com.capestone.controller;

import com.capestone.dto.PremiumEstimateRequestDTO;
import com.capestone.dto.PremiumEstimateResponseDTO;
import com.capestone.util.EstimatePrice;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class PremiumEstimateController {

    private final EstimatePrice estimatePrice;
    @PostMapping("/api/estimate")
    public PremiumEstimateResponseDTO estimate(@RequestBody PremiumEstimateRequestDTO dto) {
        return new PremiumEstimateResponseDTO( estimatePrice.estimateAmount(dto));
    }
}