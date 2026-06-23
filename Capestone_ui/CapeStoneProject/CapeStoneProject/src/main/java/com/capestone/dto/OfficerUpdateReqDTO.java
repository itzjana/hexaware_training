package com.capestone.dto;

import com.capestone.enums.JobTitle;
import jakarta.validation.constraints.Size;

public record OfficerUpdateReqDTO(

        String name,
        String password
) {
}