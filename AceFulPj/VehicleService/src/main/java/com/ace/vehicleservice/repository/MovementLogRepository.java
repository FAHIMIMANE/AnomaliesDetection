package com.ace.vehicleservice.repository;

import com.ace.vehicleservice.entity.MovementLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovementLogRepository extends JpaRepository<MovementLog, Long> {
    Optional<MovementLog> findFirstByVehicleIdOrderByTimestampDesc(Long vehicleId);

}
