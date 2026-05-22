package com.app;

import com.app.config.AppConfig;
import com.app.dao.AuthDAO;
import com.app.dao.InsuranceDAO;
import com.app.dao_impl.AuthDAOImpl;
import com.app.exception.ResourceNotFoundException;
import com.app.model.InsurancePolicy;
import com.app.model.User;
import jakarta.persistence.NoResultException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.List;
import java.util.Scanner;

public class AppMain {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context =
                                        new AnnotationConfigApplicationContext(AppConfig.class);
        AuthDAO authDAO = context.getBean(AuthDAOImpl.class);
        InsuranceDAO insuranceDAO = context.getBean(InsuranceDAO.class);
        Scanner sc = new Scanner(System.in);
        try{
        System.out.println("Enter username");
        String username = sc.nextLine();
        System.out.println("Enter password");
        String password =sc.nextLine();
        User user = authDAO.login(username,password);
        switch (user.getRole().toString()){
            case "CUSTOMER":
                System.out.println("Hello Customer -----Customer Menu----");
                break;
            case "ADMIN":
                System.out.println("Hello Admin -----Admin Menu----");
                while (true) {
                    System.out.println("1. Add Insurance");
                    System.out.println("2. Fetch all Insurance");
                    System.out.println("3. Delete by Insurance ID");
                    System.out.println("4. Update Insurance");
                    System.out.println("5. Fetch Insurance by ID");
                    System.out.println("0. Exit ");
                    int op = sc.nextInt();
                    sc.nextLine();
                    if (op == 0)
                        break;
                    switch (op) {
                        case 1:
                            System.out.println("Enter Policy Name");
                            String name = sc.nextLine();
                            System.out.println("Enter Policy Description");
                            String description = sc.nextLine();
                            System.out.println("Enter base amount");
                            int price = sc.nextInt();
                            InsurancePolicy insurancePolicy = new InsurancePolicy(name,description,price);
                            insuranceDAO.addInsurance(insurancePolicy,user);
                            break;
                        case 2:
                            try {
                                List<InsurancePolicy> list = insuranceDAO.getAll();
                                System.out.println("All Insurance");
                                list.forEach(System.out::println);
                            }catch (ResourceNotFoundException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 3:
                            try {
                                System.out.println("Enter id to delete");
                                int id = sc.nextInt();
                                insuranceDAO.deleteById(id);
                                System.out.println("Insurance Deleted");
                            }catch (ResourceNotFoundException | NoResultException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 4:
                            try{
                                System.out.println("Enter id to update");
                                int id = sc.nextInt();
                                InsurancePolicy insurance = insuranceDAO.getById(id);
                                System.out.println("Existing Insurace details"+insurance);
                                System.out.println("Enter Updated Insurance Policy Name");
                                sc.nextLine();
                                String insuranceName = sc.nextLine();
                                if(!insuranceName.trim().isEmpty())
                                    insurance.setPolicyName(insuranceName);
                                System.out.println("Enter updated Description");
                                String des = sc.nextLine();
                                if(!des.trim().isEmpty())
                                    insurance.setDescription(des);
                                System.out.println("Enter updated Base Price");
                                String basePriceInput = sc.nextLine();
                                if (!basePriceInput.trim().isEmpty()) {
                                    insurance.setBaseRate(Integer.parseInt(basePriceInput));
                                }

                                insuranceDAO.update(insurance);


                            }catch (NoResultException e){
                                System.err.println(e.getMessage());
                            }
                            break;
                        case 5:
                            try {
                                System.out.println("Enter id to fetch");
                                int id = sc.nextInt();
                                System.out.println(insuranceDAO.getById(id));
                            }catch (ResourceNotFoundException | NoResultException e){
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
                System.out.println("Hello Officer -----Officer menu----");
                break;
        }}catch (NoResultException e){
            System.err.println(e.getMessage());
        }
        context.close();
        sc.close();
    }
}
