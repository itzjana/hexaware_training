package com.capestone.dto;

import java.time.LocalDate;
import java.util.List;

public record CustomerResDTO(
        int id,
        String name,
        String address,
        LocalDate dob,
        String aadhaarNumber,
        String panNumber,
        String userName
) {
}