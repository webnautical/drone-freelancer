import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layoutpilot/MainLayout';

const DashboardDefault = Loadable(lazy(() => import('pilot/dashboard')));
const ChatsPage = Loadable(lazy(() => import('pilot/Chats')));
const PageNotFound = Loadable(lazy(() => import('utils/PageNotFound'))); //
const GuestRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'chats',
      element: <ChatsPage />
    },
    {
      path: '*',
      element: <PageNotFound />
    }

    // ... other main routes
  ]
};

export default GuestRoutes;
