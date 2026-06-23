package com.capestone.service;

import com.capestone.dto.*;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.VehicleMapper;
import com.capestone.model.Customer;
import com.capestone.model.Vehicle;
import com.capestone.repository.VehicleRepository;
import com.capestone.util.FileUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RequiredArgsConstructor
@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerService customerService;
    private final VehicleMapper vehicleMapper;
    private final DocumentService documentService;
    private final FileUtil fileUtil;

    @Value("${file.upload.location}")
    private String UPLOAD_LOC;


    public void addVehicle(@Valid VehicleReqDTO vehicleReqDTO, MultipartFile file, String username) throws IOException {
        Customer customer = customerService.getCustomer(username);
        Vehicle vehicle = vehicleMapper.dTOToEntity(customer,vehicleReqDTO);
        fileUtil.validateFile(file);
        String filename = file.getOriginalFilename();
        //This were it gonna be saved
        Path uploadPath = Paths.get(UPLOAD_LOC);
        Path destinationPath =  uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
        vehicle.setDocumentPath(filename);
        vehicleRepository.save(vehicle);
    }

    public List<VehicleListResDTO> getVehicleByCustomer(String username) {
        Customer customer = customerService.getCustomer(username);
        List<Vehicle> vehicles = vehicleRepository.findAllByCustomer(customer);
        return vehicles.stream().map(vehicleMapper::entityToDTOV2).toList();
    }

    public VehicleResDTO getVehicleById(String username, int id) {

        Customer customer = customerService.getCustomer(username);
        Vehicle vehicle = vehicleRepository.findByIdAndCustomer(id, customer)
                            .orElseThrow(() ->new ResourceNotFoundException("Vehicle not found"));
        List<VehicleDocumentDTO> documents = documentService.getVehicleDocuments(vehicle.getId());
        return vehicleMapper.entityToDTO(vehicle, documents);
    }

    public void deleteVehicleById(String name, int id) {
        Customer customer = customerService.getCustomer(name);
        Vehicle vehicle = vehicleRepository.findByIdAndCustomer(id, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }

    //creating proposal
    public Vehicle getVehicle(int id) {
        return vehicleRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Vehicle not found"));
    }

    public VehicleResDTO updateVehicle(String username, int id, VehicleUpdateReqDTO dto,MultipartFile file) throws IOException {
        Customer customer = customerService.getCustomer(username);
        Vehicle vehicle = vehicleRepository.findByIdAndCustomer(id, customer)
                                            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicle = vehicleMapper.updateVehicleFromDTO(vehicle, dto);

        if (file != null && !file.isEmpty()) {
            fileUtil.validateFile(file);
            String filename = file.getOriginalFilename();
            //This were it gonna be saved
            Path uploadPath = Paths.get(UPLOAD_LOC);
            Path destinationPath =  uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            vehicle.setDocumentPath(filename);
        }
        vehicle = vehicleRepository.save(vehicle);

        List<VehicleDocumentDTO> documents = documentService.getVehicleDocuments(vehicle.getId());

        return vehicleMapper.entityToDTO(vehicle, documents);
    }
}
