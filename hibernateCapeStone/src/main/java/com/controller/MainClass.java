package com.controller;


import com.config.HibernateConfig;
import com.enums.VehicleType;
import com.exception.InvalidOwnershipException;
import com.exception.ResourceNotFoundException;
import com.model.Customer;
import com.model.User;
import com.model.Vehicle;
import com.service.CustomerService;
import com.service.UserService;
import com.service.VehicleService;
import org.hibernate.Session;

import java.util.List;
import java.util.Scanner;

public class MainClass {
    public static void main(String[] args) {
        Session session = HibernateConfig.getSessionFactory().openSession();
        Scanner sc = new Scanner(System.in);

        UserService userService = new UserService(session);
        VehicleService vehicleService = new VehicleService(session);

        System.out.println("enter your username");
        String username = sc.nextLine();
        System.out.println("Enter your password");
        String password = sc.nextLine();
        User user = userService.authenticateUser( username,password);
        switch (user.getRole().toString()){
            case "CUSTOMER":
                System.out.println("welcome customer "+user.getUsername());
                while (true){
                    System.out.println("1. Register your Vehicle");
                    System.out.println("2. Delete Vehicle");
                    System.out.println("3. Update Vehicle Details");
                    System.out.println("4. View by Vehicle Id");
                    System.out.println("5. View all vehicle");
                    System.out.println("0. Exit");
                    int op = sc.nextInt();
                    sc.nextLine();
                    if(op == 0)
                        break;
                    switch (op){
                        case 1:
                            System.out.println("Enter Vehicle type " +
                                    "    CAR,\n" +
                                    "    BIKE,\n" +
                                    "    TRUCK,\n" +
                                    "    MOTORCYCLE,\n" +
                                    "    CAMPER_VAN");
                            VehicleType vehicleType = VehicleType.valueOf(sc.nextLine().toUpperCase());
                            System.out.println("Enter Manufacture year");
                            int year = sc.nextInt();
                            sc.nextLine();
                            System.out.println("Enter Registration Number");
                            String registrationNumber = sc.nextLine();
                            Vehicle vehicle = new Vehicle(vehicleType,year,registrationNumber);
                            vehicleService.insert(vehicle,user);
                            System.out.println("Vehicle Registered");
                            break;
                        case 2:
                            try {
                                System.out.println("Enter vehicle id to delete");
                                int id = sc.nextInt();
                                vehicleService.delete(id,user);
                                System.out.println("Vehicle deleted");
                            }catch (InvalidOwnershipException | ResourceNotFoundException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 3:
                            try {
                                System.out.println("Enter vehicle id to update");
                                int id = sc.nextInt();
                                sc.nextLine();
                                vehicle = vehicleService.getbyId(id,user);
                                System.out.println("Enter registeration number");
                                registrationNumber = sc.nextLine();
                                vehicle.setRegistrationNumber(registrationNumber);
                                vehicleService.update(vehicle,id);
                                System.out.println("Vehicle updated");
                            }catch (InvalidOwnershipException | ResourceNotFoundException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 4:
                            try{
                                System.out.println("Enter vehicle id to view");
                                int id = sc.nextInt();
                                vehicle = vehicleService.getbyId(id,user);
                                System.out.println(vehicle);
                            }catch (InvalidOwnershipException | ResourceNotFoundException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 5:
                            try{
                                List<Vehicle> lsit = vehicleService.getAll(user);
                                System.out.println("All Incident");
                                lsit.forEach(System.out::println);
                            }catch (ResourceNotFoundException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        default:
                            System.out.println("Invalid option");
                            break;
                    }
                }
                break;
            case "INSURANCE_OFFICER":
                System.out.println("welcome officer "+user.getUsername());
                break;
            case "ADMIN":
                System.out.println("welcome admin "+user.getUsername());
                break;
        }
        sc.close();
        session.close();
    }
}
