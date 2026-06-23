package com.capestone.dto;

import com.capestone.enums.DocumentType;

public record VehicleDocumentDTO(
        Integer documentId,
        DocumentType documentType,
        String originalFileName
) {
}
