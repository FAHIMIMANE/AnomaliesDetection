package com.ace.alertservice.service;

import com.ace.alertservice.entity.Alert;
import com.ace.alertservice.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getAlertsByVehicleId(Long vehicleId) {
        return alertRepository.findByVehicleId(vehicleId);
    }

    public Alert createAlert(Long vehicleId, String anomalyType, String details) {
        Alert alert = new Alert();
        alert.setVehicleId(vehicleId);
        alert.setAnomalyType(anomalyType);
        alert.setDetails(details);
        alert.setTimestamp(LocalDateTime.now());
        return alertRepository.save(alert);
    }


}
