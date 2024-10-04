import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import contact from '../../assets/images/contactus.jpg';
// import Whitedrone from '../../assets/images/whitedrone.png';
// import breadcrumbImage from '../../assets/images/breadcrumb.png';
// import multiimage from '../../assets/images/multi.png';
import { useState, useEffect } from 'react';
import config from 'config';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { axiosInstance } from 'Utility/Api';
import Breacrumb from 'staticspage/Header/Breacrumb';
const Contactus = () => {
  const [staticdata, setStaticdata] = useState([]);
  const getData = async () => {
    try {
      fetch(`${config.url}/admin/getContectUs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        return res.json();
      }).then((data) => {
        if (data.message === 'get data successfully') {
          setStaticdata(data.getContectUs);
        }
      });
    } catch (error) { console.log(error); setStaticdata([]) }
  };

  useEffect(() => {
    getData();
  }, []);

  const [submitMsg, setSubmitMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState({
    'name': '',
    'email': '',
    'message': ''
  })
  const handleChange = (e) => {
    setValue({
      ...value, [e.target.name]: e.target.value
    })
  }
  const [error, setError] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    if (value.name.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['name']: true };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['name']: false };
      });
    }
    if (value.email.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['email']: true };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['email']: false };
      });
    }
    if (value.message.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['message']: true };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['message']: false };
      });
    }
  }
  const { name, email, message } = error;
  useEffect(() => {
    if (name === false && email === false && message === false) {
      handleSubmit();
    }
  }, [addUpdateApiCallCount, name, email, message]);

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.post(`/user/contactQuery`, value);
      if (res.data.status == 200) {
        setTimeout(() => {
          setSubmitMsg('success')
          setLoading(false)
          setValue({ ...value, name: '', email: '', message: '' })
          setTimeout(() => {
            setSubmitMsg('')
          }, 5000)
        }, 1000);
      }
    } catch (error) {
      console.log(error)
    }


  }

  return (
    <div className="contactus_page">
      <Breacrumb />


      <section className="location_office">
        <Container>
          <div className="main_global_heading">
            <p>{staticdata?.title}</p>
            <h2>{staticdata?.heading}</h2>
          </div>

          <div className="mt-5">
            <Row>
              <Col md={4} className="mt-5 ">
                <div className="contact_box">
                  <div className="icon_boxee">
                    <ForwardToInboxIcon />
                  </div>
                  <h2>Email</h2>
                  <p>{staticdata?.email || 'Dronmatchmaker@gmail.com'}</p>
                </div>
              </Col>
              <Col md={4} className="mt-5 ">
                <div className="contact_box">
                  <div className="icon_boxee">
                    <CallIcon />
                  </div>
                  <h2>Phone</h2>
                  <p>{staticdata?.phone || 'Dronmatchmaker@gmail.com'}</p>
                </div>
              </Col>
              <Col md={4} className="mt-5 ">
                <div className="contact_box">
                  <div className="icon_boxee">
                    <LocationOnIcon />
                  </div>
                  <h2>Office Location</h2>
                  <p>{staticdata?.location || 'Dronmatchmaker@gmail.com'}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="get_in_touch">
        <Container>
          <Row>
            <Col lg={6} className="text-start">
              <div className="main_global_heading">
                <p>Lets connect </p>
                <h2>Get In Touch</h2>
              </div>

              <div className="form_contact mt-4">
                <input type="text"
                  placeholder="Name"
                  name='name'
                  style={{ border: error.name ? '2px solid red' : '' }}
                  value={value.name}
                  onChange={handleChange}
                />
                {/* <span className="errmsg">{error.name}</span> */}
              </div>
              <div className="form_contact mt-4">
                <input type="text" placeholder="Email"
                  name='email'
                  style={{ border: error.email ? '2px solid red' : '' }}
                  value={value.email}
                  onChange={handleChange} />
              </div>
              <div className="form_contact mt-4">
                <textarea placeholder="your Query"
                  name="message"
                  style={{ border: error.message ? '2px solid red' : '' }}
                  value={value.message}
                  onChange={handleChange} cols="30" rows="10"></textarea>
              </div>

              <div className="form_contact mt-2">
                <button className="front_btn mb-3" onClick={validateFun}> {loading ? <> <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...</> : 'Submit'} </button>

                {
                  submitMsg == 'failed' ?
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      Something went wrong, Try again !!
                    </Alert>
                    :
                    submitMsg == 'success' ?
                      <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Your message submitted succesfully !!
                      </Alert>
                      :
                      <></>
                }
              </div>
            </Col>
            <Col lg={6} className="text-start">
              <div className="contact_img_left_side">
                <img src={staticdata?.image} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="who_we_are">
        <Container>
          <Row className="align-items-center">
            <Row className="mt-4 align-items-center">
              <Col lg={6}>
                <div className="img_contact">
                  <img src={staticdata?.who_we_are?.image} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                  {/* <img src={multiimage} alt="" style={{ maxWidth: '', maxHeight: '' }} /> */}
                </div>
              </Col>
              <Col lg={6}>
                <div className="right_who">
                  <div className="main_global_heading text-start">
                    <p>{staticdata?.who_we_are?.title}</p>
                    <h2>{staticdata?.who_we_are?.heading}</h2>
                  </div>
                  <div className="content">
                    {/* <p>{staticdata?.who_we_are?.heading}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: staticdata?.who_we_are?.ptag }} />
                  </div>
                </div>
              </Col>
            </Row>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contactus;
