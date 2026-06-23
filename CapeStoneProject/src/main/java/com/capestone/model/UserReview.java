package com.capestone.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserReview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(length = 500)
    private String reviewContent;

    private int rating;

    @ManyToOne
    private Customer customer;
}

