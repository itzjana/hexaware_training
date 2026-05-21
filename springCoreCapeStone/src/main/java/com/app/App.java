package com.app;

import com.app.config.AppConfig;
import com.app.dao.InsuranceDAO;
import com.app.dao_impl.InsuranceDAOImpl;
import com.app.exception.ResourceNotFoundException;
import com.app.model.Insurance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import javax.sql.DataSource;
import java.util.List;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {

        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        DataSource dataSource = context.getBean(DataSource.class);
        InsuranceDAO insuranceDAO = context.getBean(InsuranceDAOImpl.class);
        System.out.println(insuranceDAO);
        Insurance insurance = new Insurance();
        Scanner sc = new Scanner(System.in);

        while (true){
            System.out.println("-----Main Menu----");
            System.out.println("1. Create new Insurance Policy");
            System.out.println("2. Delete Insurance Policy by id");
            System.out.println("3. View all Insurance Policy");
            System.out.println("4. View Insurance Policy By id");
            System.out.println("5. Update Insurance Policy By id");
            System.out.println("0. Exit");

            int op = sc.nextInt();
            sc.nextLine();
            if(op == 0)
                break;
            switch (op){
                case 1:
                    System.out.println("Enter Policy name");
                    insurance.setPolicyName(sc.nextLine());
                    System.out.println("Enter Policy description");
                    insurance.setDescription(sc.nextLine());
                    System.out.println("Enter Policy base rate");
                    insurance.setBaseRate(sc.nextInt());
                    insuranceDAO.insert(insurance);
                    break;
                case 2:
                    System.out.println("Enter Insurance id to delete");
                    int id = sc.nextInt();
                    try {
                        insuranceDAO.deleteById(id);
                    }catch (ResourceNotFoundException e){
                        System.err.println(e.getMessage());
                    }
                    break;
                case 3:
                    List<Insurance> list = insuranceDAO.getAll();
                    list.forEach(System.out::println);
                    break;
                case 4:
                    System.out.println("Enter id to view");
                    id = sc.nextInt();
                    try {
                        System.out.println(insuranceDAO.getById(id));
                    }catch (ResourceNotFoundException e){
                        System.err.println(e.getMessage());
                    }
                    break;
                case 5:
                    System.out.println("Enter id to update");
                    id = sc.nextInt();
                    sc.nextLine();
                    try {
                        insurance = insuranceDAO.getById(id);
                        System.out.println("Currend Policy Details :"+insurance);
                        System.out.println("Enter updated Insurance Policy Name (If no need to change then press enter.)");
                        String newPolicyName = sc.nextLine();
                        if (!newPolicyName.trim().isEmpty())
                            insurance.setPolicyName(newPolicyName);
                        System.out.println("Enter updated policy description");
                        String policyDescription = sc.nextLine();
                        if (!policyDescription.trim().isEmpty())
                            insurance.setDescription(policyDescription);
                        System.out.println("Enter updated base price (press Enter to keep current):");
                        String basePriceInput = sc.nextLine();

                        if (!basePriceInput.trim().isEmpty()) {
                            insurance.setBaseRate(Integer.parseInt(basePriceInput));
                        }
                        insuranceDAO.update(insurance);
                    }catch (ResourceNotFoundException e){
                        System.err.println(e.getMessage());
                    }
                    break;
                default:
                    System.out.println("Invalid Option... Choose Valid Option");
                    break;
            }
        }
        sc.close();
        context.close();

    }
}
