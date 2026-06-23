package com.capestone.dto;

import jakarta.validation.constraints.NotBlank;

public record ClaimRespondDTO(
        @NotBlank(message = "Action must be ACCEPT or REJECT")
        String action
) {
}
