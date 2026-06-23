package com.capestone.dto;

public record OfficerStatDTO(
        long officerClaimsCount,
        long officerProposalsCount,
        long initiatedProposalsCount,
        long initiatedClaimsCount
) {
}
