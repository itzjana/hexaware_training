package com.hexaware.evaluation.dto;

import java.util.List;

public record ApplicationResDto(
        int pageCount,
        long numberOfRecord,
        List<ApplicationEntityResDTO> applicationEntityResDTOS
) {
}
