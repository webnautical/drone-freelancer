import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
 
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { drawerWidth } from 'store/constant';
 
import { Box, useMediaQuery } from '@mui/material';
 
// project import
import Drawer from './Drawer';
import Header from './Header';
// import navigation from 'menu-items';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
 
// types
import { openDrawer } from 'stores/reducers/menu';
 
// ==============================|| MAIN LAYOUT ||============================== //
 
// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
 
  width: 'calc(100% - 60px)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
 
  [theme.breakpoints.down('sm')]: {
    width: `100%`,
  },
  ...(open && {
    // marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));
 
const MainLayout = () => {
  const theme = useTheme();
  // console.log(openDrawer,"sjsjsj")
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
 
  const { drawerOpen } = useSelector((state) => state.menu);
 
  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
 
  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);
 
  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);
 
  return (
    <Box sx={{ display: 'flex', width: '100%' }} className="hello">
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
      <Main open={open} theme={theme} handleDrawerToggle={handleDrawerToggle}>
      <Box  component="main"  sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        {/* <Toolbar /> */}
        {/* <Breadcrumbs navigation={navigation} title /> */}
        <Outlet />
      </Box>
      </Main>
    </Box>
  );
};
 
export default MainLayout;