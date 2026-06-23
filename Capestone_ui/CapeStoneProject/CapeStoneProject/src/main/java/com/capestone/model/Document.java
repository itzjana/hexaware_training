package com.capestone.model;


import com.capestone.enums.DocumentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String originalFileName;//

    private String documentPath;//

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;//

    private LocalDate expiryDate; // driving license,rc book even insurance expire

    @ManyToOne
    private User user; //

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private PolicyProposal policyProposal;

    @ManyToOne
    private Claim claim;
}
