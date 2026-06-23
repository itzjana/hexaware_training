package com.capestone.service;

import com.capestone.dto.LoginResDTO;
import com.capestone.exception.ResourceNotFoundException;
import com.capestone.mapper.AuthMapper;
import com.capestone.model.User;
import com.capestone.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AuthMapper authMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("Invalid User"));
    }


    public LoginResDTO getUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(()-> new ResourceNotFoundException("Invalid User"));
        return authMapper.entityToDTO(user);
    }


    public User signup(User user) {
        return userRepository.save(user);
    }

    //For document upload
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(()->new ResourceNotFoundException("user not found"));
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public boolean checkUsernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean checkEmailExists( String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}
