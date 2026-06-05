package com.hexaware.evaluation.controller;

import com.hexaware.evaluation.dto.BookReqDTO;
import com.hexaware.evaluation.service.BookService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/book")
@AllArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping("/add/{id}")
    public void addBook(@PathVariable int id , @Valid @RequestBody BookReqDTO bookReqDTO){
        bookService.addBook(id,bookReqDTO);
    }
}
