package com.capestone.dto;

import com.capestone.enums.PolicyStatus;

import java.time.Instant;
import java.time.LocalDate;

public record PolicyProposalResDTO(
        int id,
        PolicyStatus status,
        Instant submissionAt
) {
}