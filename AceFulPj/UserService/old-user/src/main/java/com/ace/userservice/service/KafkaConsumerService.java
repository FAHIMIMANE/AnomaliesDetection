package com.ace.userservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "my-topic", groupId = "user-service-group")
    public void listen(String message) {
        try {
            System.out.println("Received message: " + message);
            // Additional processing logic here
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
        }
    }
}
