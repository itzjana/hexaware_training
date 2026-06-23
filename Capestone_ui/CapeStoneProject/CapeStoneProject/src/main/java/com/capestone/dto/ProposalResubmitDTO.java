package com.capestone.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ProposalResubmitDTO(
        @NotEmpty(message = "At least one document ID is required")
        List<Integer> documentIds
) {
}
