package com.capestone.model;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleCondition;
import com.capestone.enums.VehicleUsage;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter

public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(optional = false)
    private Customer customer;

    @Column(unique = true)
    private String registrationNumber;

    @Column(unique = true)
    private String chassisNumber;

    @Column(unique = true)
    private String engineNumber;

    @Enumerated(EnumType.STRING)
    private VehicleCategory category;

    private String manufacturer;

    private String model;

    private String variant;

    private Integer manufactureYear;

    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    private Integer engineCapacityCc;

    private Integer seatingCapacity;

    @Enumerated(EnumType.STRING)
    private VehicleUsage vehicleUsage;


    @Column(precision = 12, scale = 2)
    private BigDecimal exShowroomPrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal currentIdv;

    private String documentPath;

    private Integer ownerCount;

    @Enumerated(EnumType.STRING)
    private VehicleCondition vehicleCondition;

    private Long currentOdometerKm;

    private Boolean modifiedVehicle;

    private Boolean accidentHistory;

    private Integer accidentCount;

    private String previousInsurer;

    private String previousPolicyNumber;

    private LocalDate previousPolicyExpiryDate;

    private Integer noClaimBonusPercentage;

    private LocalDate createdDate;

    private LocalDate updatedDate;
}