package com.capestone.repository;


import com.capestone.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog,Integer> {

    List<NotificationLog> findAllByUserUsername(String name);
}
