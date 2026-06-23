package com.capestone.dto;

import com.capestone.enums.Role;

public record LoginResDTO(
        int id,
        String username,
        String email,
        Role role
) {
}
