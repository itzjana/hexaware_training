package com.capestone.repository;

import com.capestone.enums.FuelType;
import com.capestone.enums.VehicleCategory;
import com.capestone.enums.VehicleUsage;
import com.capestone.model.Customer;
import com.capestone.model.InsurancePolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy , Integer> {


    List<InsurancePolicy> findByVehicleCategoryAndVehicleUsageAndFuelTypeAndActiveTrue(
            VehicleCategory vehicleCategory,
            VehicleUsage vehicleUsage,
            FuelType fuelType
    );

    @Query("""
           select p FROM InsurancePolicy p
           join Vehicle v on v.category = p.vehicleCategory
           and v.vehicleUsage = p.vehicleUsage
           and v.fuelType = p.fuelType
           where v.customer =?1 and p.active = true""")
    List<InsurancePolicy> findSuggestedPoliciesByCustomer(Customer customer);

    Page<InsurancePolicy> findAllByActiveTrue(Pageable pageable);
}

