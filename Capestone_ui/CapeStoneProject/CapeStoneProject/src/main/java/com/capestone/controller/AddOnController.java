package com.capestone.controller;

import com.capestone.dto.AddOnReqDTO;
import com.capestone.dto.AddOnUpdatedDTO;
import com.capestone.model.PolicyAddOn;
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
    public List<PolicyAddOn> getAll() {
        return addOnService.getAll();
    }

    @GetMapping("/by-id/{id}")
    public PolicyAddOn getById(@PathVariable int id){
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
