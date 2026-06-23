package com.capestone.dto;

import com.capestone.enums.DocumentType;

public record DocumentResDTO(int id,
                             String originalFileName,
                             String documentPath,
                             DocumentType documentType) {
}
