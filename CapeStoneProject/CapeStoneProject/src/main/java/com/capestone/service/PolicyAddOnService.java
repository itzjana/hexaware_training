package com.capestone.service;

import com.capestone.model.PolicyProposal;
import com.capestone.model.PolicyProposalAddOn;
import com.capestone.repository.PolicyProposalAddOnRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PolicyAddOnService {

    private final PolicyProposalAddOnRepository policyProposalAddOnRepository;

    public void save(PolicyProposalAddOn proposalAddOn) {
        policyProposalAddOnRepository.save(proposalAddOn);
    }

    public List<PolicyProposalAddOn> getAddOnsByProposal(PolicyProposal policyProposal) {
        return policyProposalAddOnRepository.findAllByPolicyProposal(policyProposal);
    }
}
