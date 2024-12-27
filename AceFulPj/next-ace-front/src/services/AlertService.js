const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const AlertService = {
    getAlertsByVehicle: async (vehicleId, page = 0, size = 10) => {
        try {
            const response = await fetch(
                `${BASE_URL}/alertservice/alerts/vehicle/${vehicleId}?page=${page}&size=${size}`,
                { method: "GET" }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch alerts");
            }
            return response.json();
        } catch (error) {
            throw new Error(error.message || "Failed to fetch alerts");
        }
    },
};

export default AlertService;
