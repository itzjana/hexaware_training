package com.capestone.controller;


import com.capestone.dto.EnumResDTO;
import com.capestone.dto.EnumV2ResDTO;
import com.capestone.service.EnumService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/")
public class EnumController {

    private final EnumService enumService;

    @GetMapping("/enums")
    public EnumResDTO getEnums(){
        return enumService.getEnums();
    }

    @GetMapping("/v2/enums")
    public EnumV2ResDTO getEnumsV2(){
        return enumService.getEnumsV2();
    }

}
