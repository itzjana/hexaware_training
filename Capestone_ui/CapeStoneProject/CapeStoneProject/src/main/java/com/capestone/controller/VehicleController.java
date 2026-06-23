package com.capestone.controller;


import com.capestone.dto.VehicleListResDTO;
import com.capestone.dto.VehicleReqDTO;
import com.capestone.dto.VehicleResDTO;
import com.capestone.dto.VehicleUpdateReqDTO;
import com.capestone.service.VehicleService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping(value = "/add",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addVehicle(@Valid @RequestPart("vehicle") VehicleReqDTO vehicleReqDTO,@RequestPart("file") MultipartFile file, Principal principal) throws IOException {
        vehicleService.addVehicle(vehicleReqDTO,file, principal.getName());
    }

    @GetMapping("/getbycustomer")
    public List<VehicleListResDTO> getVehicleByCustomer(Principal principal){
       return vehicleService.getVehicleByCustomer(principal.getName());
    }

    @GetMapping("/getbyid/{id}")
    public VehicleResDTO getVehicleById(Principal principal,@PathVariable int id){
        return vehicleService.getVehicleById(principal.getName(),id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteVehicleById(Principal principal,@PathVariable int id){
        vehicleService.deleteVehicleById(principal.getName(),id);
    }

    @PatchMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VehicleResDTO updateVehicle(Principal principal, @PathVariable int id, @Valid @RequestPart("vehicle") VehicleUpdateReqDTO dto,@RequestPart(value = "file",required = false) MultipartFile file) throws IOException {
        return vehicleService.updateVehicle(principal.getName(), id, dto,file);
    }

}
