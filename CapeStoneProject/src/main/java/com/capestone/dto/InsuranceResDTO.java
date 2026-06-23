package com.capestone.dto;

import java.util.List;

public record InsuranceResDTO(
        long totalRecord,
        int totalPages,
        List<InsurancePolicyResDTO> list

) {
}