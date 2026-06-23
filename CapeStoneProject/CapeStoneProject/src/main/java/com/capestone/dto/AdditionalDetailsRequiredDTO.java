package com.capestone.dto;

import jakarta.validation.constraints.NotBlank;

public record AdditionalDetailsRequiredDTO(
        @NotBlank(message = "Officer remark is required")
        String officerRemark
) {
}