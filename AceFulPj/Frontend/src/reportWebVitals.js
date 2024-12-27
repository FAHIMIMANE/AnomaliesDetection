// Import web-vitals functions
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Define the reportWebVitals function
const reportWebVitals = (onPerfEntry) => {
  // Check if the callback function is provided and is a valid function
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Call web-vitals and pass the metrics to the callback
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// Export the function as the default export
export default reportWebVitals;
