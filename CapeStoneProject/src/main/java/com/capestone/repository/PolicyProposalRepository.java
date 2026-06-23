package com.capestone.repository;

import com.capestone.dto.AdminPieStat;
import com.capestone.enums.PolicyStatus;
import com.capestone.model.Customer;
import com.capestone.model.Officer;
import com.capestone.model.PolicyProposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyProposalRepository extends JpaRepository<PolicyProposal, Integer> {

    List<PolicyProposal> findByStatus(PolicyStatus policyStatus);

    List<PolicyProposal> findByCustomer(Customer customer);

    List<PolicyProposal> findByOfficer(Officer officer);

    @Query("SELECT COUNT(p) FROM PolicyProposal p GROUP BY p.status")
    long countByStatus1(PolicyStatus status);

    @Query("SELECT p FROM PolicyProposal p WHERE p.status = :status")
    Page<PolicyProposal> findByStatus(PolicyStatus status, Pageable pageable);

    @Query("SELECT new com.capestone.dto.AdminPieStat(p.status, COUNT(p)) FROM PolicyProposal p GROUP BY p.status")
    List<AdminPieStat> countByStatus();


    @Query(" select count(p) from PolicyProposal p where p.officer=:officer ")
    int countByOfficer(Officer officer);
}