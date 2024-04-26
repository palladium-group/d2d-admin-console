import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
// import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// application - user social & account profile routing
const AppUserSocialProfile = Loadable(lazy(() => import('views/application/users/social-profile')));
const AppUserAccountProfile1 = Loadable(lazy(() => import('views/application/users/account-profile/Profile1')));
const AppUserAccountProfile2 = Loadable(lazy(() => import('views/application/users/account-profile/Profile2')));
const AppUserAccountProfile3 = Loadable(lazy(() => import('views/application/users/account-profile/Profile3')));

// application - user cards & list variant routing
const AppProfileCardStyle1 = Loadable(lazy(() => import('views/application/users/card/CardStyle1')));
const AppProfileCardStyle2 = Loadable(lazy(() => import('views/application/users/card/CardStyle2')));
const AppProfileCardStyle3 = Loadable(lazy(() => import('views/application/users/card/CardStyle3')));
const AppProfileListStyle1 = Loadable(lazy(() => import('views/application/users/list/Style1')));
const AppProfileListStyle2 = Loadable(lazy(() => import('views/application/users/list/Style2')));

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
        },
    ]
};

export default MainRoutes;
