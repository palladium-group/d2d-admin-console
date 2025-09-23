// Determine protocol (http or https) based on the environment
let protocol = window.location.protocol;
if (process.env.NODE_ENV == 'production') {
  // Force HTTPS in production for security
  protocol = 'https:';
}

// Determine hostname based on environment
let hostname = window.location.hostname;
if (process.env.NODE_ENV == 'production') {
  // In production, use the backend URL from environment variables
  hostname = process.env.REACT_APP_D2D_BACKEND_URL;
}

// Construct the base path for API requests
const path = protocol + '//' + hostname;

// Define all API endpoints for the application
export const apiRoutes = {
  // Dispatch-to-Dispatch API endpoint
  d2dApi: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Dispatch`,

  // Manifest-related API endpoint
  manifest: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Manifest`,

  // Facilities information API endpoint
  facilities: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Org/Facilities`,

  // Dashboard data API endpoint
  dashboard: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Dashboard`,

  // Sub-districts (administrative divisions) API endpoint
  subDistricts: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Org/SubDistricts`
};
