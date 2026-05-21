package com.main.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(scopeName = "prototype")     //overrides the deafult singleton
public class UpiPyamentMethod implements Payment{
    @Override
    public String process() {
        return "Upi payment";
    }
}
