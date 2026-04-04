package com.collabcode_api.core.config;

import com.collabcode_api.features.room.dto.SocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // Extract the data we saved during the 'addUser' step in EditorController
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");

        if (username != null && roomId != null) {
            log.info("User disconnected: {} from room: {}", username, roomId);

            // Create the LEAVE message
            var leaveMessage = SocketMessage.builder()
                    .type(SocketMessage.MessageType.LEAVE)
                    .sender(username)
                    .roomId(roomId)
                    .build();

            // Broadcast to the room so others see "User has left"
            messagingTemplate.convertAndSend("/topic/room/" + roomId, leaveMessage);
        }
    }
}