import React, { useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import dronelogo from '../../assets/images/whitedrone.svg';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';
import mailicon from '../../assets/images/mail.png';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [page, setPage] = useState('emailVerify');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passShown, setPassShown] = useState(false);
  const [passShown1, setPassShown1] = useState(false);

  const navigate = useNavigate();

  const [value, setValue] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleSubmit = async () => {
    setLoading(true);
    if (page == 'emailVerify') {
      if (value.email.trim() == '') {
        toastifyError('Please Enter Email');
        setLoading(false);
        return false;
      }
      const params = { email: value.email };
      try {
        const res = await axiosInstance.post(`/user/forgotPassword`, params);
        console.log(res);
        if (res?.data?.status == 200) {
          setPage('verifyOtp');
          setLoading(false);
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false);
        }
      } catch (error) {
        toastifyError(error?.response?.data?.message);
        console.log(error);
        setLoading(false);
      }
    } else if (page == 'verifyOtp') {
      const otpString = otp.join('');
      if (otpString.trim() == '') {
        toastifyError('Please Enter Otp');
        setLoading(false);
        return false;
      }
      const params = { email: value.email, otp: otpString };
      try {
        const res = await axiosInstance.post(`/user/verifyOtpPassword`, params);
        if (res?.data?.status == 200) {
          setPage('changePassword');
          setLoading(false);
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false);
        }
      } catch (error) {
        toastifyError(error?.response?.data?.message);
        console.log(error);
        setLoading(false);
      }
    } else if (page == 'changePassword') {
      if (value.password.trim() == '') {
        toastifyError('Please Enter New Password');
        setLoading(false);
        return false;
      }
      if (value.confirmPassword.trim() == '') {
        toastifyError('Please Enter Conform Password');
        setLoading(false);
        return false;
      }
      if (value.password != value.confirmPassword) {
        toastifyError('Conform Password Not Match With New Password');
        setLoading(false);
        return false;
      }
      const params = { email: value.email, password: value.password };
      try {
        const res = await axiosInstance.post(`/user/updatePasswordOfUser`, params);
        if (res?.data?.status == 200) {
          toastifySuccess('Password Changed Successfully !!');
          setLoading(false);
          navigate('/login');
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false);
        }
      } catch (error) {
        toastifyError(error?.response?.data?.message);
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
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
  return (
    <div>
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
                {page === 'emailVerify' ? (
                  <>
                    <Row>
                      <h2>Forgot Password</h2>
                      <Col md="12" className="mb-3">
                        <div className="group  error">
                          <input
                            className="inputMaterial"
                            type="text"
                            placeholder="Enter your Email Address"
                            onChange={(e) => {
                              setValue({ ...value, email: e.target.value });
                            }}
                          />
                          <span className="bar"></span>
                          <label htmlFor="first Name">Email </label>
                        </div>
                      </Col>
                      <div className="">
                        {loading ? (
                          <button className="sign_in front_btn ">Loading ...</button>
                        ) : (
                          <button className="sign_in front_btn " onClick={() => handleSubmit()}>
                            Continue
                          </button>
                        )}
                      </div>
                    </Row>
                  </>
                ) : page == 'verifyOtp' ? (
                  <Row>
                    <div className="for_forgot">
                      <img src={mailicon} alt="" style={{ maxWidth: '', maxHeight: '' }} />
                    </div>
                    <p>Enter the code we just sent to Your Gmail</p>
                    <h2>Update your password</h2>

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
                        <button className="sign_in front_btn ">Loading ...</button>
                      ) : (
                        <button className="sign_in front_btn " onClick={() => handleSubmit()}>
                          Continue
                        </button>
                      )}
                    </div>
                  </Row>
                ) : page == 'changePassword' ? (
                  <>
                    <Row>
                      <h2>Forgot Password</h2>
                      <Col md="12" className="mb-3">
                        <div className="group  error">
                          <input
                            className="inputMaterial"
                            type={!passShown ? 'password' : 'text'}
                            placeholder="Enter your New Password"
                            onChange={(e) => {
                              setValue({ ...value, password: e.target.value });
                            }}
                          />
                          <span className="bar"></span>
                          <label htmlFor="first Name">New Password </label>
                          <button className="eye_btn" onClick={() => setPassShown(!passShown)}>
                            <RemoveRedEyeIcon />
                          </button>
                        </div>
                      </Col>
                      <Col md="12" className="mb-3">
                        <div className="group  error">
                          <input
                            className="inputMaterial"
                            type={!passShown1 ? 'password' : 'text'}
                            placeholder="Enter Confirm Password"
                            onChange={(e) => {
                              setValue({ ...value, confirmPassword: e.target.value });
                            }}
                          />
                          <span className="bar"></span>
                          <label htmlFor="first Name">Confirm Password </label>
                          <button className="eye_btn" onClick={() => setPassShown1(!passShown1)}>
                            <RemoveRedEyeIcon />
                          </button>
                        </div>
                      </Col>
                      <div className="">
                        {loading ? (
                          <button className="sign_in global_btn">Loading ...</button>
                        ) : (
                          <button className="sign_in global_btn" onClick={() => handleSubmit()}>
                            Continue
                          </button>
                        )}
                      </div>
                    </Row>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ForgotPassword;