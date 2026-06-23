package com.capestone.service;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class sampleServiceTest {

    @Test
    void sampleTest(){
        int a=1;
        int b=1;
        Assertions.assertEquals(2,(a+b));
    }
}
