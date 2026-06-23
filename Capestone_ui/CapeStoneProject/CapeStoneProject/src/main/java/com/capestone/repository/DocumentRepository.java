package com.capestone.repository;

import com.capestone.enums.DocumentType;
import com.capestone.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    List<Document> findByUserId(Integer userId);

    List<Document> findByVehicleId(Integer vehicleId);

    List<Document> findByPolicyProposalId(Integer proposalId);

    List<Document> findByClaimId(Integer claimId);

    boolean existsByUserIdAndDocumentType(Integer userId, DocumentType documentType);

    boolean existsByVehicleIdAndDocumentType(Integer vehicleId, DocumentType documentType);

    Optional<Document> findByUserIdAndDocumentType(Integer userId, DocumentType documentType);
}
