package com.capestone.controller;


import com.capestone.dto.NotificationLogResDTO;
import com.capestone.service.NotificationLogService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173/")
public class NotificationController {
    private final NotificationLogService notificationLogService;

    @GetMapping("/fetch")
    public List<NotificationLogResDTO> getByUser(Principal principal) {
        return notificationLogService.getByUserUsername(principal.getName());
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable int id){
        notificationLogService.deleteById(id);
    }
}
