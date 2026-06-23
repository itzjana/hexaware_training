package com.capestone.dto;

import java.time.LocalDate;

public record CustomerUpdateReqDTO(
        String name,
        String address,
        LocalDate dob,
        String aadhaarNumber,
        String panNumber,
        String currentPassword,
        String newPassword

) {
}