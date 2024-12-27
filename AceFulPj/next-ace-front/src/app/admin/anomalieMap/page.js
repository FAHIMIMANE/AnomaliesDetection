"use client";

import { useEffect, useState } from "react";
import AnomalieService from "@/services/AnomalieService";

const convertDateToTimestamp = (date) => {
    // Converts a JavaScript Date object to a Unix timestamp (in seconds)
    return Math.floor(date.getTime() / 1000);
};

const AnomalyPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [anomalyData, setAnomalyData] = useState({
        latitude: "",
        longitude: "",
        speed: "",
        heading: "",
        start_time: "", // Start time input from the user
    });
    const [result, setResult] = useState(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!selectedVehicle) {
            setError("Please select a vehicle.");
            return;
        }

        // Convert start time to timestamp
        const startTime = convertDateToTimestamp(new Date(anomalyData.start_time));

        // Get the current time and calculate the time difference
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeDiff = currentTime - startTime;

        // Prepare the payload
        const payload = {
            car_id: selectedVehicle,
            latitude: parseFloat(anomalyData.latitude),
            longitude: parseFloat(anomalyData.longitude),
            speed: parseFloat(anomalyData.speed),
            heading: parseFloat(anomalyData.heading),
            time_diff: timeDiff,
            timestamp: currentTime,
        };

        try {
            const data = await AnomalieService.analyzeAnomaly(payload);
            setResult(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Anomaly Detection</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {result && (
                <div className="alert alert-info">
                    <h4>Analysis Result</h4>
                    <p><strong>Is Anomaly:</strong> {result.details.is_anomaly ? "Yes" : "No"}</p>
                    <p><strong>Anomaly Types:</strong> {result.anomaly_types.join(", ")}</p>
                    <p><strong>Timestamp:</strong> {new Date(result.details.timestamp * 1000).toLocaleString()}</p>
                    <p><strong>Time Difference:</strong> {result.details.time_diff} seconds</p>
                    <p><strong>Latitude:</strong> {result.details.latitude}</p>
                    <p><strong>Longitude:</strong> {result.details.longitude}</p>
                    <p><strong>Speed:</strong> {result.details.speed} km/h</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                {/* Vehicle Selection */}
                <div className="form-group">
                    <label htmlFor="vehicle">Select Vehicle:</label>
                    <select
                        id="vehicle"
                        className="form-control"
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
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

                {/* Anomaly Input Fields */}
                <div className="form-group">
                    <label htmlFor="latitude">Latitude:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="latitude"
                        value={anomalyData.latitude}
                        onChange={(e) => setAnomalyData({ ...anomalyData, latitude: e.target.value })}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="longitude">Longitude:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="longitude"
                        value={anomalyData.longitude}
                        onChange={(e) => setAnomalyData({ ...anomalyData, longitude: e.target.value })}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="speed">Speed:</label>
                    <input
                        type="number"
                        id="speed"
                        value={anomalyData.speed}
                        onChange={(e) => setAnomalyData({ ...anomalyData, speed: e.target.value })}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="heading">Heading:</label>
                    <input
                        type="number"
                        id="heading"
                        value={anomalyData.heading}
                        onChange={(e) => setAnomalyData({ ...anomalyData, heading: e.target.value })}
                        className="form-control"
                        required
                    />
                </div>

                {/* Start Time Input */}
                <div className="form-group">
                    <label htmlFor="start_time">Start Time:</label>
                    <input
                        type="datetime-local"
                        id="start_time"
                        value={anomalyData.start_time}
                        onChange={(e) => setAnomalyData({ ...anomalyData, start_time: e.target.value })}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Analyze</button>
            </form>
        </div>
    );
};

export default AnomalyPage;
