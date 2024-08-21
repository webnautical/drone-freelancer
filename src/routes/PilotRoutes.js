import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layoutpilot/MainLayout';
import MarketPlaceList from 'pilot/MarketPlaceList';
import JobDetails from 'pilot/JobDetails';
import PurchasePlan from 'pilot/Paypal/Purchase';
import Success from 'pilot/Paypal/Success';
import Chats from 'poster/Chats';
import TransactionHistory from 'pilot/TransactionHistory';
import Invoice from 'common-pilot-poster/Invoice';

const DashboardDefault = Loadable(lazy(() => import('pilot/dashboard')));
// const ChatsPage = Loadable(lazy(() => import('pilot/Chats')));
const ProfileeditPage = Loadable(lazy(() => import('pilot/ProfileEdit')));
const PlansPage = Loadable(lazy(() => import('pilot/Plans')));
const MarkeplacePage = Loadable(lazy(() => import('pilot/AddMarketplace')));

const JobsPage = Loadable(lazy(() => import('pilot/Jobs')));
const PageNotFound = Loadable(lazy(() => import('utils/PageNotFound'))); //
const PilotRoutes = {
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
      path: 'jobs',
      element: <JobsPage />
    },
    {
      path: 'job-details',
      element: <JobDetails />
    },
    {
      path: 'chats',
      element: <Chats />
    },
    {
      path: 'profileedit',
      element: <ProfileeditPage />
    },
    {
      path: 'transaction',
      element: <TransactionHistory/>
    },
    {
      path: 'plans',
      element: <PlansPage />
    },
    {
      path: 'plans/purchase',
      element: <PurchasePlan />
    },
    {
      path: 'plans/success',
      element: <Success />
    },
    {
      path: 'markeplace/:updID',
      element: <MarkeplacePage />
    },
    {
      path: 'market-place-list',
      element: <MarketPlaceList />
    },
    {
      path: 'invoice',
      element: <Invoice />
    },
    {
      path: '*',
      element: <PageNotFound />
    }

    // ... other main routes
  ]
};

export default PilotRoutes;
