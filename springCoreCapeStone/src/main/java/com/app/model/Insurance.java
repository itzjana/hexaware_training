package com.app.model;


import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;


public class Insurance {

    private int id;
    private String policyName;
    private String description;
    private int baseRate;

    public Insurance() {
    }

    public Insurance(int id, String policyName, String description, int baseRate) {
        this.id = id;
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
        return "Insurance{" +
                "id=" + id +
                ", policyName='" + policyName + '\'' +
                ", description='" + description + '\'' +
                ", baseRate=" + baseRate +
                '}';
    }
}
