// material-ui

import { Box, Typography } from '@mui/material';

import NavGroup from './NavGroup';

import menuItem from 'menu-itemspilot';

import menuItems1 from 'menu-itemsposter/index';
import { GuestTab } from 'menu-itemspilot/utilities';
import { getAllLocatData } from 'Utility/Utility';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  // const { pathname } = useLocation();
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (getAllLocatData()?.user_type == 'Pilot') {
  //     if (pathname == '/user/jobs' || pathname == '/user/markeplace/1' || pathname == '/user/market-place-list') {
  //       if (getAllLocatData().subcription_type == 'free') {
  //         toastifyError("You Don't Have a Plan To Visit this Page")
  //         navigate('/user/plans')
  //       }
  //     }
  //   }
  // }, [pathname])

  const role = localStorage.getItem('user_type')
  const guest = {
    'items': [GuestTab]
  }
  const tabs = role == 'Poster' ? menuItems1 : role == 'Pilot' ? menuItem : guest;

  const subscriptionType = getAllLocatData().subcription_type;
  const subscriptionID = getAllLocatData().subcription_id;
  const userType = getAllLocatData().user_type;
  const excludedTabs = ['Add Market Place', 'Jobs', 'Market Place List', 'Chats'];
  const mytabs = () => {
    const filterPostedData = tabs.items[0]?.children.filter((item) => {
      return (
        userType !== 'Pilot' ||
        !excludedTabs.includes(item.title) ||
        (subscriptionType !== 'free' && subscriptionID !== '' && excludedTabs.includes(item.title))
      );
    });
    return filterPostedData
  }
  const newTabs = {
    items: [
      {
        id: "utilities",
        type: "group",
        children: mytabs()
      }
    ]
  }
  console.log("newTabs=",newTabs)

  const navGroups = tabs?.items?.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;

      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
