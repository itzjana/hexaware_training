package com.capestone.dto;

import java.util.List;

public record AdminPolicyDTO (
    int totalPage,
    Long totalRecord,
    List<ProposalSummaryDTO> proposalSummaryDTOList
){}
