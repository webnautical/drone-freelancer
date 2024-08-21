import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
 
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
 
// project imports
// import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
// import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU } from 'store/actions';
 
// assets
// import { IconChevronRight } from '@tabler/icons';
 
// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -drawerWidth,
      width: `100%`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: -drawerWidth,
      width: `100%`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: -drawerWidth,
      width: `100%`,
      padding: '16px',
      marginRight: '10px'
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      // marginLeft: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      // marginLeft: '10px'
    }
  })
}));
 
// ==============================|| MAIN LAYOUT ||============================== //
 
const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };
 
  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}
      {/* header */}
 
      <Header open={leftDrawerOpened} className="sedssds" handleDrawerToggle={handleLeftDrawerToggle} />
 
      {/* drawer */}
      {/* <Header open={open} handleDrawerToggle={handleLeftDrawerToggle} /> */}
      {/* <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
 
      {/* main content */}
      <Main
  theme={theme}
  open={leftDrawerOpened}
  className={`admin_main ${leftDrawerOpened ? 'drawer-opened-class' : 'drawer-remove-class'}`}
>
  <Box sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
    {/* <Toolbar /> */}
    {/* <Breadcrumbs navigation={navigation} title /> */}
    <Outlet />
  </Box>
</Main>
 
    </Box>
  );
};
 
export default MainLayout;