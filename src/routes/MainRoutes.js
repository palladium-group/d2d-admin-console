import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
// import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

// Facility
const Facility = Loadable(lazy(() => import('views/pages/facility')));
const FacilityDetails = Loadable(
  lazy(() => import('views/pages/facility/FacilityDetails'))
);
const NotificationDetail = Loadable(
  lazy(() => import('views/notifications/NotificationDetail'))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    // <AuthGuard>
    <MainLayout />
    // </AuthGuard>
  ),
  children: [
    {
      path: '/facilities',
      element: <Facility />
    },
    {
      path: '/facility-details/:id',
      element: <FacilityDetails />
    },
    {
      path: '/notification/:id',
      element: <NotificationDetail />
    }
  ]
};

export default MainRoutes;
