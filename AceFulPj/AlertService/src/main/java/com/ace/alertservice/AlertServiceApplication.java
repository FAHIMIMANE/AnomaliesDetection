package com.ace.alertservice;

import com.ace.alertservice.entity.Alert;
import com.ace.alertservice.repository.AlertRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@SpringBootApplication
public class AlertServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AlertServiceApplication.class, args);
	}


	@Bean
	public CommandLineRunner loadData(AlertRepository alertRepository) {
		return args -> {
			Random random = new Random();

			// Define anomaly types and example details
			List<String> anomalyTypes = List.of(
					"Reconstruction Error Anomaly",
					"Speed Anomaly",
					"Latitude Range Anomaly",
					"Longitude Range Anomaly",
					"Location Change Anomaly"
			);

			List<String> anomalyDetails = List.of(
					"Reconstruction error exceeded threshold.",
					"Vehicle exceeded speed limit.",
					"Latitude out of range.",
					"Longitude out of range.",
					"Location changed unusually fast."
			);

			// Generate 20 alerts for vehicle ID 1
			IntStream.rangeClosed(1, 20).forEach(i -> {
				Alert alert = new Alert();
				alert.setVehicleId(1L);

				// Randomly assign an anomaly type and corresponding details
				int anomalyIndex = random.nextInt(anomalyTypes.size());
				alert.setAnomalyType(anomalyTypes.get(anomalyIndex));
				alert.setDetails(anomalyDetails.get(anomalyIndex));

				// Randomly assign a timestamp within the current month
				alert.setTimestamp(LocalDateTime.now()
						.minusDays(random.nextInt(30))
						.withHour(random.nextInt(24))
						.withMinute(random.nextInt(60))
						.withSecond(random.nextInt(60)));

				alertRepository.save(alert);
			});

			// Generate 20 alerts for vehicle ID 2
			IntStream.rangeClosed(1, 20).forEach(i -> {
				Alert alert = new Alert();
				alert.setVehicleId(2L);

				// Randomly assign an anomaly type and corresponding details
				int anomalyIndex = random.nextInt(anomalyTypes.size());
				alert.setAnomalyType(anomalyTypes.get(anomalyIndex));
				alert.setDetails(anomalyDetails.get(anomalyIndex));

				// Randomly assign a timestamp within the current month
				alert.setTimestamp(LocalDateTime.now()
						.minusDays(random.nextInt(30))
						.withHour(random.nextInt(24))
						.withMinute(random.nextInt(60))
						.withSecond(random.nextInt(60)));

				alertRepository.save(alert);
			});

			System.out.println("Injected 40 alerts into the database.");
		};
	}
}
