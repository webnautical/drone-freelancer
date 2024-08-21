import { TextField, Grid } from '@mui/material';
// import LoginIcon from '@mui/icons-material/Login';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
 
import config from 'config';
// import { Paper } from '@mui/material';
import './App.css';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
 
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
// import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toastifyError,  } from 'Utility/Utility';
// import { ToastContainer } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
 
function LoginAdmin() {
 
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
 
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
 
    // const { loginname, setLoginname, loginstatus, setLoginstatus, login_id, setLogin_id } = useContext(DataContext);
    // const [jwt, setJwt] = useState(null);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 
    const [open, setOpen] = useState(false)
    const handlelogin = (e) => {
        setLoading(true);
        e.preventDefault();
        if (localStorage.getItem('jwt')) {
            setOpen(true)
            setLoading(false);
            return false
        }
        const formdata = { email, password };
        console.log(formdata)
        console.log(config.url, "hdhhd");
        fetch(`${config.url}/admin/adminlogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formdata)
        })
            .then((res) => {
 
                return res.json();
            })
            // if (res.status === 200) return Promise.all([res.json(), res.headers]);
            // else return Promise.reject('invalid login attempt!');
            .then((data) => {
                if (data.userrecord != null && data.userrecord.role == 'admin') {
 
                    localStorage.setItem('login_id', data.userrecord._id);
                    // setLogin_id(localStorage.getItem('login_id'));
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user_type', 'admin');
                    localStorage.setItem('password', password);
                    localStorage.setItem('loginname', data.userrecord.name);
                    // setLoginname(localStorage.getItem('loginname'));
                    localStorage.setItem('loginstatus', '1');
                    // toastifySuccess("Admin Login successfully!!")
                    navigate('/admin/dashboard/default', { replace: true });
                    setLoading(false)
                } else {
                    toastifyError(data.message)
                    // setMessage(data.message);
                    // toast.error(data.message, {
                    //     position: "top-center",
                    //     autoClose: 5000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "light",
                    //     });
                    setLoading(false)
                }
                setLoading(false)
            });
        // .catch((error) => {
        //     // alert('service error');
        //     console.log(error);
        // });
    };
    return (
        <div className='background_main_box'>
            <div className="App">
               
                <Grid className="dashboard_login" container sx={{ justifyContent: 'center' }}>
                    <Grid item xl={4} lg={4} md={6} sm={12} xs={12} className="bg-white p-4 rounded-3">
                       
                           <div className='text-center mb-3'> <Chip icon={<AccountCircleIcon className="btn-color" />} label="Admin Login" className="btn-color" /></div>
                           <Grid container spcing={2}>
                            <Grid item xl={12}  >
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    className="w-100 mb-3"
                                    label="Email Address"
                                    variant="standard"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
 
                            </Grid>
                            <Grid item xl={12}  >
                            <FormControl sx={{ width: '100%' }} variant="standard" margin="normal">
                                <InputLabel htmlFor="standard-adornment-password" required>
                                    Password
                                </InputLabel>
                                <Input
                                    fullWidth
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            </Grid>
                         
                            <Grid item xl={12}>
 
                                {loading ? (
                                    <>
                                        <Button className="admin_class sign_in front_btn mt-4" disabled>
                                            Loading...
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button fullWidth className="admin_class sign_in front_btn mt-4" onClick={handlelogin} >
                                            Login
                                        </Button>
                                    </>
                                )}
                            </Grid>
                            </Grid>
                        
                    </Grid>
                </Grid>
                <br />
                <br />
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
            </div>
        </div>
    );
}
 
export default LoginAdmin;