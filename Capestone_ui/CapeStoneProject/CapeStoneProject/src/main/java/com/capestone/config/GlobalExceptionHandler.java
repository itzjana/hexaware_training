package com.capestone.config;

import com.capestone.exception.FileInvalidExtensionException;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.exception.UsernameExistsException;
import com.capestone.util.ResponseUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
@AllArgsConstructor
public class GlobalExceptionHandler {
    private ResponseUtil responseUtil;

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseUtil> resourceNotFoundExceptionHandler(ResourceNotFoundException e){
        responseUtil.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(responseUtil);
    }

    @ExceptionHandler(UsernameExistsException.class)
    public ResponseEntity<ResponseUtil> usernameExistsExceptionHandler(UsernameExistsException e){
        responseUtil.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(responseUtil);
    }

    @ExceptionHandler(com.capestone.exception.FileInvalidExtensionException.class)
    public ResponseEntity<ResponseUtil> fileInvalidExtensionExceptionHandler(FileInvalidExtensionException e){
        return ResponseEntity.badRequest().body(new ResponseUtil(e.getMessage()));
    }

    @ExceptionHandler(java.io.FileNotFoundException.class)
    public ResponseEntity<ResponseUtil> fileNotFoundExceptionHandler(FileNotFoundException e){
        return ResponseEntity.badRequest().body(new ResponseUtil(e.getMessage()));
    }

    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<ResponseUtil> ioExceptionHandler(IOException e){
        return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseUtil("File access error: " + e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseUtil> runtimeExceptionHandler(RuntimeException e){
        return ResponseEntity.badRequest().body(new ResponseUtil(e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseUtil> generalExceptionHandler(Exception e){
        return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseUtil("An unexpected error occurred: " + e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> dataIntegrityViolationExceptionHandeler(MethodArgumentNotValidException e){
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> errors = bindingResult.getFieldErrors();
        Map<String,String> map = new HashMap<>();
        errors.forEach( error -> map.put(error.getField(),error.getDefaultMessage()) );

        return ResponseEntity.badRequest().body(map);
    }


}
