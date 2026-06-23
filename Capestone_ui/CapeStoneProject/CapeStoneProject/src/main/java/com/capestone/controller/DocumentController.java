package com.capestone.controller;

import com.capestone.dto.CustomerDocumentDTO;
import com.capestone.dto.DocumentResDTO;
import com.capestone.dto.VehicleDocumentDTO;
import com.capestone.enums.DocumentType;
import com.capestone.service.DocumentService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@AllArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/customer/upload")
    public DocumentResDTO uploadCustomerDocument(@RequestParam MultipartFile file,
                                                 @RequestParam DocumentType documentType,
                                                 Principal principal) throws IOException {

        return documentService.uploadCustomerDocument(
                file,
                documentType,
                principal.getName()
        );
    }

    @GetMapping("/customer")
    public List<CustomerDocumentDTO> getCustomerDocuments(Principal principal) {
        return documentService.findByUserId(principal.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> viewDocument(@PathVariable int id) throws IOException {
        return documentService.viewDocument(id);
    }

    @PostMapping("/vehicle/{vehicleId}/upload")
    public DocumentResDTO uploadVehicleDocument(@PathVariable int vehicleId,
                                                @RequestParam MultipartFile file,
                                                @RequestParam DocumentType documentType) throws IOException {
        return documentService.uploadVehicleDocument(
                file,
                documentType,
                vehicleId
        );
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<VehicleDocumentDTO> getVehicleDocuments(@PathVariable int vehicleId) {
        return documentService.getVehicleDocuments(vehicleId);
    }

    @PostMapping("/upload")
    public DocumentResDTO uploadDocument(Principal principal,
                                                 @RequestParam("file") MultipartFile file,
                                                 @RequestParam("documentType") DocumentType documentType) throws IOException {
        return documentService.uploadProposalDocument(principal.getName(), file, documentType);
    }


}
