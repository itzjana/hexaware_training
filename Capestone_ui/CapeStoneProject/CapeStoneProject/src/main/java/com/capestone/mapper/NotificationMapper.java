package com.capestone.mapper;

import com.capestone.dto.NotificationLogResDTO;
import com.capestone.model.NotificationLog;
import com.capestone.model.User;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationLogResDTO entityToDTO(NotificationLog notificationLog){
        return new NotificationLogResDTO(
                notificationLog.getId(),
                notificationLog.getNotificationType().toString(),
                notificationLog.getCreatedAt(),
                notificationLog.getUser().getUsername()
        );
    }
}
