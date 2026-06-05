package com.hexaware.evaluation.service;

import com.hexaware.evaluation.dto.BookReqDTO;
import com.hexaware.evaluation.model.Author;
import com.hexaware.evaluation.model.BookEntity;
import com.hexaware.evaluation.repository.BookRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorService authorService;

    public void addBook(int id, @Valid BookReqDTO bookReqDTO) {

        //fetch author by id
        Author author = authorService.getAuthor(id);
        //prepare book
        BookEntity bookEntity = new BookEntity();
        bookEntity.setAuthor(author);
        bookEntity.setTitle(bookReqDTO.title());
        bookEntity.setSummary(bookReqDTO.summary());

        bookRepository.save(bookEntity);

    }
}
