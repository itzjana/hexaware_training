package com.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Quote {
    @Id
    private int id;

    @Column(nullable = false)
    private int calculatedAmount;

    @Column(nullable = false)
    private LocalDate expireDate;

    @OneToOne
    @JoinColumn(nullable = false)
    private PolicyProposal proposal;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCalculatedAmount() {
        return calculatedAmount;
    }

    public void setCalculatedAmount(int calculatedAmount) {
        this.calculatedAmount = calculatedAmount;
    }

    public LocalDate getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(LocalDate expireDate) {
        this.expireDate = expireDate;
    }

    public PolicyProposal getProposal() {
        return proposal;
    }

    public void setProposal(PolicyProposal proposal) {
        this.proposal = proposal;
    }

    @Override
    public String toString() {
        return "Quote{" +
                "id=" + id +
                ", calculatedAmount=" + calculatedAmount +
                ", expireDate=" + expireDate +
                ", proposal=" + proposal +
                '}';
    }
}
