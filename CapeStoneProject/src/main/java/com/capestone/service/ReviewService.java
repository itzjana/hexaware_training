package com.capestone.service;

import com.capestone.dto.ReviewResDTO;
import com.capestone.dto.ReviewReqDTO;
import com.capestone.mapper.ReviewMapper;
import com.capestone.model.Customer;
import com.capestone.model.UserReview;
import com.capestone.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerService customerService;
    private final ReviewMapper reviewMapper;

    public void addReview(ReviewReqDTO dto, String name) {
        Customer customer = customerService.getCustomer(name);
        reviewRepository.save(reviewMapper.DtoToEntity(dto,customer));
    }

    public List<ReviewResDTO> getAll() {
        List<UserReview> userReviews = reviewRepository.findAll();

        return userReviews.stream().map(reviewMapper::EntityToDTO).toList();
    }
}
