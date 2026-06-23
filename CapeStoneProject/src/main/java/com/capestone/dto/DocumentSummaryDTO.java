package com.capestone.dto;

import com.capestone.enums.DocumentType;

public record DocumentSummaryDTO(
        int id,
        String originalFileName,
        DocumentType documentType,
        String documentUrl
) {
}