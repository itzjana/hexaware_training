package com.capestone.controller;

import com.capestone.dto.AddOnReqDTO;
import com.capestone.dto.AddOnSummaryDTO;
import com.capestone.dto.AddOnUpdatedDTO;
import com.capestone.service.AddOnService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addon")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class AddOnController {

    private final AddOnService addOnService;

    @GetMapping("/all")
    public List<AddOnSummaryDTO> getAll() {
        return addOnService.getAll();
    }

    //currently active
    @GetMapping("/v2/all")
    public List<AddOnSummaryDTO> getAllActive() {
        return addOnService.getAllActive();
    }

    @GetMapping("/by-id/{id}")
    public AddOnSummaryDTO getById(@PathVariable int id){
        return addOnService.getById(id);
    }

    @PostMapping("/insert")
    public void insert(@Valid @RequestBody AddOnReqDTO dto) {
        addOnService.insert(dto);
    }

    @PatchMapping("/update/{id}")
    public void update (@Valid @RequestBody AddOnUpdatedDTO updatedAddOn, @PathVariable int id) {
            addOnService.update(updatedAddOn, id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable int id){
        addOnService.delete(id);
    }
}
