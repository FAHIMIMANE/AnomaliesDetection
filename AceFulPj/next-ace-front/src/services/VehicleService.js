import axios from 'axios';

const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const VehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vehicleservice/vehicles/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch vehicles');
      } else if (error.request) {
        throw new Error('No response received from the server');
      } else {
        throw new Error(error.message || 'Failed to fetch vehicles');
      }
    }
  },
};

export default VehicleService;
