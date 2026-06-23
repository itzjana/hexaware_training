package com.capestone.repository;

import com.capestone.model.PolicyProposal;
import com.capestone.model.PolicyProposalAddOn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyProposalAddOnRepository extends JpaRepository<PolicyProposalAddOn,Integer> {
    List<PolicyProposalAddOn> findAllByPolicyProposal(PolicyProposal policyProposal);
}