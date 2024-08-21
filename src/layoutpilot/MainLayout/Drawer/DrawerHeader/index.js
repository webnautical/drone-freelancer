import PropTypes from 'prop-types';
 
// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';
 
// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { Link } from '../../../../../node_modules/react-router-dom/dist/index';
// import config from 'config';
// import Logo from 'components/Logo';
import logo from '../../../../assets/images/dornedashboard.png'
// ==============================|| DRAWER HEADER ||============================== //
 
const DrawerHeader = ({ open }) => {
  const theme = useTheme();
 
  return (
    <DrawerHeaderStyled className="p-0" theme={theme} open={open}>
      <Stack direction="row" alignItems="center">
        <Link to={'/'} className='drone_sidebar_logo'>
          <img src={logo} alt="logo" />
        </Link>
      </Stack>
    </DrawerHeaderStyled>
  );
};
 
DrawerHeader.propTypes = {
  open: PropTypes.bool
};
 
export default DrawerHeader;