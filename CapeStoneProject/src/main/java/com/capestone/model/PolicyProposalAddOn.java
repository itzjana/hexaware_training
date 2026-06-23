package com.capestone.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PolicyProposalAddOn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private PolicyProposal policyProposal;

    @ManyToOne
    private PolicyAddOn policyAddOn;
}
