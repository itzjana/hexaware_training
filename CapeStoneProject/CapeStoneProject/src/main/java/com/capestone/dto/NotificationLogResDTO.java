package com.capestone.dto;

import java.time.Instant;

public record NotificationLogResDTO(
        int id,
        String notificationType,
        Instant sendAt,
        String username
) {
}