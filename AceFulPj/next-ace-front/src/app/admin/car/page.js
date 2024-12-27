"use client";

import { useEffect, useState } from "react";
import CarService from "@/services/CarService";

const VehiclePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ name: "", model: "", year: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await CarService.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await CarService.createVehicle(newVehicle);
            setSuccess("Vehicle created successfully!");
            setNewVehicle({ name: "", model: "", year: "" });
            fetchVehicles(); // Refresh the vehicle list
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Vehicle Management</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Add Vehicle Form */}
            <div className="mb-4">
                <h2>Add New Vehicle</h2>
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={newVehicle.name}
                            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="model">Model:</label>
                        <input
                            type="text"
                            id="model"
                            value={newVehicle.model}
                            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year:</label>
                        <input
                            type="number"
                            id="year"
                            value={newVehicle.year}
                            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Vehicle</button>
                </form>
            </div>

            {/* Vehicle List */}
            <div>
                <h2>Vehicle List</h2>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Year</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehicles.map((vehicle, index) => (
                        <tr key={vehicle.id || index}>
                            <td>{index + 1}</td>
                            <td>{vehicle.name}</td>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.year}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VehiclePage;
