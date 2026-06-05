package com.hexaware.evaluation.dto;

import java.util.List;

public record JobResDTO(
        int pageCount,
        long numberOfRecord,
        List<JobEntityResDTO> jobList
) {
}
