"use client";

import { useEffect, useState } from "react";
import AnomalieService from "@/services/AnomalieService"; // For fetching vehicles
import TrajectoryService from "@/services/TrajectoryService";

const TrajectoriesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [trajectories, setTrajectories] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, size: 5, totalPages: 1 });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await AnomalieService.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchTrajectories = async (vehicleId, page, size) => {
        try {
            const data = await TrajectoryService.getTrajectoriesByVehicle(vehicleId, page, size);
            setTrajectories(data.content);
            setPagination({
                page: data.number,
                size: data.size,
                totalPages: data.totalPages,
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVehicleChange = (e) => {
        const vehicleId = e.target.value;
        setSelectedVehicle(vehicleId);
        if (vehicleId) {
            fetchTrajectories(vehicleId, 0, pagination.size); // Reset to the first page
        }
    };

    const handlePageChange = (newPage) => {
        if (selectedVehicle) {
            fetchTrajectories(selectedVehicle, newPage, pagination.size);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Trajectories</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Vehicle Selection */}
            <div className="form-group mb-4">
                <label htmlFor="vehicle">Select Vehicle:</label>
                <select
                    id="vehicle"
                    className="form-control"
                    value={selectedVehicle}
                    onChange={handleVehicleChange}
                    required
                >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Trajectory List */}
            {trajectories.length > 0 && (
                <div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Speed</th>
                            <th>Heading</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trajectories.map((trajectory, index) => (
                            <tr key={trajectory.id}>
                                <td>{index + 1 + pagination.page * pagination.size}</td>
                                <td>{trajectory.latitude}</td>
                                <td>{trajectory.longitude}</td>
                                <td>{trajectory.speed} km/h</td>
                                <td>{trajectory.heading}</td>
                                <td>{new Date(trajectory.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-secondary"
                            disabled={pagination.page === 0}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            Previous
                        </button>
                        <span>
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
                        <button
                            className="btn btn-secondary"
                            disabled={pagination.page === pagination.totalPages - 1}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrajectoriesPage;
