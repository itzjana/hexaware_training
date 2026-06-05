package com.hexaware.evaluation.repository;

import com.hexaware.evaluation.model.Application;
import com.hexaware.evaluation.model.JobSeeker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Integer> {
    Page<Application> findByJobSeeker(JobSeeker jobSeeker, Pageable pageable);
}
