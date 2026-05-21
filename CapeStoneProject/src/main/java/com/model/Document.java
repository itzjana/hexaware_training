package com.model;

import com.enums.DocumentType;
import com.enums.VerificationStatus;
import jakarta.persistence.*;

@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String documentPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @ManyToOne
    private Claim claim;

    @ManyToOne
    private PolicyProposal policyProposal;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDocumentPath() {
        return documentPath;
    }

    public void setDocumentPath(String documentPath) {
        this.documentPath = documentPath;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Claim getClaim() {
        return claim;
    }

    public void setClaim(Claim claim) {
        this.claim = claim;
    }

    public PolicyProposal getPolicyProposal() {
        return policyProposal;
    }

    public void setPolicyProposal(PolicyProposal policyProposal) {
        this.policyProposal = policyProposal;
    }

    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", documentPath='" + documentPath + '\'' +
                ", documentType=" + documentType +
                ", verificationStatus=" + verificationStatus +
                ", claim=" + claim +
                ", policyProposal=" + policyProposal +
                '}';
    }
}
