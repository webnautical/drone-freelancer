
// import Button from '@mui/material/Button';
import { Col,  Row } from 'react-bootstrap';
import {  
  Grid,
 
} from '@mui/material';
import mailicon from './../assets/images/mail.png';

import {  useNavigate, } from 'react-router';
import {useEffect , useState,useRef } from 'react';
// import axios from 'axios';
import config from 'config';
// const theme = createTheme();

export default function OtpVerification() {
  const navigate = useNavigate();
  useEffect(() => {
    
    if(localStorage.getItem('admin_varify')){
        navigate(`${config.basename}/alltransaction`);
    }
},[])

 const [filteredData,setFilteredData] = useState('')
 const [otp, setOtp] = useState(['', '', '', '', '', '']);
 const [loading, setLoading] = useState(false);
 const inputRefs = useRef([]);
  const handleSubmit = () => {
    setLoading(true)
    const updatedUser = {
      otp:filteredData,
    };
    fetch(`${config.url}/admin/verifyOto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       // Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify(updatedUser)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === 'Otp verification succesfully') {
         localStorage.setItem('admin_varify', true)
          navigate(`${config.basename}/alltransaction`);
          setLoading(false)
        }
        setLoading(false)
      });
  };
  
  const getData = async () => {
    
    try {
      fetch(`${config.url}/admin/adminOtpsend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'Otp Send to your email address') {
            setFilteredData(data.otp);
           
          }else{
            setFilteredData("");
          }
        
        });
    } catch (error) {
      console.log(error);
    
    }
  };

 
  useEffect(() => {
    getData();
  }, []);




  console.log(filteredData,"filteredData")
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
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Verify Your email address</h2>
          
          <Row>
                    <div className="for_forgot">
                      <img src={mailicon} alt="" style={{ maxWidth: '', maxHeight: '' }} />
                    </div>
                    <p>Enter the code we just sent to Your Gmail</p>
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
        </Grid>
      </Grid>
    </div>
  );
}
