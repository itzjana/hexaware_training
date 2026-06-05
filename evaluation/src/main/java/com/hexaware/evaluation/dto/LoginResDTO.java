package com.hexaware.evaluation.dto;

import com.hexaware.evaluation.enums.Role;

public record LoginResDTO(
        int id,
        String username,
        String email,
        Role role
) {
}
