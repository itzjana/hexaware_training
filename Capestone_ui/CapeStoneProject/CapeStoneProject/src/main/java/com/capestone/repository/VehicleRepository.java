package com.capestone.repository;

import com.capestone.model.Customer;
import com.capestone.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle,Integer> {

    List<Vehicle> findAllByCustomer(Customer customer);

    Optional<Vehicle> findByIdAndCustomer(Integer id, Customer customer);
}
