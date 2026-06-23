package com.capestone.dto;

import java.math.BigDecimal;

public record PremiumEstimateResponseDTO(
        BigDecimal estimatedPremium
) {
}