package com.capestone.service;

import com.capestone.dto.PaymentReqDTO;
import com.capestone.enums.NotificationType;
import com.capestone.enums.PaymentStatus;
import com.capestone.enums.PolicyStatus;
import com.capestone.model.NotificationLog;
import com.capestone.model.Payment;
import com.capestone.model.PolicyProposal;
import com.capestone.model.Quote;
import com.capestone.repository.PaymentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final QuoteService quoteService;
    private final PolicyProposalService policyProposalService;
    private final NotificationLogService notificationLogService;


    public void makePayment(PaymentReqDTO dto) {

        Quote quote = quoteService.findById(dto.quoteId());

        Payment payment = new Payment();
        payment.setQuote(quote);
        payment.setAmount(quote.getCalculatedAmount());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        PolicyProposal policyProposal = quote.getPolicyProposal();

        policyProposal.setStatus(PolicyStatus.ACTIVE);
        policyProposal.setStartDate(LocalDate.now());

        Integer validityMonths = policyProposal.getPolicy().getValidityMonths();
        policyProposal.setEndDate(LocalDate.now().plusMonths(validityMonths));

        policyProposalService.save(policyProposal);

        NotificationLog notification = new NotificationLog();

        notification.setNotificationType(NotificationType.POLICY_ACTIVATED);

        notification.setTitle("Payment Successful");

        notification.setMessage("Hello ,"+policyProposal.getCustomer().getName()+" your policy is activated.");

        notification.setUser(policyProposal.getCustomer().getUser());

        notificationLogService.save(notification);


    }
}
