package com.main.model;

import org.springframework.stereotype.Component;

@Component
public class CardPaymentMethod implements Payment{
    @Override
    public String process() {
        return "Card payemnt";
    }
}
