package com.capestone.controller;

import com.capestone.dto.PaymentReqDTO;
import com.capestone.service.PaymentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor

@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/payment")
    public void makePayment(@Valid @RequestBody PaymentReqDTO dto) {
        paymentService.makePayment(dto);
    }
}
