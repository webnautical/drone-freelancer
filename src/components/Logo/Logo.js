// material-ui
// import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //
import logos from '../../assets/images/dornedashboard.png';
const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Drone Matchmaker" width="100" />
     *
     */
    <>
      <div className="drone_sidebar_logo">
        <img src={logos} alt="Drone Matchmaker" width="" />
      </div>
    </>
  );
};

export default Logo;
