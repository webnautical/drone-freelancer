import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import PilotRoutes from './PilotRoutes';
import posterRoutes from './PosterRoutes';
import GuestRoutes from './GuestRoutes';
import { useEffect, useState } from 'react';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
// ==============================|| ROUTING RENDER ||============================== //
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export default function ThemeRoutes() {
  const navigate = useNavigate()
  const userRole = localStorage.getItem('user_type');
  useEffect(() => {
    let timer;

    const logoutAfterInactivity = () => {
      localStorage.clear();
      navigate('/login') 
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logoutAfterInactivity, 3600000);
    };

    const handleActivity = () => {
      resetTimer();
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);

    resetTimer();

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      clearTimeout(timer);
    };
  }, [navigate]);

  // useLayoutEffect(() => {
  //   if(userRole == 'Pilot' || userRole == 'Poster'){
  //     navigate('/user/dashboard/default')
  //   }else if(userRole == 'admin'){
  //     navigate('/admin/dashboard/default')
  //   }
  // },[])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      navigate('/login')
    }
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        localStorage.clear();
        navigate('/login')
      }
      if (event.ctrlKey && event.keyCode === 56) {
        setOpen(true)
        // Ctrl + 8
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  let routes;
  if (userRole === 'Pilot') {
    routes = [PilotRoutes];
  } else if (userRole === 'Poster') {
    routes = [posterRoutes];
  } else if (userRole === 'Guest') {
    routes = [GuestRoutes];
  } else if (userRole === 'admin') {
    routes = [MainRoutes, LoginRoutes];
  } else {
    // Fallback route for unknown user roles
    // console.log("w")
    routes = []; // You may want to define a default route here
  }
  // console.log(routes)
  // Use the routes outside the conditional statement
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
        fullscreen
      >
        <DialogTitle id="alert-dialog-title">
          {"Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className='text-center'>
              <p className='mx-5'>Hey this  <span className='fw-bold'>Deepak Gupta</span> I am fullstack developer</p>
              <h6>Thank you!</h6>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className='chat_btn' onClick={() => { setOpen(false) }}>OK</button>
        </DialogActions>
      </Dialog>
      {useRoutes(routes)}
    </>
  );
}
