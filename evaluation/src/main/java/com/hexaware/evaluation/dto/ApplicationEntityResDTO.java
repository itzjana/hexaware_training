package com.hexaware.evaluation.dto;


import java.time.Instant;

public record ApplicationEntityResDTO(
        int id,
        Instant appliedAt,
        String jobTitle,
        String companyName
) {
}
