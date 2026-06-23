package com.capestone.mapper;

import com.capestone.dto.QuoteResDTO;
import com.capestone.model.Quote;
import org.springframework.stereotype.Component;

@Component
public class QuoteMapper {

    public QuoteResDTO convertToDTO(Quote quote) {
        return new QuoteResDTO(
                quote.getId(),
                quote.getPolicyProposal().getId(),
                quote.getPolicyProposal().getPolicy().getPolicyName(),
                quote.getCalculatedAmount()
        );
    }
}
