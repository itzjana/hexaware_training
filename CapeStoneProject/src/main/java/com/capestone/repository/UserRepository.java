package com.capestone.repository;

import com.capestone.model.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User ,Integer> {
    Optional<User> findByUsername(String username);

    Optional<User>  findByEmail(String email);
}
