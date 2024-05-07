const protocol = window.location.protocol;
const hostname = window.location.hostname;
const path = protocol + '//' + hostname;
export const apiRoutes = {
  d2dApi: `${path}${process.env.REACT_APP_D2D_BACKEND_PORT}/api/Dispatch`
};
