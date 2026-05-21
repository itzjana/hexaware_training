package com.main;

import com.main.config.AppConfig;
import com.main.model.Payment;
import com.main.model.UpiPyamentMethod;
import com.main.service.PaymentService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class PaymentMain {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        Payment payment = context.getBean(UpiPyamentMethod.class);
        Payment payment1 = context.getBean(UpiPyamentMethod.class);

        System.out.println(payment);  // now shows different location for obj though we over raided the obj class
        System.out.println(payment1);

        PaymentService paymentService = context.getBean(PaymentService.class);

        System.out.println(paymentService.processPaymentByCutomer(payment));
    }
}
