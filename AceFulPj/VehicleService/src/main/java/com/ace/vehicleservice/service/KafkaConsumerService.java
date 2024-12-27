package com.ace.vehicleservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "vehicle-topic", groupId = "vehicle-group")
    public void consumeMessage(Object message) {
        System.out.println("Received message: " + message);
    }
}
