
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PaymentIcon from '@mui/icons-material/Payment';
import config from 'config';
import AttractionsIcon from '@mui/icons-material/Attractions';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  // title: 'Utilities',
  type: 'group',
  children: [
    {
      
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: `${config.basename}/dashboard/default`,
        icon: LineAxisIcon,
        breadcrumbs: false
     
    },
    {
      id: 'user-mangement',
      title: 'User Management',
      type: 'collapse',
      icon: AttractionsIcon,
      children: [
        {
          id: 'user-pilot',
          title: 'Pilot Request ',
          type: 'item',
          url: `${config.basename}/utils/pilot`,
          breadcrumbs: false
        },
        {
          id: 'user',
          title: 'All Approved Pilot List',
          type: 'item',
          url: `${config.basename}/utils/usermangement/approved`,
          breadcrumbs: false
        },
        {
          id: 'free-member',
          title: 'All Free Members',
          type: 'item',
          url: `${config.basename}/utils/usermangement/free-members`,
          breadcrumbs: false
        },
        {
          id: 'silver-member',
          title: 'Silver Members',
          type: 'item',
          url: `${config.basename}/utils/usermangement/silver-members`,
          breadcrumbs: false
        },
        {
          id: 'gold-member',
          title: 'Gold Members',
          type: 'item',
          url: `${config.basename}/utils/usermangement/gold-members`,
          breadcrumbs: false
        },
        {
          id: 'expired',
          title: 'Expire Members',
          type: 'item',
          url: `${config.basename}/utils/usermangement/expired`,
          breadcrumbs: false
        },
        {
          id: 'poster',
          title: 'Poster List',
          type: 'item',
          url: `${config.basename}/utils/posterlist`,
          breadcrumbs: false
        },
       
        {
          id: 'deleted-user',
          title: 'Rejected Pilot',
          type: 'item',
          url: `${config.basename}/utils/deleted-user`,
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'product',
      title: 'Manage Marketplace',
      type: 'item',
      url: `${config.basename}/product`,
      icon: StorefrontIcon    
    },
    {
      id: 'postedjob',
      title: 'Posted jobs',
      type: 'item',
      url: `${config.basename}/postedjob`,
      icon: PostAddIcon
    },
    // {
    //   id: 'awardedjob',
    //   title: 'Awarded jobs',
    //   type: 'item',
    //   url: `${config.basename}/awardedjob`,
    //   icon: BlockIcon
    // },
    
    {
      id: 'transaction',
      title: 'Transactions',
      type: 'item',
      url: `${config.basename}/utils/otpverify`,
      icon: AttachMoneyIcon
      // children: [
      //   {
      //     id: 'transaction',
      //     title: 'All Transaction',
      //     type: 'item',
      //     url: `${config.basename}/utils/alltransaction`,
      //     breadcrumbs: false
      //   },
      //   // {
      //   //   id: 'transaction-pilot',
      //   //   title: 'Approved Pilot ',
      //   //   type: 'item',
      //   //   url: `${config.basename}/utils/pilot`,
      //   //   breadcrumbs: false
      //   // }
      // ]
    },
    // {
    //   id: 'subadminlist',
    //   title: 'Sub Admin',
    //   type: 'item',
    //   url: `${config.basename}/utils/subadminlist`,
    //   icon: SupervisorAccountIcon
    // },
    {
      id: 'subscribtion',
      title: 'Manage Plan',
      type: 'item',
      url: `${config.basename}/utils/subscribtion`,
      icon: PaymentIcon
      // children: [
      //     {
      //       id: 'subscribtion',
      //       title: 'View All Plan',
      //       type: 'item',
      //
      //       breadcrumbs: false
      //     },
      // ]
    },
    {
      id: 'fulltimejobrequest',
      title: 'Business employment portal',
      type: 'item',
      url: `${config.basename}/utils/fulltimejobrequest`,
      icon: PaymentIcon
   
    },
    {
      id: 'animalrescue',
      title: 'Animal Rescue',
      type: 'item',
      url: `${config.basename}/utils/animal-rescue`,
      icon: PaymentIcon
    },
    {
      id: 'advertisement',
      title: 'Advertisement',
      type: 'item',
      url: `${config.basename}/advertisement`,
      icon: FeaturedVideoIcon
    },
    {
      id: 'setting',
      title: 'Edit Pages',
      type: 'collapse',
      // url: `${config.basename}/utils/subscribtion`,
      icon: AppRegistrationIcon,
      children: [
        {
          id: 'staticpage',
          title: 'Content Pages',
          type: 'item',
          url: `${config.basename}/utils/staticpage`,
          breadcrumbs: false
        },
        {
          id: 'questionAnswer',
          title: 'FAQ',
          type: 'item',
          url: `${config.basename}/utils/questionAnswer`,
          breadcrumbs: false
        },
        {
          id: 'homepagecontent',
          title: 'Edit Home Page',
          type: 'item',
          url: `${config.basename}/utils/homepagecontent`,
          breadcrumbs: false
        },
        {
          id: 'aboutuspage',
          title: 'Edit About Us',
          type: 'item',
          url: `${config.basename}/utils/aboutuspage`,
          breadcrumbs: false
        },
        {
          id: 'sitereview',
          title: 'Manage Reviews',
          type: 'item',
          url: `${config.basename}/utils/sitereview`,
          breadcrumbs: false
        },
        // {
        //   id: 'topcategory',
        //   title: 'Top category',
        //   type: 'item',
        //   url: `${config.basename}/utils/topcategory`,
        //   breadcrumbs: false
        // },
        {
          id: 'category',
          title: 'All category',
          type: 'item',
          url: `${config.basename}/utils/allcategory`,
          breadcrumbs: false
        },
        {
          id: 'cantectus',
          title: 'Contact Us',
          type: 'item',
          url: `${config.basename}/utils/cantectus`,
          breadcrumbs: false
        },
        {
          id: 'applinkUpdate',
          title: 'App Link Update',
          type: 'item',
          url: `${config.basename}/utils/applinkUpdate`,
          breadcrumbs: false
        },
        {
          id: 'extracategoryamount',
          title: 'Set Radius Price',
          type: 'item',
          url: `${config.basename}/utils/extracategoryamount`,
          breadcrumbs: false
        }
      ] //ApplinkUpdate
    },
    {
      id: 'web-settings',
      title: 'Web Settings',
      type: 'collapse',
      icon: SettingsIcon,
      children: [
        {
          id: 'metatags',
          title: 'Meta Tags',
          type: 'item',
          url: `${config.basename}/meta-listing`,
          breadcrumbs: false
        },
      ] 
    }
  ]
};

export default utilities;
