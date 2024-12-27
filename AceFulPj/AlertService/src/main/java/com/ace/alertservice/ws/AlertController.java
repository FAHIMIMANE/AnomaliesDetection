package com.ace.alertservice.ws;

import com.ace.alertservice.entity.Alert;
import com.ace.alertservice.repository.AlertRepository;
import com.ace.alertservice.service.AlertService;
import com.ace.alertservice.service.KafkaProducer;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertService alertService;
    private final KafkaProducer kafkaProducer;
    private final AlertRepository alertRepository;

    public AlertController(AlertService alertService, KafkaProducer kafkaProducer
    , AlertRepository alertRepository) {
        this.alertService = alertService;
        this.kafkaProducer = kafkaProducer;
        this.alertRepository = alertRepository;

    }

    @GetMapping("/{vehicleId}")
    public List<Alert> getAlertsByVehicleId(@PathVariable Long vehicleId) {
        return alertService.getAlertsByVehicleId(vehicleId);
    }

    @PostMapping
    public Alert createAlert(@RequestParam Long vehicleId,
                             @RequestParam String anomalyType,
                             @RequestParam String details) {
        Alert alert = alertService.createAlert(vehicleId, anomalyType, details);

        // Publish to Kafka
        String message = String.format("VehicleID: %d, Anomaly: %s, Details: %s", vehicleId, anomalyType, details);
        kafkaProducer.sendMessage("alert-topic", message);

        return alert;
    }
    @GetMapping("/vehicle/{vehicleId}")
    public Page<Alert> getAlertsByVehicle(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return alertRepository.findByVehicleId(vehicleId, pageable);
    }
}
