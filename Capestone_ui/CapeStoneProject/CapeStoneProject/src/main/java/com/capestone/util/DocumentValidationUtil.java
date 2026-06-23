package com.capestone.util;

import com.capestone.enums.DocumentType;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.model.Customer;
import com.capestone.model.User;
import com.capestone.model.Vehicle;
import com.capestone.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocumentValidationUtil {

    private final DocumentRepository documentRepository;

    public void validateCustomerDocuments(Customer customer) {

        User user = customer.getUser();

        boolean hasAadhaar = documentRepository.existsByUserIdAndDocumentType(user.getId(), DocumentType.AADHAAR);

        boolean hasPan = documentRepository.existsByUserIdAndDocumentType(user.getId(), DocumentType.PAN);

        boolean hasDrivingLicense = documentRepository.existsByUserIdAndDocumentType(user.getId(), DocumentType.DRIVING_LICENSE);

        if (!hasAadhaar || !hasPan || !hasDrivingLicense)
            throw new ResourceNotFoundException("Please upload Aadhaar, PAN and Driving License before creating a proposal");
    }

    public void validateVehicleDocuments(Vehicle vehicle) {

        boolean hasRc = documentRepository.existsByVehicleIdAndDocumentType(vehicle.getId(), DocumentType.RC_BOOK);

        boolean hasPuc =
                documentRepository.existsByVehicleIdAndDocumentType(vehicle.getId(), DocumentType.POLLUTION_CERTIFICATE);

        if (!hasRc)
            throw new ResourceNotFoundException("RC Book is required");


        if (!hasPuc) {
            throw new ResourceNotFoundException(
                    "Pollution Certificate is required"
            );
        }
    }
}