package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.AuthorReqDTO;
import com.hexaware.evaluation.exception.ResourceNotFoundException;
import com.hexaware.evaluation.model.Author;
import com.hexaware.evaluation.repository.AuthorRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public void addAuthor(@Valid AuthorReqDTO authorReqDTO) {
        //prepare entity
        Author author = new Author();
        author.setName(authorReqDTO.name());
        author.setEmail(authorReqDTO.email());
        authorRepository.save(author);
    }

    public Author getAuthor(int id) {
        return authorRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No author found"));
    }
}
