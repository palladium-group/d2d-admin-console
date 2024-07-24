let protocol = window.location.protocol;
if (process.env.NODE_ENV == 'production') {
  protocol = 'https:';
}

let hostname = window.location.hostname;
if (process.env.NODE_ENV == 'production') {
  //hostname = 'api.provshare.health.gov.za';
  hostname = 'd2d-api.dataforimplementation.org';
}
const path = protocol + '//' + hostname;

export const apiRoutes = {
  d2dApi: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Dispatch`,
  manifest: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Manifest`,
  facilities: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Org/Facilities`,
  dashboard: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Dashboard`,
  subDistricts: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Org/SubDistricts`
};
