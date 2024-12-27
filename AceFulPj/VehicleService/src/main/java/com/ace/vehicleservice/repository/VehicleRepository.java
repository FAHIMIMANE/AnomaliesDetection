package com.ace.vehicleservice.repository;

import com.ace.vehicleservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Override
    List<Vehicle> findAll();


    Page<Vehicle> findAll(Pageable pageable);

}
