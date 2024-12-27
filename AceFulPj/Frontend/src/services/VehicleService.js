const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const VehicleService = {
  getAllVehicles: async () => {
    const response = await fetch(`${BASE_URL}/vehicleservice/vehicles/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    return response.json();
  },
};

export default VehicleService;
