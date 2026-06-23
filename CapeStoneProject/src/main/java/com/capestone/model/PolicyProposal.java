package com.capestone.model;

import com.capestone.enums.PolicyStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;


@Entity
@Getter
@Setter
public class PolicyProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    private String officerRemark;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private InsurancePolicy policy;

    @ElementCollection
    @CollectionTable(
            name = "proposal_documents",
            joinColumns = @JoinColumn(name = "proposal_id")
    )
    private List<String> documentPaths;

    @ManyToOne
    private Officer officer;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant submittedAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
