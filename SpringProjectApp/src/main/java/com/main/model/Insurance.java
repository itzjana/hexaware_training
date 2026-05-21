package com.main.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Insurance {
    //DI method 1: @Autowired
    private BikeInsurance bikeInsurance;
    //@Autowired
    private CarInsurance carInsurance;
    //Met6hod 2: Constructor
    public Insurance(BikeInsurance bikeInsurance, CarInsurance carInsurance) {
        this.bikeInsurance = bikeInsurance;
        this.carInsurance = carInsurance;
    }
    // Method 3 setter
//    @Autowired
//    public void setBikeInsurance(BikeInsurance bikeInsurance) {
//        this.bikeInsurance = bikeInsurance;
//    }
//    @Autowired
//    public void setCarInsurance(CarInsurance carInsurance) {
//        this.carInsurance = carInsurance;
//    }

    public void details(){
        System.out.println("Insurance details ");
        carInsurance.detail();
        bikeInsurance.detail();
    }
}
