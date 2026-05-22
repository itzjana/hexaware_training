package com.app.model;

import jakarta.persistence.*;

@Entity
public class InsurancePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String policyName;

    private String description;

    @Column(nullable = false)
    private int baseRate;

    @ManyToOne
    private Officer officer;

    public Officer getOfficer() {
        return officer;
    }

    public void setOfficer(Officer officer) {
        this.officer = officer;
    }

    public InsurancePolicy() {
    }

    public InsurancePolicy(String policyName, String description, int baseRate) {
        this.policyName = policyName;
        this.description = description;
        this.baseRate = baseRate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getBaseRate() {
        return baseRate;
    }

    public void setBaseRate(int baseRate) {
        this.baseRate = baseRate;
    }

    @Override
    public String toString() {
        return "InsurancePolicy{" +
                "id=" + id +
                ", policyName='" + policyName + '\'' +
                ", description='" + description + '\'' +
                ", baseRate=" + baseRate +
                ", officer=" + officer +
                '}';
    }
}
