package com.ace.vehicleservice.service;

import com.ace.vehicleservice.entity.MovementLog;
import com.ace.vehicleservice.repository.MovementLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TrajectorySimulator {

    private final MovementLogRepository movementLogRepository;

    public TrajectorySimulator(MovementLogRepository movementLogRepository) {
        this.movementLogRepository = movementLogRepository;
    }

    public void simulateMovement(Long vehicleId, double[] start, double[] end, double speed, int intervalInSeconds, int steps) {
        double currentLat = start[0];
        double currentLon = start[1];

        // Calculate step increments
        double latStep = (end[0] - start[0]) / steps;
        double lonStep = (end[1] - start[1]) / steps;

        for (int i = 0; i <= steps; i++) {
            try {
                // Log the current position
                MovementLog log = new MovementLog();
                log.setVehicleId(vehicleId);
                log.setLatitude(currentLat);
                log.setLongitude(currentLon);
                log.setSpeed(speed);
                log.setTimestamp(LocalDateTime.now());
                movementLogRepository.save(log);

                // Move to the next position
                currentLat += latStep;
                currentLon += lonStep;

                // Wait for the interval
                Thread.sleep(intervalInSeconds * 1000);

                // Simulate anomaly (e.g., sudden speed change)
                if (i == steps / 2) {
                    speed *= 2; // Double the speed mid-trajectory
                    System.out.println("Anomaly: Speed changed to " + speed + " at step " + i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Simulation interrupted", e);
            }
        }
    }
}
