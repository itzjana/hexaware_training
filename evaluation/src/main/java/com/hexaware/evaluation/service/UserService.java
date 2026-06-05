package com.hexaware.evaluation.service;

import com.hexaware.evaluation.exception.ResourceNotFoundException;
import com.hexaware.evaluation.model.User;
import com.hexaware.evaluation.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("Invalid User"));
    }

    public User signUp(User user) {
        return userRepository.save(user);
    }

}
