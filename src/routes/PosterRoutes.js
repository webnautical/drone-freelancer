import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layoutpilot/MainLayout';
import PostAJobDetails from 'poster/PostAJobDetails';
import PosterEditProfile from 'poster/PosterEditProfile';
import ReviewList from 'poster/Review/ReviewList';
import TransactionHistory from 'pilot/TransactionHistory';
import Invoice from 'common-pilot-poster/Invoice';
import MarketPlaceList from 'pilot/MarketPlaceList';

const DashboardDefault = Loadable(lazy(() => import('poster/dashboard')));
const Chats = Loadable(lazy(() => import('poster/Chats')));

const PostJobs = Loadable(lazy(() => import('poster/Jobs')));
const PostJob = Loadable(lazy(() => import('poster/PostJob')));
const PageNotFound = Loadable(lazy(() => import('utils/PageNotFound')));//
const MarkeplacePage = Loadable(lazy(() => import('pilot/AddMarketplace')));

// console.log("pilotssddd")
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
      element: <PostJobs />
    },
    {
      path: 'jobs-details',
      element: <PostAJobDetails />
    },
    {
      path: 'poster-update-profile',
      element: <PosterEditProfile />
    },
    {
      path: 'postjob',
      element: <PostJob />
    },
    {
      path: 'reviews',
      element: <ReviewList />
    },
    // {
    //   path: 'profileedit',
    //   element: <ProfileEdit />
    // },
    {
      path: 'chats',
      element: <Chats />
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
      path: 'transaction',
      element: <TransactionHistory />
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
