import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
// import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

// Facility
const Facility = Loadable(lazy(() => import('views/pages/facility')));
const NotificationDetail = Loadable(
  lazy(() => import('views/pages/notifications/NotificationDetail'))
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
      path: '/notification/:id',
      element: <NotificationDetail />
    }
  ]
};

export default MainRoutes;
