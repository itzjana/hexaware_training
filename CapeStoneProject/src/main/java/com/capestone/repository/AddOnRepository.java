package com.capestone.repository;

import com.capestone.model.PolicyAddOn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddOnRepository extends JpaRepository<PolicyAddOn,Integer> {
}
