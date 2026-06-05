package com.hexaware.evaluation.dto;

public record JobEntityResDTO(
        int id,
        String title,
        String description,
        String location,
        Double salary,
        String companyName
) {
}
