package com.capestone.service;

import com.capestone.dto.CustomerDocumentDTO;
import com.capestone.dto.DocumentResDTO;
import com.capestone.dto.VehicleDocumentDTO;
import com.capestone.enums.DocumentType;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.model.*;
import com.capestone.repository.DocumentRepository;
import com.capestone.repository.VehicleRepository;
import com.capestone.util.FileUtil;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final DocumentRepository documentRepository;
    private final UserService userService;
    private final VehicleRepository vehicleRepository;
    private final FileUtil fileUtil;


    private Document saveFile(MultipartFile file, String folderName) throws IOException {
        fileUtil.validateFile(file);
        Path folder = Paths.get(uploadDir, folderName);
        Files.createDirectories(folder);
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = folder.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        Document document = new Document();
        document.setOriginalFileName(file.getOriginalFilename());
        document.setDocumentPath(folderName + "/" + fileName);
        return document;
    }


    public DocumentResDTO uploadCustomerDocument(MultipartFile file, DocumentType documentType, String username) throws IOException {

        User user = userService.findByUsername(username);

        String folderName = username + "/documents";
        Document document = saveFile(file, folderName);
        document.setUser(user);
        document.setDocumentType(documentType);
        document = documentRepository.save(document);
        return new DocumentResDTO(document.getId(),
                                    document.getOriginalFileName(),
                                    document.getDocumentPath(),
                                    document.getDocumentType()
                                    );
    }


    public DocumentResDTO uploadVehicleDocument(MultipartFile file, DocumentType documentType, int vehicleId) throws IOException {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                                            .orElseThrow(()->new ResourceNotFoundException("No vehicle found"));
        String folderName = "vehicles/" + vehicleId;
        Document document = saveFile(file, folderName);
        document.setVehicle(vehicle);
        document.setDocumentType(documentType);
        document = documentRepository.save(document);
        return new DocumentResDTO(
                document.getId(),
                document.getOriginalFileName(),
                document.getDocumentPath(),
                document.getDocumentType()
        );
    }

    public DocumentResDTO uploadProposalDocument(String username, MultipartFile file, DocumentType documentType) throws IOException {


        String folderName = "customers/" + username + "/documents";
        Document document = saveFile(file, folderName);
        document.setDocumentType(documentType);
        document = documentRepository.save(document);
        return new DocumentResDTO(
                document.getId(),
                document.getOriginalFileName(),
                document.getDocumentPath(),
                document.getDocumentType()
        );
    }

    public List<Document> findAllById(List<Integer> documentIds) {
        return documentRepository.findAllById(documentIds);
    }

    public ResponseEntity<Resource> viewDocument(int documentId) throws IOException {

        Document document = documentRepository.findById(documentId)
                                        .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        Path filePath = Paths.get(uploadDir, document.getDocumentPath());

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new ResourceNotFoundException(
                    "Physical file not found"
            );
        }

        String contentType = Files.probeContentType(filePath);

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                document.getOriginalFileName() +
                                "\"")
                .body(resource);
    }

    public List<CustomerDocumentDTO> findByUserId(String username) {
        User user = userService.findByUsername(username);
        List<Document> documents = documentRepository.findByUserId(user.getId());

        return documents.stream().
                map(dto-> new CustomerDocumentDTO(dto.getId(),
                                                            dto.getDocumentType(),
                                                            dto.getOriginalFileName()))
                .toList();
    }

    public List<VehicleDocumentDTO> getVehicleDocuments(int id) {
        List<Document> documents = documentRepository.findByVehicleId(id);

        return documents.stream().map(dto->new VehicleDocumentDTO(dto.getId(),
                                                                            dto.getDocumentType(),
                                                                            dto.getOriginalFileName()))
                                                    .toList();
    }

    public void saveAll(List<Document> documents) {
        documentRepository.saveAll(documents);
    }
}
