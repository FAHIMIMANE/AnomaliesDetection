package com.ace.alertservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
public class KafkaConsumer {

    @KafkaListener(topics = "anomaly-topic", groupId = "alert-service-group")
    public void consumeMessage(String message) {
        System.out.println("Consumed message: " + message);
        // Process the received anomaly data
    }
}