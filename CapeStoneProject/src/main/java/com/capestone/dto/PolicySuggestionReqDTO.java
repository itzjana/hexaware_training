package com.capestone.dto;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;
import jakarta.validation.constraints.NotNull;

public record PolicySuggestionReqDTO(

        @NotNull(message = "Vehicle category is required")
        VehicleCategory vehicleCategory,

        @NotNull(message = "Vehicle usage is required")
        VehicleUsage vehicleUsage,

        @NotNull(message = "Fuel type is required")
        FuelType fuelType
) {
}
