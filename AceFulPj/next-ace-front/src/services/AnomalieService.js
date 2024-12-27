const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const AnomalieService = {
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

    analyzeAnomaly: async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/anomaly-detection-service/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to analyze anomaly");
            }
            return response.json();
        } catch (error) {
            throw new Error(error.message || "Failed to analyze anomaly");
        }
    },
};

export default AnomalieService;
