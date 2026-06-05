package com.hexaware.evaluation.model;

import com.hexaware.evaluation.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(unique = true, nullable = false)
        private String username;

        private String password;

        @Enumerated(EnumType.STRING)
        private Role role;

        @CreationTimestamp
        @Column(updatable = false)
        private Instant createdAt;

        @UpdateTimestamp
        private Instant updatedAt;

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                SimpleGrantedAuthority sga = new SimpleGrantedAuthority(role.toString());
                return List.of(sga);
        }
}
