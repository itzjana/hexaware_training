package com.capestone.model;

import com.capestone.enums.ClaimStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
public class Claim {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String incidentDescription;
    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    @ManyToOne
    private PolicyProposal policyProposal;

    private Long currentOdometerKm;

    private BigDecimal estimatedAmount;

    private BigDecimal offeredAmount;

    @ManyToOne
    private Officer officer;

    private String officerNote;

    @ElementCollection
    @CollectionTable(
            name = "claim_documents",
            joinColumns = @JoinColumn(name = "claim_id")
    )
    private List<String> documentPaths;

    @CreationTimestamp
    private Instant createdAt;
}
