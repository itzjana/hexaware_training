package com.model;

import jakarta.persistence.*;

@Entity
public class UserReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 500)
    private String reviewContent;

    private Integer rating;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Customer customer;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getReviewContent() {
        return reviewContent;
    }

    public void setReviewContent(String reviewContent) {
        this.reviewContent = reviewContent;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @Override
    public String toString() {
        return "UserReview{" +
                "id=" + id +
                ", reviewContent='" + reviewContent + '\'' +
                ", rating=" + rating +
                ", customer=" + customer +
                '}';
    }
}
