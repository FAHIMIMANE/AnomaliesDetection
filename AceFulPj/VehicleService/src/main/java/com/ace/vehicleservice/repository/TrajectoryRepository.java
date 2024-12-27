package com.ace.vehicleservice.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ace.vehicleservice.entity.Trajectory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrajectoryRepository extends JpaRepository<Trajectory, Long> {
    List<Trajectory> findByVehicleId(Long vehicleId);
    Page<Trajectory> findByVehicleId(Long vehicleId, Pageable pageable);

}
