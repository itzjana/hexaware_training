package com.capestone.repository;

import com.capestone.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote,Integer> {


    List<Quote> findByPolicyProposalCustomerUserUsername(String username);

    Quote findByPolicyProposalId(int proposalid);
}
