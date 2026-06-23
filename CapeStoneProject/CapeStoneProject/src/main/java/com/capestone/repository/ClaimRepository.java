package com.capestone.repository;

import com.capestone.enums.ClaimStatus;
import com.capestone.model.Claim;
import com.capestone.model.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim,Integer> {

    List<Claim> findAllByStatus(ClaimStatus claimStatus);

    @Query("select c from Claim c where c.policyProposal.customer.user.username=?1")
    List<Claim> getByCustomer(String name);

    @Query("select c from Claim c where c.officer.user.username=?1")
    List<Claim> getByOfficer(String name);

    @Query(" select count(c) from Claim c where c.officer=:officer ")
    int countByOfficer(Officer officer);

    long countByStatus(ClaimStatus status);
}
