package com.capestone.mapper;

import com.capestone.dto.*;
import com.capestone.model.Customer;
import com.capestone.model.Vehicle;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VehicleMapper {
    public Vehicle dTOToEntity(Customer customer, VehicleReqDTO dto) {

        Vehicle vehicle = new Vehicle();
        vehicle.setCustomer(customer);
        vehicle.setCategory(dto.category());
        vehicle.setRegistrationNumber(dto.registrationNumber());
        vehicle.setChassisNumber(dto.chassisNumber());
        vehicle.setEngineNumber(dto.engineNumber());
        vehicle.setManufacturer(dto.manufacturer());
        vehicle.setModel(dto.model());
        vehicle.setVariant(dto.variant());
        vehicle.setManufactureYear(dto.manufactureYear());
        vehicle.setRegistrationDate(dto.registrationDate());
        vehicle.setFuelType(dto.fuelType());
        vehicle.setEngineCapacityCc(dto.engineCapacityCc());
        vehicle.setSeatingCapacity(dto.seatingCapacity());
        vehicle.setVehicleUsage(dto.usage());
        vehicle.setExShowroomPrice(dto.exShowroomPrice());
        vehicle.setCurrentIdv(dto.currentIdv());
        vehicle.setOwnerCount(dto.ownerCount());
        vehicle.setVehicleCondition(dto.condition());
        vehicle.setCurrentOdometerKm(dto.currentOdometerKm());
        vehicle.setModifiedVehicle(dto.modifiedVehicle());
        vehicle.setAccidentHistory(dto.accidentHistory());
        vehicle.setAccidentCount(dto.accidentCount());
        vehicle.setPreviousInsurer(dto.previousInsurer());
        vehicle.setPreviousPolicyNumber(dto.previousPolicyNumber());
        vehicle.setPreviousPolicyExpiryDate(dto.previousPolicyExpiryDate());
        vehicle.setNoClaimBonusPercentage(dto.noClaimBonusPercentage());
        return vehicle;
    }

    public VehicleResDTO entityToDTO(Vehicle vehicle) {

        return new VehicleResDTO(
                vehicle.getId(),
                vehicle.getCategory(),
                vehicle.getRegistrationNumber(),
                vehicle.getChassisNumber(),
                vehicle.getEngineNumber(),
                vehicle.getManufacturer(),
                vehicle.getModel(),
                vehicle.getVariant(),
                vehicle.getManufactureYear(),
                vehicle.getRegistrationDate(),
                vehicle.getFuelType(),
                vehicle.getEngineCapacityCc(),
                vehicle.getSeatingCapacity(),
                vehicle.getVehicleUsage(),
                vehicle.getExShowroomPrice(),
                vehicle.getCurrentIdv(),
                vehicle.getOwnerCount(),
                vehicle.getVehicleCondition(),
                vehicle.getCurrentOdometerKm(),
                vehicle.getModifiedVehicle(),
                vehicle.getAccidentHistory(),
                vehicle.getAccidentCount(),
                vehicle.getPreviousInsurer(),
                vehicle.getPreviousPolicyNumber(),
                vehicle.getPreviousPolicyExpiryDate(),
                vehicle.getNoClaimBonusPercentage(),
                vehicle.getCustomer().getName(),
                vehicle.getDocumentPath()
        );
    }

    public Vehicle updateVehicleFromDTO(Vehicle vehicle, VehicleUpdateReqDTO dto) {
        if(dto.registrationNumber() != null)
            vehicle.setRegistrationNumber(dto.registrationNumber());

        if(dto.chassisNumber() != null)
            vehicle.setChassisNumber(dto.chassisNumber());

        if(dto.engineNumber() != null)
            vehicle.setEngineNumber(dto.engineNumber());

        if(dto.category() != null)
            vehicle.setCategory(dto.category());

        if(dto.manufacturer() != null)
            vehicle.setManufacturer(dto.manufacturer());

        if(dto.model() != null)
            vehicle.setModel(dto.model());

        if(dto.variant() != null)
            vehicle.setVariant(dto.variant());

        if(dto.manufactureYear() != null)
            vehicle.setManufactureYear(dto.manufactureYear());

        if(dto.registrationDate() != null)
            vehicle.setRegistrationDate(dto.registrationDate());

        if(dto.fuelType() != null)
            vehicle.setFuelType(dto.fuelType());

        if(dto.engineCapacityCc() != null)
            vehicle.setEngineCapacityCc(dto.engineCapacityCc());

        if(dto.seatingCapacity() != null)
            vehicle.setSeatingCapacity(dto.seatingCapacity());

        if(dto.usage() != null)
            vehicle.setVehicleUsage(dto.usage());

        if(dto.exShowroomPrice() != null)
            vehicle.setExShowroomPrice(dto.exShowroomPrice());

        if(dto.currentIdv() != null)
            vehicle.setCurrentIdv(dto.currentIdv());

        if(dto.ownerCount() != null)
            vehicle.setOwnerCount(dto.ownerCount());

        if(dto.condition() != null)
            vehicle.setVehicleCondition(dto.condition());

        if(dto.currentOdometerKm() != null)
            vehicle.setCurrentOdometerKm(dto.currentOdometerKm());

        if(dto.modifiedVehicle() != null)
            vehicle.setModifiedVehicle(dto.modifiedVehicle());

        if(dto.accidentHistory() != null)
            vehicle.setAccidentHistory(dto.accidentHistory());

        if(dto.accidentCount() != null)
            vehicle.setAccidentCount(dto.accidentCount());

        if(dto.previousInsurer() != null)
            vehicle.setPreviousInsurer(dto.previousInsurer());

        if(dto.previousPolicyNumber() != null)
            vehicle.setPreviousPolicyNumber(dto.previousPolicyNumber());

        if(dto.previousPolicyExpiryDate() != null)
            vehicle.setPreviousPolicyExpiryDate(dto.previousPolicyExpiryDate());

        if(dto.noClaimBonusPercentage() != null)
            vehicle.setNoClaimBonusPercentage(dto.noClaimBonusPercentage());

        return vehicle;
    }

    public VehicleListResDTO entityToDTOV2(Vehicle vehicle) {
        return new VehicleListResDTO(
                vehicle.getId(),
                vehicle.getCategory(),
                vehicle.getRegistrationNumber(),
                vehicle.getChassisNumber(),
                vehicle.getEngineNumber(),
                vehicle.getManufacturer(),
                vehicle.getModel(),
                vehicle.getVariant(),
                vehicle.getManufactureYear(),
                vehicle.getRegistrationDate(),
                vehicle.getFuelType(),
                vehicle.getEngineCapacityCc(),
                vehicle.getSeatingCapacity(),
                vehicle.getVehicleUsage(),
                vehicle.getExShowroomPrice(),
                vehicle.getCurrentIdv(),
                vehicle.getDocumentPath(),
                vehicle.getOwnerCount(),
                vehicle.getVehicleCondition(),
                vehicle.getCurrentOdometerKm(),
                vehicle.getModifiedVehicle(),
                vehicle.getAccidentHistory(),
                vehicle.getAccidentCount(),
                vehicle.getPreviousInsurer(),
                vehicle.getPreviousPolicyNumber(),
                vehicle.getPreviousPolicyExpiryDate(),
                vehicle.getNoClaimBonusPercentage(),
                vehicle.getCreatedDate(),
                vehicle.getUpdatedDate()
        );
    }
}
