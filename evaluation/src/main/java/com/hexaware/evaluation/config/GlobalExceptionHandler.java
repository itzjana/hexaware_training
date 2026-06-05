package com.hexaware.evaluation.config;

import com.hexaware.evaluation.exception.ResourceNotFoundException;
import com.hexaware.evaluation.util.ResponseUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> dataIntegrityViolationExceptionHandler(MethodArgumentNotValidException e){
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> errors = bindingResult.getFieldErrors();
        Map<String,String> map = new HashMap<>();
        errors.forEach( error -> map.put(error.getField(),error.getDefaultMessage()) );

        return ResponseEntity.badRequest().body(map);
    }
}
