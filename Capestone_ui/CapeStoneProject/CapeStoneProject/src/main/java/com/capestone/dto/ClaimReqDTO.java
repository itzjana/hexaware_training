package com.capestone.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClaimReqDTO(

        @NotNull
        Integer policyId,

        @NotBlank(message = "Provide some information")
        String incidentDescription,

        @NotNull(message = "Enter the Current OdoMeter KM")
        Long currentOdometerKm,

        @NotNull(message = "Enter estimated amount")
        java.math.BigDecimal estimatedAmount
) {
}
