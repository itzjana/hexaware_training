package com.capestone.repository;

import com.capestone.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Integer> {

    boolean existsByQuoteId(int quoteId);

}
