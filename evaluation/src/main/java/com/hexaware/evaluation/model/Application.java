package com.hexaware.evaluation.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private JobSeeker jobSeeker;

    @ManyToOne
    private Job job;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant appliedAt;

}
