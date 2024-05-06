import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
// import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

// Facility
const Facility = Loadable(lazy(() => import('views/pages/facility')));

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
      path: '/facility/:id',
      element: <Facility />
    }
  ]
};

export default MainRoutes;
