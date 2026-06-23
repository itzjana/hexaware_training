package com.capestone.dto;

import com.capestone.enums.PolicyStatus;

public record AdminPieStat(
        PolicyStatus status ,
        Long count
    ) {}
