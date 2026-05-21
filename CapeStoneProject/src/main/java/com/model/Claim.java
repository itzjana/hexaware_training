package com.model;

import com.enums.ClaimStatus;
import jakarta.persistence.*;

@Entity
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String incidentDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    @ManyToOne
    private PolicyProposal proposal;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIncidentDescription() {
        return incidentDescription;
    }

    public void setIncidentDescription(String incidentDescription) {
        this.incidentDescription = incidentDescription;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public PolicyProposal getProposal() {
        return proposal;
    }

    public void setProposal(PolicyProposal proposal) {
        this.proposal = proposal;
    }

    @Override
    public String toString() {
        return "Claim{" +
                "id=" + id +
                ", incidentDescription='" + incidentDescription + '\'' +
                ", status=" + status +
                ", proposal=" + proposal +
                '}';
    }
}
