package com.capestone.controller;

import com.capestone.dto.QuoteReqDTO;
import com.capestone.dto.QuoteResDTO;
import com.capestone.service.QuoteService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/quote")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QuoteController {

    private final QuoteService quoteService;

    @PostMapping("/create")
    public void generateQuote(Principal principal,@Valid @RequestBody QuoteReqDTO dto) {
        quoteService.generateQuote(principal.getName(), dto);
    }

    @GetMapping("/customer")
    public List<QuoteResDTO> getMyQuotes(Principal principal) {
        return quoteService.getMyQuotes(principal.getName());
    }


    @GetMapping("/{proposalid}")
    public QuoteResDTO getQuoteById(@PathVariable int proposalid){
        return quoteService.getQuoteById(proposalid);
    }
}
