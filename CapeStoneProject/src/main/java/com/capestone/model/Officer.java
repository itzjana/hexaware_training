package com.capestone.model;

import com.capestone.enums.JobTitle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Officer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Enumerated(EnumType.STRING)
    private JobTitle jobTitle;

    @OneToOne
    private User user;
}
