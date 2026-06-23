package com.capestone.service;

import com.capestone.dto.NotificationLogResDTO;
import com.capestone.mapper.NotificationMapper;
import com.capestone.model.NotificationLog;
import com.capestone.repository.NotificationLogRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class NotificationLogService {

    private final NotificationLogRepository notificationLogRepository;
    private final NotificationMapper notificationMapper;


    public List<NotificationLogResDTO> getByUserUsername(String name) {
        List<NotificationLog> list = notificationLogRepository.findAllByUserUsername(name);
        return list
                .stream()
                .map(notificationMapper::entityToDTO).toList();
    }

    public void save(NotificationLog notification) {
        notificationLogRepository.save(notification);
    }


    public void deleteById(int id) {
        notificationLogRepository.deleteById(id);
    }
}
