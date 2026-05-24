package com.exception;

public class InvalidOwnershipException extends RuntimeException {
    public InvalidOwnershipException(String message) {
        super(message);
    }
}
