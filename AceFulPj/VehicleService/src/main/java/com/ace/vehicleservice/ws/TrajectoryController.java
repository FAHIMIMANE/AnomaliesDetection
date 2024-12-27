package com.ace.vehicleservice.ws;

import com.ace.vehicleservice.entity.Trajectory;
import com.ace.vehicleservice.service.KafkaProducerService;
import com.ace.vehicleservice.service.TrajectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/trajectories")
@CrossOrigin(origins = "*") // Allow all origins
public class TrajectoryController {

    @Autowired
    private TrajectoryService trajectoryService;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    // Fetch all trajectories for a specific vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public List<Trajectory> getTrajectoriesByVehicle(@PathVariable Long vehicleId) {
        return trajectoryService.getTrajectoriesByVehicleId(vehicleId)
                .stream()
                .peek(trajectory -> trajectory.setVehicle(null)) // Avoid recursive nesting
                .collect(Collectors.toList());
    }

    // Paginated endpoint for trajectories of a specific vehicle
    @GetMapping("/vehicle/page/{vehicleId}")
    public Page<Trajectory> getTrajectoriesByVehicle(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Trajectory> trajectoriesPage = trajectoryService.getTrajectoriesByVehicleId(vehicleId, pageable);
        // Avoid recursive nesting in the paginated response
        trajectoriesPage.getContent().forEach(trajectory -> trajectory.setVehicle(null));
        return trajectoriesPage;
    }

    @PostMapping("/trajectories")
    public ResponseEntity<Void> saveTrajectories(@RequestBody List<Trajectory> trajectories) {
        System.out.println("Received a batch of " + trajectories.size() + " trajectories.");
        trajectoryService.saveAll(trajectories); // Save all trajectories in one call

        // Publish each trajectory to a Kafka topic
        trajectories.forEach(trajectory ->
                kafkaProducerService.sendMessage("trajectory-topic", trajectory)
        );

        return ResponseEntity.ok().build();
    }

    // Stream trajectories one by one for a specific vehicle
    @GetMapping(value = "/vehicle/stream/{vehicleId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTrajectories(@PathVariable Long vehicleId) {
        SseEmitter emitter = new SseEmitter();

        // Fetch trajectories for the specified vehicle
        List<Trajectory> trajectories = trajectoryService.getTrajectoriesByVehicleId(vehicleId)
                .stream()
                .peek(trajectory -> trajectory.setVehicle(null)) // Avoid recursive nesting
                .collect(Collectors.toList());

        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(new Runnable() {
            private int index = 0;

            @Override
            public void run() {
                if (index < trajectories.size()) {
                    try {
                        // Send the current trajectory to the client
                        emitter.send(trajectories.get(index));
                        index++;
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                } else {
                    // Complete the stream when all trajectories are sent
                    emitter.complete();
                }
            }
        }, 0, 1, TimeUnit.SECONDS); // Send a trajectory every second

        return emitter;
    }
}

