package com.capestone.dto;

import com.capestone.enums.DocumentType;

public record CustomerDocumentDTO(
        int documentId,
        DocumentType documentType,
        String originalFileName
) {
}