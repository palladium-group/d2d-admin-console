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
const Notifications = Loadable(
  lazy(() => import('views/pages/notifications/index'))
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
      path: '/notifications',
      element: <Notifications />
    },
    {
      path: '/notification/:id',
      element: <NotificationDetail />
    }
  ]
};

export default MainRoutes;
