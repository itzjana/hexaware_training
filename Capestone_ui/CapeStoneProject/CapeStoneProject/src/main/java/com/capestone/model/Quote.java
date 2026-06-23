package com.capestone.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Getter
@Setter
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private BigDecimal calculatedAmount;

    @OneToOne
    private PolicyProposal policyProposal;

    @ManyToOne
    private Officer officer;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant generatedAt;
}
