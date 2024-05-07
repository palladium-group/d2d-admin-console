import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
// import LoginRoutes from './LoginRoutes';
// import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'ui-component/Loadable';
import MainLayout from '../layout/MainLayout';

// const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const Home = Loadable(lazy(() => import('views/home')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '', element: <Home /> }]
    },
    MainRoutes
  ]);
}
