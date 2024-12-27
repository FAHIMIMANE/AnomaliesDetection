"use client";

import { useEffect, useState } from "react";
import AnomalieService from "@/services/AnomalieService"; // For fetching vehicles
import AlertService from "@/services/AlertService";

const AlertsPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [alerts, setAlerts] = useState([]);
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

    const fetchAlerts = async (vehicleId, page, size) => {
        try {
            const data = await AlertService.getAlertsByVehicle(vehicleId, page, size);
            setAlerts(data.content);
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
            fetchAlerts(vehicleId, 0, pagination.size); // Reset to the first page
        }
    };

    const handlePageChange = (newPage) => {
        if (selectedVehicle) {
            fetchAlerts(selectedVehicle, newPage, pagination.size);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Alerts History</h1>

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

            {/* Alerts List */}
            {alerts.length > 0 ? (
                <div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Anomaly Type</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {alerts.map((alert, index) => (
                            <tr key={alert.id}>
                                <td>{index + 1 + pagination.page * pagination.size}</td>
                                <td>{alert.anomalyType}</td>
                                <td>{alert.details}</td>
                                <td>{new Date(alert.timestamp).toLocaleString()}</td>
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
            ) : (
                <p>No alerts found for the selected vehicle.</p>
            )}
        </div>
    );
};

export default AlertsPage;
