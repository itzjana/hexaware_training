package com.capestone.controller;


import com.capestone.dto.EnumResDTO;
import com.capestone.service.EnumService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class EnumController {

    private final EnumService enumService;

    @GetMapping("/api/enums")
    public EnumResDTO getEnums(){
        return enumService.getEnums();
    }

}
