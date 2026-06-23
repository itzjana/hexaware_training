package com.capestone.dto;

import com.capestone.enums.JobTitle;

public record OfficerDetailsDTO(
        int id,
        int userId,
        String username,
        String email,
        String name,
        JobTitle jobTitle,
        int proposalCount,
        int claimCount
) {}