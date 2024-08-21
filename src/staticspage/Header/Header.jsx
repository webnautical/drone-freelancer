import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import dronelogo from '../../assets/images/whitedrone.svg';
import dronedash from '../../assets/images/dronematchmaker.svg';
import { Link } from 'react-router-dom';
import '../../assets/css/stylefront.css';
import { defaultUserIMG, getAllLocatData } from 'Utility/Utility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Header = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [mopen, setOpen] = React.useState(false);

  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function getInitials(fullName) {
    const names = fullName?.split(' ');
    if (names) {
      const firstInitial = names[0].charAt(0).toUpperCase();
      const lastInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    }
  }
  const LogedUserShortName = getInitials(localStorage.getItem('loginname'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const pageRedirect = (url) => {
    if (url == 'logout') {
      localStorage.clear();
      navigate('/');
    } else {
      if (localStorage.getItem('user_type') === 'admin') {
        navigate('/admin/dashboard/default');
      } else {
        navigate(url);
      }
    }
  };

  const getQuetesCall = () => {
    if (!getAllLocatData()?.jwt) {
      navigate('/login');
    } else {
      if (getAllLocatData()?.user_type == 'Pilot') {
        setOpen(true);
      } else {
        navigate('/user/postjob');
      }
    }
  };

  console.log(path

  )

  return (
    <>
      <header className={`front_design your-header-class ${scrolling ? 'scrolled' : ''}`}>
        <Navbar expand="lg">
          <Container fluid>
            <Navbar.Brand href="/">
              <img className="first_logo" src={dronelogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
              <img className="sec_logo" src={dronedash} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />

            {/* Customized Navbar.Collapse */}
            <Navbar.Collapse id="navbarScroll">
              <div className="custom-navbar-collapse">
                <Nav className="m-auto my-2 my-lg-0" navbarScroll>
                  <Link to="/" className={`${path == '/' && 'active'}`}>Home</Link>
                  <Link to="/how-it-works" className={`${path == '/how-it-works' && 'active'}`}>How It Works</Link>

                  <Link to="/pilot-map" className={`${path == '/pilot-map' && 'active'}`}>Pilot Map</Link>
                  <Link to="/pilot-directory" className={`${path == '/pilot-directory' && 'active'}`}>Pilot Directory</Link>
                  <Link to="/animal-rescue" className={`${path == '/animal-rescue' && 'active'}`}>Animal Rescue</Link>
                  <Link to="/plans" className={`${path == '/plans' && 'active'}`}>Plans</Link>

                  <Link to="/marketplace" className={`${path == '/marketplace' && 'active'}`}>Marketplace</Link>

                  <Link to="/page?v=business-employment-portal" className={`${path == '/page' && 'active'}`}>Business Employment</Link>


                  {/* <Link to="/faq" className={`${path == '/faq' && 'active'}`}>FAQ</Link> */}
                  {/* <Link to="/about" className={`${path == '/about' && 'active'}`}>About</Link>
                  <Link to="/contact-us" className={`${path == '/contact-us' && 'active'}`}>Contact</Link> */}
                </Nav>
                <div className="side_btn p-0">

                  {
                    getAllLocatData()?.user_type == 'Poster' &&
                    <button className="front_btn get_quotes" onClick={() => getQuetesCall()}>Post a Job</button>
                  }

                  {localStorage.getItem('login_id') ? (
                    <>
                      {/* <Link className="user_log_in p-0" to="/user/dashboard/default">
                      <img className='me-1' src={localStorage.getItem('img') ? localStorage.getItem('img') : defaultUserIMG} alt="" style={{ height: '30px', width: '30px', borderRadius: '100%' }} />
                      <span className='me-1'>{LogedUserShortName}</span>
                      <ExpandMoreIcon />
                    </Link> */}

                      <Tooltip className="header_drw">
                        <IconButton
                          onClick={handleClick}
                          size="small"
                          sx={{ ml: 2 }}
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <img
                            className="me-1"
                            src={localStorage.getItem('img') ? localStorage.getItem('img') : defaultUserIMG}
                            alt=""
                            style={{ height: '35px', width: '35px', borderRadius: '100%', objectFit: 'contain', background: '#fff' }}
                          />
                          <span className="name_arrow me-1 text-white">
                            {LogedUserShortName} <ExpandMoreIcon />
                          </span>
                        </IconButton>
                      </Tooltip>

                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0
                            }
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={() => pageRedirect(`/user/dashboard/default`)}><i className="fa-solid fa-chart-line me-3" style={{color:'#757575'}}></i> Dashboard</MenuItem>
                        <Divider />
                        <MenuItem onClick={() => pageRedirect('logout')}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Link className="front_btn global_btn" to="/login">
                        Join / Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Dialog
        open={mopen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Only Poster can get a quote.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;