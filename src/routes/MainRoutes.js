import { lazy } from 'react';
 
// project import
 
import Loadable from 'components/Loadable';
 
import MainLayout from 'layout/MainLayout';
import List from 'utils/AnimalRescue/List';
import AnimalRescueDetails from 'utils/AnimalRescue/AnimalRescueDetails';
 
// render - dashboard
 
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
 
// render - sample page
 
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
 
// render - utilities
 
// const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
 
const PageNotFound = Loadable(lazy(() => import('utils/PageNotFound'))); //
 
const PostedJobs = Loadable(lazy(() => import('utils/Postedjob')));
const NotificationList = Loadable(lazy(() => import('utils/notification/NotificationList')));
const Advertisement = Loadable(lazy(() => import('utils/advertisement/Advertisement')));
 
const ShowallDetails = Loadable(lazy(() => import('utils/ViewJobDetails')));
 
const PiloteApproved = Loadable(lazy(() => import('utils/ViewPilot')));
const DeletedPilots = Loadable(lazy(() => import('utils/Users/DeletedUser')));
 
const UserDetails = Loadable(lazy(() => import('utils/UserDetails')));
const Posterdata = Loadable(lazy(() => import('utils/PosterDetails')));
 
const AllTransaction = Loadable(lazy(() => import('utils/ViewAlltransction')));
 
const Usermangement = Loadable(lazy(() => import('utils/Usermanagement')));
 
const ViewAllSubscribe = Loadable(lazy(() => import('utils/subscriptions/ViewPlan')));
 
const AddNewplan = Loadable(lazy(() => import('utils/subscriptions/AddNewPlan')));
 
const EditSubscribe = Loadable(lazy(() => import('utils/subscriptions/EditSubscriptionPlan')));
 
const Viewstatic = Loadable(lazy(() => import('utils/staticspages/ShowStatic')));
 
const EditStaticdata = Loadable(lazy(() => import('utils/staticspages/Editstaticdata')));
 
const AddStaticdata = Loadable(lazy(() => import('utils/staticspages/AddStaticpage')));
 
const QuestionAnswerlist = Loadable(lazy(() => import('utils/staticspages/QueationAnswerlist')));
 
const AddQuestionAnswer = Loadable(lazy(() => import('utils/staticspages/AddQA')));
 
const UpdateUser = Loadable(lazy(() => import('utils/UpdateUsersdata')));
 
const HomePageContent = Loadable(lazy(() => import('utils/HomepageContent')));
 
const QualificationPage = Loadable(lazy(() => import('utils/Viewqualification')));
 
const Posterlist = Loadable(lazy(() => import('utils/Posterlist')));
 
const ViewpilotdataPage = Loadable(lazy(() => import('utils/UserDetails')));
 
const ProductPage =Loadable(lazy(() => import('utils/Product')));
const ViewProductPage =Loadable(lazy(() => import('utils/ViewProduct')));
const Aboutuspagelist =Loadable(lazy(() => import('utils/staticspages/AboutUs')));
const AddNewReviews =Loadable(lazy(() => import('utils/staticspages/SiteReviews')));
const Sitereview =Loadable(lazy(() => import('utils/staticspages/ReviewsList')));
const Topcategory =Loadable(lazy(() => import('utils/staticspages/Topcategorylist')));
const AddTopcategory =Loadable(lazy(() => import('utils/staticspages/AddTopcategory')));
const Allcategory =Loadable(lazy(() => import('utils/staticspages/Allcategory')));
const Editcategory =Loadable(lazy(() => import('utils/staticspages/Editcategory')));
const Addnewcategory =Loadable(lazy(() => import('utils/staticspages/Addnewcategory')));
const Updatecantectus =Loadable(lazy(() => import('utils/staticspages/Updatecontect')));
const UpdateapplinkUpdate =Loadable(lazy(() => import('utils/staticspages/ApplinkUpdate')));
const UpdateProduct =Loadable(lazy(() => import('utils/UpdateProduct')));
const Subadminlist =Loadable(lazy(() => import('utils/SubAdminlist')));
const Addnewsubadmin =Loadable(lazy(() => import('utils/AddnewSubadmin')));
 
const Updateposte =Loadable(lazy(() => import('utils/UpdatePostedjob')));
const Addaccess =Loadable(lazy(() => import('utils/Addaccess')));
const Otpverify =Loadable(lazy(() => import('utils/OtpVerification')));
const Extracategoryamount =Loadable(lazy(() => import('utils/staticspages/ExtraRadiusPrice')));
const SendmessagePage =Loadable(lazy(() => import('utils/SendMessagetouser')));
const Fulltimejobrequest =Loadable(lazy(() => import('utils/FulltimeEmployementlist')));
const UpdatePoster =Loadable(lazy(() => import('utils/PosterEditProfile')));
const MetaListing =Loadable(lazy(() => import('utils/web-settings/meta/MetaListing')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color'))); //
 
// const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
 
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
 
// ==============================|| MAIN ROUTING ||============================== //extracategoryamount
 
const MainRoutes = {
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
      path: 'utils',
      children: [
        {
          path: 'usermangement/:type',
          element: <Usermangement />
        },
        {
          path: 'posterlist',
          element: <Posterlist />
        },
      ]
    },
 
    {
      path: 'utils',
      children: [
        {
          path: 'pilot',
 
          element: <PiloteApproved />
        },
        {
          path: 'deleted-user',
 
          element: <DeletedPilots />
        },
        {
          path: 'otpverify',
 
          element: <Otpverify />
        },
        {
          path: 'fulltimejobrequest',
 
          element: <Fulltimejobrequest />
        },
        {
          path: 'animal-rescue',
 
          element: <List />
        },
        {
          path: 'animal-rescue-details',
          element: <AnimalRescueDetails />
        },
        {
          path: 'updatePoster',
 
          element: <UpdatePoster />
        },
      ]
    },
 
    {
      path: 'alltransaction',
 
      element: <AllTransaction />
    },
 
    {
      path: '*',
 
      element: <PageNotFound />
    },
 
    {
      path: 'postedjob',
 
      element: <PostedJobs />
    },
 
    {
      path: 'job-details',
 
      element: <ShowallDetails />
    },
 
    {
      path: 'user-details',
 
      element: <UserDetails /> //
    },
    {
      path: 'posterdata',
 
      element: <Posterdata /> //
    },
    {
      path: 'notification',
 
      element: <NotificationList /> //
    },

    {
      path: 'advertisement',
      element: <Advertisement /> //
    },
 
    {
      path: 'utils',
 
      children: [
        {
          path: 'subscribtion',
 
          element: <ViewAllSubscribe />
        },
 
        {
          path: 'editsubscribtion',
 
          element: <EditSubscribe />
        },
//
        {
          path: 'addnewplan',
 
          element: <AddNewplan />
        },
        {
          path: 'addreview',
 
          element: <AddNewReviews />
        }, //
        {
          path: 'sitereview',
 
          element: <Sitereview />
        },
        {
          path: 'topcategory',
 
          element: <Topcategory />
        },
        {
          path: 'addtopcategory',
 
          element: <AddTopcategory />
        },
        {
          path: 'addnewsubadmin',
 
          element: <Addnewsubadmin />
        },
        {
          path: 'extracategoryamount',
 
          element: <Extracategoryamount />
        }
      ]
    },//
 
    {
      path: 'utils',  
 
      children: [
        {
          path: 'staticpage',
 
          element: <Viewstatic />
        },
 
        {
          path: 'util-staticUpdate',
 
          element: <EditStaticdata />
        },
 
        {
          path: 'util-addStatsdata',
 
          element: <AddStaticdata />
        },
 
        {
          path: 'questionAnswer',
 
          element: <QuestionAnswerlist />
        },
        {
          path: 'aboutuspage',
 
          element: <Aboutuspagelist />
        },
 
        {
          path: 'addqa',
 
          element: <AddQuestionAnswer />
        },
 
        {
          path: 'homepagecontent',
 
          element: <HomePageContent />
        },
 
        {
          path: 'updateuser',
 
          element: <UpdateUser />
        },
        {
          path: 'allcategory',
 
          element: <Allcategory />
        },
        {
          path: 'editcategory',
 
          element: <Editcategory />
        },
        {
          path: 'addnewcategory',
 
          element: <Addnewcategory />
        },
        {
          path: 'cantectus',
 
          element: <Updatecantectus />
        },
        {
          path: 'applinkUpdate',
 
          element: <UpdateapplinkUpdate />
        },
        {
          path: 'editProduct',
 
          element: <UpdateProduct/>
        },
        {
          path: 'subadminlist',
 
          element: <Subadminlist/>
        },
        {
          path: 'updateposte',
 
          element: <Updateposte />
        }
      ]  //editProduct
    },
 
    {
      path: 'viewqualification',
 
      element: <QualificationPage />
    },
    {
      path: 'addaccess',
 
      element: <Addaccess />
    },
    {
      path: 'product',
      element: <ProductPage />
    },
 
    {
      path: 'product',
      element: <ProductPage />
    },
 
    {
      path: 'viewProduct',
 
      element: <ViewProductPage /> //
    },
 
    {
      path: 'viewpilotdata',
 
      element: <ViewpilotdataPage />
    },
    {
      path: 'sendmessage',
 
      element: <SendmessagePage />
    },
    {
      path: 'meta-listing',
 
      element: <MetaListing />
    }
 
  ]
};
 
//
 
export default MainRoutes;