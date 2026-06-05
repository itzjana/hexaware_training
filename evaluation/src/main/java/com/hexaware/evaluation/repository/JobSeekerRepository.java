package com.hexaware.evaluation.repository;

import com.hexaware.evaluation.model.JobSeeker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker,Integer> {

    JobSeeker findByUserUsername(String name);
}
