// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import '../../../../assets/css/stylepilot.css';
// import { Link } from '../../../../../node_modules/react-router-dom/dist/index';
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}
      {/* <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <Link to={'/marketplace'} className='chat_btn me-5' style={{ textDecoration: "none" }}>Marketplace</Link>
      </Box> */}

      <Notification />

      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
