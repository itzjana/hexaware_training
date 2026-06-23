package com.capestone.service;

import com.capestone.dto.QuoteReqDTO;
import com.capestone.dto.QuoteResDTO;
import com.capestone.enums.NotificationType;
import com.capestone.enums.PolicyStatus;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.QuoteMapper;
import com.capestone.model.NotificationLog;
import com.capestone.model.Officer;
import com.capestone.model.PolicyProposal;
import com.capestone.model.Quote;
import com.capestone.repository.QuoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final OfficerService officerService;
    private final PolicyProposalService policyProposalService;
    private final NotificationLogService notificationLogService;
    private final QuoteMapper quoteMapper;

    public void generateQuote(String username, QuoteReqDTO dto) {

        Officer officer = officerService.findByUserUsername(username);

        PolicyProposal proposal = policyProposalService.findById(dto.proposalId());

        Quote quote = new Quote();

        quote.setCalculatedAmount(dto.calculatedAmount());
        quote.setPolicyProposal(proposal);
        quote.setOfficer(officer);
        quoteRepository.save(quote);
        proposal.setOfficer(officer);
        proposal.setStatus(PolicyStatus.QUOTE_GENERATED);

        policyProposalService.save(proposal);

        NotificationLog notification = new NotificationLog();

        notification.setNotificationType(NotificationType.QUOTE_GENERATED);

        notification.setTitle("Quote Generated");

        notification.setMessage("Hello ,"+proposal.getCustomer().getName()+" your quote is successfully generated.");

        notification.setUser(proposal.getCustomer().getUser());

        notificationLogService.save(notification);

    }

    public List<QuoteResDTO> getMyQuotes(String username) {
        return quoteRepository.
                findByPolicyProposalCustomerUserUsername(username)
                .stream()
                .map(quoteMapper::convertToDTO).toList();
    }

    public Quote findById(int id) {
        return quoteRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("No Quote Found."));
    }

    public QuoteResDTO getQuoteById(int proposalid) {
        Quote quote = quoteRepository.findByPolicyProposalId(proposalid);

        return quoteMapper.convertToDTO(quote);
    }
}
