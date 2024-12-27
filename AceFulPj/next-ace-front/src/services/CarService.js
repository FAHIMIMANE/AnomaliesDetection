const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const CarService = {
    getAllVehicles: async () => {
        try {
            const response = await fetch(`${BASE_URL}/vehicleservice/vehicles/all`, {
                method: "GET",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch vehicles");
            }
            return response.json();
        } catch (error) {
            throw new Error(error.message || "Failed to fetch vehicles");
        }
    },

    createVehicle: async (vehicle) => {
        try {
            const response = await fetch(`${BASE_URL}/vehicleservice/vehicles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehicle),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create vehicle");
            }
            return response.json();
        } catch (error) {
            throw new Error(error.message || "Failed to create vehicle");
        }
    },
};

export default CarService;
