package com.model;

import jakarta.persistence.*;

@Entity
public class PolicyAddOn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "add_on_name", nullable = false)
    private String addOnName;

    @Column(name = "additional_cost", nullable = false)
    private int additionalCost;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAddOnName() {
        return addOnName;
    }

    public void setAddOnName(String addOnName) {
        this.addOnName = addOnName;
    }

    public int getAdditionalCost() {
        return additionalCost;
    }

    public void setAdditionalCost(int additionalCost) {
        this.additionalCost = additionalCost;
    }

    @Override
    public String toString() {
        return "PolicyAddOn{" +
                "id=" + id +
                ", addOnName='" + addOnName + '\'' +
                ", additionalCost=" + additionalCost +
                '}';
    }
}
