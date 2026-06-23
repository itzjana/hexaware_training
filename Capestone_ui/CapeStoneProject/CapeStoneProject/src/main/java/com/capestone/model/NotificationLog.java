package com.capestone.model;

import com.capestone.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    private String title;

    @Column(length = 1000)
    private String message;

    @CreationTimestamp
    private Instant createdAt;

    @ManyToOne
    private User user;
}
