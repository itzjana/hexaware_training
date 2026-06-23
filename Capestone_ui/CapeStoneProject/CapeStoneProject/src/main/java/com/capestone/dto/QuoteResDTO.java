package com.capestone.dto;

import java.math.BigDecimal;

public record QuoteResDTO(
        int quoteId,
        int proposalId,
        String policyName,
        BigDecimal quotedPrice
) {
}
