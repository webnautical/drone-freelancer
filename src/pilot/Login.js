import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
// import Googlelogo from "../assets/images/search.png";
import dronelogo from '../assets/images/whitedrone.svg';
// import Facebooklogo from "../assets/images/facebook.png";
import '../App.css';
// import { DataContext } from 'context/DataContext';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import config from 'config';
import { encryptLocalStorageData, toastifyError } from 'Utility/Utility';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function Login() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState('');
  const [passShown, setPassShown] = useState(false);
  const [loginCheck, setLoginCheck] = useState({
    'show': false,
    'type': '',
    'msg': '',
  })

  const handlelogin = (e) => {
    e.preventDefault();
    setLoading(true);
    if (email.trim() == '') {
      toastifyError('Please Provide Email');
      setLoading(false);
      return false;
    }
    if (password.trim() == '') {
      toastifyError('Please Enter Password');
      setLoading(false);
      return false;
    }

    if (localStorage.getItem('jwt')) {
      setOpen(true)
      setLoading(false);
      return false
    }

    const formdata = { email, password };
    fetch(`${config.url}/user/loginUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data?.status == 400) {
          toastifyError(data.message);
          setLoading(false);
          return false;
        }
        if (data.userrecord != null) {
          if (data?.userrecord?.status == "Reject") {
            setLoginCheck({
              ...loginCheck,
              'show': true, 'type': 'Reject', 'msg': (
                <>
                  <p className='mx-5'>We regret to inform you that your <strong>request</strong> has been <strong>rejected</strong> after reviewing your profile. If you have any questions or would like further assistance, please contact our support team at <Link to={'mailto:support@dronefreelancer.com.au'}>support@dronefreelancer.com.au</Link></p>
                </>
              )
            })
            setLoading(false)
            return false
          }
          if (data?.userrecord?.status == "Deleted") {
            setLoginCheck({
              ...loginCheck,
              'show': true, 'type': 'Deleted', 'msg': (
                <>
                  <p className='mx-5'>We regret to inform you that your <strong>account</strong> has been <strong>hold</strong> after reviewing your profile. If you have any questions or would like further assistance, please contact our support team at <Link to={'mailto:support@dronefreelancer.com.au'}>support@dronefreelancer.com.au</Link></p>
                </>
              )
            })
            setLoading(false)
            return false
          }
          localStorage.setItem('login_id', data.userrecord._id);
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user_type', data.userrecord.role);
          localStorage.setItem('loginname', data?.userrecord?.first_name);
          localStorage.setItem('loginstatus', '1');
          localStorage.setItem('img', data?.userrecord?.image);
          const dataParam = {
            login_id: data.userrecord._id,
            jwt: data.token,
            user_type: data.userrecord.role,
            loginname: data?.userrecord?.first_name,
            loginstatus: '1',
            img: data?.userrecord?.image,
            subcription_id: data?.userrecord?.subcription_id,
            subcription_type: data?.userrecord?.subscription_type
          };
          encryptLocalStorageData('web-secret', dataParam, 'DoNotTryToAccess');
          setTimeout(() => {
            navigate('/', { replace: true });
            // toastifySuccess('Login Successfully');
            setLoading(false)
          }, 2000);

          // if (data.userrecord.role === 'Pilot') {
          //   setTimeout(() => {
          //     navigate('/marketplace', { replace: true });
          //     toastifySuccess('Login Successfully');
          //     setLoading(false)
          //   }, 2000);
          // } else if (data.userrecord.role === 'Poster') {
          //   localStorage.setItem('popup', true)
          //   setTimeout(() => {
          //     navigate('/marketplace', { replace: true });
          //     localStorage.setItem('popup', true)
          //     toastifySuccess('Login Successfully');
          //     setLoading(false)
          //   }, 2000);
          // }


          // else if (data.userrecord.role === 'Guest') {
          //   setTimeout(() => {
          //     navigate('/user/dashboard/default', { replace: true });
          //     navigate('/user/dashboard/default', { replace: true });
          //     toastifySuccess('Login Successfully');
          //   }, 2000);
          // }
        } else {
          toastifyError(data.message);
          setLoading(false)
        }
      });
  };
  return (
    <div className="user_enter">
      <Container>
        <Row className="main_container">
          <Col lg="6" className="text-center">
            <div className="main_logo">
              <Link to={'/'}>
                <img src={dronelogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
              </Link>
            </div>
          </Col>
          <Col lg="6">
            <div className="user_first">
              <form onSubmit={handlelogin} method='post'>
                <Row>
                  <h2>Sign in</h2>
                  <p>New User ?{' '}<span className="hightlight_txt"><Link to="/register">Create an account</Link></span></p>

                  <Col md="12" className="mb-3">
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder="drone@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />

                      <span className="bar"></span>

                      <label htmlFor="first">Email </label>
                    </div>
                  </Col>

                  <Col md="12" className="mb-3">
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type={!passShown ? 'password' : 'text'}
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />

                      <span className="bar"></span>

                      <label htmlFor="first">Password </label>

                      <button className="eye_btn" type='button' onClick={() => setPassShown(!passShown)}>
                        {!passShown ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                      </button>
                    </div>

                    <div className="hightlight_txt text-end">
                      <Link to="/forgot">Forgot Password</Link>
                    </div>
                  </Col>

                  <Col md="12" className="">
                    {loading ? (
                      <>
                        <button className="sign_in front_btn" disabled>
                          Loading...
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="sign_in front_btn" onClick={handlelogin}>
                          Sign in
                        </button>
                      </>
                    )}
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
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
                  <p className='mx-5'>You Are already login as <span className='fw-bold'>{localStorage.getItem('user_type')}</span> in same browser</p>
                  <h6>Thank you!</h6>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button className='chat_btn' onClick={() => { localStorage.getItem('user_type') == 'admin' ? navigate('/admin/dashboard/default') : navigate('/user/dashboard/default') }}>Continue As {localStorage.getItem('user_type')}</button>
              <button className='chat_btn' onClick={() => { localStorage.clear(); setOpen(false) }}>{localStorage.getItem('user_type')} Logout</button>
            </DialogActions>
          </Dialog>
        </>

        <>
          <Dialog
            open={loginCheck.show}
            onClose={() => setLoginCheck({ ...loginCheck, show: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
            fullscreen
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p className='text-center'><strong>{"Dear User,"}</strong></p>
                <div className='text-center'>
                  <div>
                    {loginCheck.msg}
                  </div>
                  <h6 className='text-success'>Thank you!</h6>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
      </Container>
    </div>
  );
}

export default Login;