import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';
import droneLogo from '../../../assets/images/dornedashboard.png';
// project imports
import config from 'config';
import { MENU_OPEN } from 'store/actions';

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      <h6 className='admin_logo'>
        <img src={droneLogo} alt="logo" />
      </h6>
    </ButtonBase>
  );
};

export default LogoSection;
