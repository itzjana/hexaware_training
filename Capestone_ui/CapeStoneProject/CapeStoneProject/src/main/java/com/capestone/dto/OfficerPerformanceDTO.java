package com.capestone.dto;

public record OfficerPerformanceDTO(
        String name,
        int proposalCount,
        int claimCount,
        int totalHandled
) {}
