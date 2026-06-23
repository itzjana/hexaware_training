package com.capestone.dto;

public record adminStatDTO(
        long customerCount,
        long officerCount,
        long activePolicyCount,
        long openClaims
) {
}
