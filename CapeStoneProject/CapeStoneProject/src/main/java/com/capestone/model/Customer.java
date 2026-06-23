package com.capestone.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;

    private String address;

    private LocalDate dob;

    private String aadharNumber;

    private String panNumber;

    @OneToOne
    private User user;

}
