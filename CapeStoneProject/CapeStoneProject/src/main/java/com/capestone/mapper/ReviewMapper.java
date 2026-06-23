package com.capestone.mapper;

import com.capestone.dto.ReviewResDTO;
import com.capestone.dto.ReviewReqDTO;
import com.capestone.model.Customer;
import com.capestone.model.UserReview;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public UserReview DtoToEntity(ReviewReqDTO dto, Customer customer) {
        UserReview userReview = new UserReview();
        userReview.setReviewContent(dto.reviewContent());
        userReview.setCustomer(customer);
        userReview.setRating(dto.rating());
        return userReview;
    }

    public ReviewResDTO EntityToDTO(UserReview userReview) {
        return new ReviewResDTO(
                userReview.getReviewContent(),
                userReview.getRating(),
                userReview.getCustomer().getName()
        );
    }
}
