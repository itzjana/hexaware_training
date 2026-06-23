package com.capestone.dto;

import com.capestone.enums.Role;

public record TokenDTO(
        String username,
        String token,
        Role role
) {
}
