package com.ace.alertservice.repository;

import com.ace.alertservice.entity.Alert;
import jakarta.persistence.Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {


    Page<Alert> findByVehicleId(Long vehicleId, Pageable pageable);

    List<Alert> findByVehicleId(Long vehicleId);
}
