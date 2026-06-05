package com.hexaware.evaluation.controller;

import com.hexaware.evaluation.dto.AuthorReqDTO;
import com.hexaware.evaluation.service.AuthorService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/author")
@AllArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @PostMapping("/add")
    public void addAuthor(@Valid @RequestBody AuthorReqDTO authorReqDTO){
        authorService.addAuthor(authorReqDTO);
    }

}
