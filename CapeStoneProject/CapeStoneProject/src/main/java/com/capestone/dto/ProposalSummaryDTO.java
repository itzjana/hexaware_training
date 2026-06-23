package com.capestone.dto;

import java.time.Instant;

public record ProposalSummaryDTO(
        int proposalId,
        String policyName,
        String vehicleNumber,
        String vehicleModel,
        String manufacturer,
        String status,
        Instant submittedAt
) {
}
