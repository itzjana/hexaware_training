package com.capestone.controller;

import com.capestone.dto.ReviewResDTO;
import com.capestone.model.ReviewReqDTO;
import com.capestone.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/review")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add")
    public void addReview(@RequestBody ReviewReqDTO dto , Principal principal){
        reviewService.addReview(dto,principal.getName());
    }

    @GetMapping("/all")
    public List<ReviewResDTO> getAll(){
        return reviewService.getAll();
    }
}
