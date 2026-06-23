package com.capestone.dto;

import java.util.List;

public record PolicyProposalCreateDTO(

        int vehicleId,

        int policyId,

        List<Integer> addOnIds
) {
}