import React, { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import mailicon from '../../assets/images/mail.png';
import dronelogo from '../../assets/images/whitedrone.svg';
import Radio, { radioClasses } from '@mui/joy/Radio';

import RadioGroup from '@mui/joy/RadioGroup';

import Sheet from '@mui/joy/Sheet';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import posterimg from '../../assets/images/userselect (1).png';

import pilotimg from '../../assets/images/userselect (2).png';

import Typography from '@mui/material/Typography';

import { encryptLocalStorageData, toastifyError, toastifySuccess } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';

const Signuptwo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRecord = location.state;
  const [password] = useState(userRecord.password);
  const [email] = useState(userRecord.email);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(true)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const userData = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    role: role,
    receive_email: userRecord?.receiveEmail,
  };

  const [randomOTP, setRandomOTP] = useState('')
  const handleform = async () => {
    if (first_name.trim() == '') {
      toastifyError('Please enter your firstname');
      return false;
    }
    if (last_name.trim() == '') {
      toastifyError('Please enter your lastname');
      return false;
    }
    if (role.trim() == '') {
      toastifyError('Please select your role');
      return false;
    }
    const sixDigitOTP = Math.floor(100000 + Math.random() * 900000);
    setRandomOTP(sixDigitOTP.toString());
    setLoading(true)
    try {
      const params = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "otp": sixDigitOTP.toString()
      }
      const res = await axiosInstance.post(`/user/registerotpsend`, params);
      if (res.status == 200) {
        setTimeout(() => {
          setPage(false)
          setLoading(false)
        }, 1000);
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      if (error.response?.data?.status == 400) {
        toastifyError(error.response?.data?.message)
        setLoading(false)
      }
    }
  };

  const inputRefs = useRef([]);
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const verifyUserWithOTP = async () => {
    setLoading(true)
    const otpString = otp.join('');
    if (randomOTP != otpString) {
      toastifyError("Please Enter Valid OTP for verification !!")
      setLoading(false)
      return false
    }
    try {
      const res = await axiosInstance.post(`/user/registerUser`, userData);
      if (res?.data?.status === 200) {
        localStorage.setItem('login_id', res?.data.userrecord._id);
        localStorage.setItem('jwt', res?.data.token);
        localStorage.setItem('user_type', res?.data.userrecord.role);
        localStorage.setItem('loginname', res?.data?.userrecord?.first_name);
        localStorage.setItem('loginstatus', '1');
        const dataParam = {
          login_id: res?.data.userrecord._id,
          jwt: res?.data.token,
          user_type: res?.data.userrecord.role,
          loginname: res?.data?.userrecord?.first_name,
          loginstatus: '1',
          subcription_id: res?.data?.userrecord?.subcription_id,
          subcription_type: res?.data?.userrecord?.subscription_type
        };
        encryptLocalStorageData('web-secret', dataParam, 'DoNotTryToAccess');
        if (res?.data?.userrecord?.role == 'Pilot') {
          navigate(`/user/dashboard/default`);
          toastifySuccess('Account Created');
        }
        if (res?.data?.userrecord?.role == 'Poster') {
          if(userRecord?.job_title){
            navigate('/page?v=business-employment-portal', {state : {portalData : userRecord}})
          }else{
            navigate(`/user/dashboard/default`);
          }
          toastifySuccess('Account Created');
        }
      } else if (res?.data.message === 'Email already in use!') {
        toastifyError('This Email is already Register');
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      toastifyError('Server : Something went wrong !!');
      setLoading(false)
    }
  }


  return (
    <div className="sign_up_two signup_enter user_enter">
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
              {
                page ?
                  <Row>
                    <p>Step 2 of 2</p>
                    <h2>Create an account</h2>
                    <Col md="6" className="mb-3">
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Enter your First Name"
                          value={first_name}
                          onChange={(e) => {
                            setFirst_name(e.target.value);
                          }}
                        />
                        <span className="bar"></span>
                        <label htmlFor="first">First Name </label>
                      </div>
                    </Col>
                    <Col md="6" className="mb-3">
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Enter Your Last Name"
                          value={last_name}
                          onChange={(e) => {
                            setLast_name(e.target.value);
                          }}
                        />
                        <span className="bar"></span>
                        <label htmlFor="first">Last Name </label>
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="select_account_type text-center">
                        <h2>Select Your Account Type</h2>
                        <RadioGroup
                          aria-label="platform"
                          defaultValue="Website"
                          overlay
                          name="platform"
                          sx={{
                            flexDirection: 'row',
                            gap: 2,
                            [`& .${radioClasses.checked}`]: {
                              [`& .${radioClasses.action}`]: {
                                inset: -1,
                                border: '3px solid',
                                borderColor: 'primary.500'
                              }
                            },
                            [`& .${radioClasses.radio}`]: {
                              display: 'contents',
                              '& > svg': {
                                zIndex: 2,
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                bgcolor: 'background.surface',
                                borderRadius: '50%'
                              }
                            }
                          }}
                        >
                          {[
                            { value: 'Poster', label: 'Poster' },
                            { value: 'Pilot', label: 'Pilot' }
                            // { value: 'Guest', label: 'Guest' }
                          ].map((option) => (
                            <Sheet
                              key={option.value}
                              variant="outlined"
                              sx={{
                                borderRadius: 'md',
                                boxShadow: 'sm',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                minWidth: 120
                              }}
                            >
                              <Radio
                                id={option.value}
                                value={option.value}
                                onChange={(e) => {
                                  setRole(e.target.value);
                                }}
                                checkedIcon={<CheckCircleRoundedIcon />}
                                sx={{
                                  borderRadius: '50%'
                                }}
                              />
                              {
                                option.value === 'Poster' ? (
                                  <img src={posterimg} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                                ) : option.value === 'Pilot' ? (
                                  <img src={pilotimg} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                                ) : (
                                  <></>
                                )
                              }

                              <Typography variant="body2" color="text.primary">
                                {option.label}
                              </Typography>
                            </Sheet>
                          ))}
                        </RadioGroup>
                      </div>
                    </Col>

                    <Col md="12" className="">
                      {loading ? (
                        <button className="sign_in front_btn "><div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...</button>
                      ) : (
                        <button className="sign_in front_btn " onClick={handleform}>Submit</button>
                      )}
                    </Col>

                    <Col md="12">
                      <div className="more_optio">
                        <p>Or</p>
                      </div>
                    </Col>

                    <p className="text-center">
                      Already have an account?{' '}
                      <span className="hightlight_txt">
                        <Link to="/login">Login</Link>
                      </span>
                    </p>

                  </Row>
                  :
                  <Row>
                    <div className="for_forgot">
                      <img src={mailicon} alt="" style={{ maxWidth: '', maxHeight: '' }} />
                    </div>
                    <p className='m-0'>Enter the code we just sent to your email</p>
                    <h2 className='mb-4'>Verify your email</h2>

                    <Col md="12" className="mb-3">
                      <div className="otp-input">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(input) => (inputRefs.current[index] = input)}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength="1"
                          />
                        ))}
                      </div>
                    </Col>
                    <div className="">
                      {loading ? (
                        <button className="sign_in front_btn "><div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...</button>
                      ) : (
                        <button className="sign_in front_btn" onClick={verifyUserWithOTP}>
                          Verify
                        </button>
                      )}
                    </div>
                  </Row>
              }
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signuptwo;