import React, { useEffect, useRef, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { axiosInstance } from 'Utility/Api';
import { encryptLocalStorageData, jobPostExportFun, toastifyError, toastifySuccess } from 'Utility/Utility';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '../../node_modules/@mui/material/index';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import posterimg from '../assets/images/userselect (1).png';
import pilotimg from '../assets/images/userselect (2).png';
import mailicon from '../assets/images/mail.png';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
const searchOptions = {
  componentRestrictions: { country: 'AU' }
};
const RegisterFirst = ({ setAuthFormType }) => {
    const [currentForm, setCurrentForm] = useState("first")
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [receiveEmail, setReceiveEmail] = useState(false);
    const [passShown, setPassShown] = useState(false);

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [role, setRole] = useState('');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    const [otherFormData, setOtherFormData] = useState({
        location: "",
        lat: "",
        long: ""
    })

    const userData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        role: role,
        receive_email: receiveEmail,
        location: otherFormData?.location,
        lat: otherFormData?.lat,
        long: otherFormData?.long,
    };


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
                    setCurrentForm("otp")
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
                    if (localStorage?.getItem("jobData")) {
                        jobPostExportFun(navigate)
                    } else {
                        navigate(`/user/dashboard/default`);
                        toastifySuccess('Account Created');
                    }
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

    const handleregistration = () => {
        if (otherFormData?.location.trim() == '') {
            setError((prevValues) => {
                return { ...prevValues, ['location']: 'Required.' };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ['location']: true };
            });
        }
        if (email.trim() == '') {
            setError((prevValues) => {
                return { ...prevValues, ['email']: 'Required.' };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ['email']: true };
            });
        }
        const emailRegex = /^[a-zA-Z0-9._+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email);
        if (!isValid && email !== '') {
            setError((prevValues) => {
                return { ...prevValues, ['email']: 'Please enter valid email.' };
            });
            return false;
        }
        if (password.trim() === '') {
            setError((prevValues) => {
                return { ...prevValues, ['password']: 'Required' };
            });
            return false;
        } else if (password.length < 8) {
            toastifyError('Password must be at least 8 characters long.');
            setError((prevValues) => {
                return { ...prevValues, ['password']: 'Password must be at least 8 characters long.' };
            });
            return false;
        } else if (!hasStrongPassword(password)) {
            setError((prevValues) => {
                return { ...prevValues, ['password']: <>Consider using a stronger password with a mix of uppercase, lowercase letters, numbers, and special characters. <button className='px-1' style={{ outline: 'none', border: 'none', boxShadow: '0px 0px 2px #000' }} onClick={generateStrongPassword}>Generate Password <ContentCopyIcon style={{ width: '18px', marginLeft: '2px' }} /> </button></> }
            });
            return false;
        }
        setCurrentForm("second")
    };

    function hasStrongPassword(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{8,}$/;
        return strongPasswordRegex.test(password);
    }

    const [error, setError] = useState({
        email: '',
        password: ''
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
        <>
            {
                currentForm === "first" ?
                    <Row>
                         <div className="col-12">
                        <p className='alert-sign-up-text'> <i className="fa-solid fa-circle-info"></i> One last step! Log in or register to instantly receive quotes from pilots in your area.</p>
                    </div>
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
                            <button className="sign_in front_btn " onClick={handleregistration}>
                                Next
                            </button>
                        </Col>
                        <Col md="12">
                            <div className="more_optio">
                                <p>Or</p>
                            </div>
                        </Col>

                        <p className="text-center">
                            Already have an account?{' '}
                            <span className="hightlight_txt">
                                <Link to="#" onClick={() => setAuthFormType("")}>Sign-In</Link>
                            </span>
                        </p>
                    </Row>
                    :
                    currentForm === "second" ?
                        <>
                            <Row>
                                <p>Step 2 of 2</p>
                                <h1 className='h1_title mb-5'>Create an account</h1>
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
                                        <Link to="#" onClick={() => setAuthFormType("")}>Login</Link>
                                    </span>
                                </p>

                            </Row>
                        </>
                        :
                        <>
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
                        </>
            }
        </>
    )
}

export default RegisterFirst