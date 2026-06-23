package com.capestone.repository;

import com.capestone.model.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfficerRepository extends JpaRepository<Officer,Integer> {

    Officer findByUserUsername(String username);

    Officer findByName(String name);
}
