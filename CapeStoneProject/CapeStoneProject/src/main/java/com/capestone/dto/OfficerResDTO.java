package com.capestone.dto;

import com.capestone.enums.JobTitle;

public record OfficerResDTO(
        int id,
        String name,
        JobTitle jobTitle
) {
}
