package com.model;

import com.enums.ProposalStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
public class PolicyProposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status;

    @Column(nullable = false)
    private LocalDate submissionDate;


    private String officerRemark;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(nullable = false)
    private InsurancePolicy policy;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Vehicle vehicle;

    @ManyToMany
    private Set<PolicyAddOn> selectedAddOns;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getOfficerRemark() {
        return officerRemark;
    }

    public void setOfficerRemark(String officerRemark) {
        this.officerRemark = officerRemark;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public InsurancePolicy getPolicy() {
        return policy;
    }

    public void setPolicy(InsurancePolicy policy) {
        this.policy = policy;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Set<PolicyAddOn> getSelectedAddOns() {
        return selectedAddOns;
    }

    public void setSelectedAddOns(Set<PolicyAddOn> selectedAddOns) {
        this.selectedAddOns = selectedAddOns;
    }

    @Override
    public String toString() {
        return "PolicyProposal{" +
                "id=" + id +
                ", status=" + status +
                ", submissionDate=" + submissionDate +
                ", officerRemark='" + officerRemark + '\'' +
                ", customer=" + customer +
                ", policy=" + policy +
                ", vehicle=" + vehicle +
                ", selectedAddOns=" + selectedAddOns +
                '}';
    }
}
