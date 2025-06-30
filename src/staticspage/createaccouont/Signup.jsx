import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import dronelogo from '../../assets/images/whitedrone.svg';
import { toastifyError } from 'Utility/Utility';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { axiosInstance } from 'Utility/Api';
import { useLocation } from '../../../node_modules/react-router-dom/dist/index';
import { Typography } from '../../../node_modules/@mui/material/index';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
const searchOptions = {
  componentRestrictions: { country: 'AU' }
};
const Signup = () => {
  const navigate = useNavigate();
  const data = useLocation();
  const portalData = data.state ? data.state.data : null

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [receiveEmail, setReceiveEmail] = useState(false);
  const [passShown, setPassShown] = useState(false);
  const [otherFormData, setOtherFormData] = useState({
    location: "",
    lat: "",
    long: ""
  })

  const handleLocationSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setOtherFormData((prevValue) => ({
        ...prevValue,
        location: value,
        lat: latLng.lat,
        long: latLng.lng,
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };


  const handleLocationChange = (value) => {
    setOtherFormData((prevValue) => ({
      ...prevValue,
      location: value
    }));
  };

  const handleregistration = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedLocation = otherFormData?.location?.trim() || '';
    const emailRegex = /^[a-zA-Z0-9._+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let hasError = false;

    // Email validation
    if (trimmedEmail === '') {
      setError(prev => ({ ...prev, email: 'Required.' }));
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setError(prev => ({ ...prev, email: 'Please enter valid email.' }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, email: true }));
    }

    // Location validation
    if (trimmedLocation === '') {
      setError(prev => ({ ...prev, location: 'Required.' }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, location: true }));
    }

    // Password validation
    if (trimmedPassword === '') {
      setError(prev => ({ ...prev, password: 'Required' }));
      hasError = true;
    } else if (trimmedPassword.length < 8) {
      toastifyError('Password must be at least 8 characters long.');
      setError(prev => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
      hasError = true;
    } else if (!hasStrongPassword(trimmedPassword)) {
      setError(prev => ({
        ...prev,
        password: (
          <>
            Consider using a stronger password with a mix of uppercase, lowercase letters, numbers, and special characters.
            <button
              className="px-1"
              style={{ outline: 'none', border: 'none', boxShadow: '0px 0px 2px #000' }}
              onClick={generateStrongPassword}
            >
              Generate Password <ContentCopyIcon style={{ width: '18px', marginLeft: '2px' }} />
            </button>
          </>
        ),
      }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, password: true }));
    }

    // Abort if there's any validation error
    if (hasError) return;

    const finalData = { email: trimmedEmail, password: trimmedPassword, receiveEmail, ...otherFormData, ...portalData };
    navigate('/registers', { state: finalData });
  };


  function hasStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{8,}$/;
    return strongPasswordRegex.test(password);
  }

  const [error, setError] = useState({
    email: '',
    password: '',
    location: ""
  })

  const generateStrongPassword = () => {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%&';
    let password = '';

    const randomUpperCaseChar = upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    password += randomUpperCaseChar;

    const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += randomNumber;

    const randomSpecialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    password += randomSpecialChar;

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * lowerCaseChars.length);
      password += lowerCaseChars[randomIndex];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(password);
    navigator.clipboard.writeText(password);

  };

  const [textData, setTextData] = useState({})
  useEffect(() => {
    getText()
  }, [])

  const getText = async () => {
    try {
      const res = await axiosInstance.post('/admin/getExtraPricedata')
      if (res?.data?.status == 200) {
        setTextData(res?.data?.getdatas[0])
      } else {
        setTextData({})
      }
    } catch (error) {
      setTextData({})

    }
  }
  const handleCehckBox = (e) => {
    const isChecked = e.target.checked;
    setReceiveEmail(isChecked)
  }

  return (
    <div className="signup_enter user_enter">
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
              <Row>
                <p>Step 1 of 2</p>
                <h1 className='h1_title mb-5'>Create an account </h1>


                <Col md="12" className="mb-2">
                  <div className="location_search group  error">
                    <PlacesAutocomplete
                      value={otherFormData.location}
                      searchOptions={searchOptions}
                      onChange={handleLocationChange}
                      onSelect={handleLocationSelect}
                    >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="location_input">
                          <span className="top_text">Location</span>
                          <input className='mb-0' {...getInputProps({ placeholder: 'Type address' })} />
                          <div className="autocomplete-dropdown-container">
                            {loading ? <div className="mt-2">Loading...</div> : null}
                            {suggestions?.map((suggestion) => {
                              const style = {
                                backgroundColor: suggestion.active ? 'whitesmoke' : '#fff',
                                padding: '10px 10px',
                                cursor: 'pointer'
                              };
                              return (
                                <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                                  {suggestion.description}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                    <span className="bar"></span>
                    <span className="errmsg">{error.location}</span>
                  </div>
                </Col>

                <Col md="12" className="mb-3">
                  <div className="group  error pb-0 mb-2">
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
                  <span className='mt-0 pt-0 text-danger'>{error.email}</span>
                </Col>

                <Col md="12" className="mb-3 mt-3">
                  <div className="group error pb-0 mb-2">
                    <input
                      className="inputMaterial"
                      placeholder="Enter Your Password"
                      value={password}
                      type={!passShown ? 'password' : 'text'}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">Password </label>
                    <button className="eye_btn" onClick={() => setPassShown(!passShown)}>
                      <RemoveRedEyeIcon />
                    </button>
                  </div>
                  <span className='mt-0 pt-0 text-danger'>{error.password}</span>
                </Col>

                <Col md="12" className="mb-2 mt-0">
                  <FormControl className="check_select_outer mb-0">
                    <FormControlLabel
                      control={<Checkbox onChange={handleCehckBox} />}
                      label={
                        <Typography style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '400', color: '#000', fontsize: '14px!important' }}>
                          {textData?.agreeCheckbox}
                        </Typography>
                      }
                    />
                  </FormControl>
                </Col>

                <Col md="12" className="mb-3 mt-0">
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px!important', fontWeight: '400', color: '#000', }}>By creating an account you agree to Drone Freelancer&apos;s <Link to={'/terms-condition'}>Terms & Conditions</Link></p>
                </Col>

                <Col md="12" className="">
                  <button className="sign_in front_btn " onClick={handleregistration}>Next</button>
                </Col>
                <Col md="12">
                  <div className="more_optio"><p>Or</p></div>
                </Col>

                <p className="text-center">
                  Already have an account?{' '}
                  <span className="hightlight_txt">
                    <Link to="/login">Sign-In</Link>
                  </span>
                </p>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;