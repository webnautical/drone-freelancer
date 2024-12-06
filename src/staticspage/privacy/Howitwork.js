import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState, useEffect } from 'react';
import config from 'config';
import signupimg from '../../assets/images/signup.png';
import submit from '../../assets/images/booking.png';
import plan from '../../assets/images/payment.png';
import job from '../../assets/images/jobs.png';
import Breacrumb from 'staticspage/Header/Breacrumb';
import droneblue from '../../assets/images/droneblue.png'
import doneimg from '../../assets/images/done.png'
import howimage from '../../assets/images/how.jpg'
import howimagesec from '../../assets/images/how.webp'
const Howitwork = () => {
  const [staticdata, setStaticdata] = useState([]);
  const [changetitle, setChangeTitle] = useState()
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/admin/getStaticdatabyUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'how-it-works'
        })
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'Data get successfully') {
            // console.log(data)
            setStaticdata(data?.getdatas[0]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="faq_page">
        <Breacrumb />
        <section className="faq how_we_work">
          <Container>
            {
              changetitle == "poster" ?
                <div className="main_global_heading mb-5">
                  <h3> Join Us</h3>
                  <h2>Join our drone service community for all needs.</h2>
                </div>
                :
                <div className="main_global_heading mb-5">
                   <h3>
                   How It Works 
                   </h3>
                  <h2> Get Your Project Done Today  </h2>
                </div>
            }

<div className="outer_div text-center">
  <Tabs
    defaultActiveKey="profile"
    transition={false}
    id="noanim-tab-example"
    onClick={(e) => setChangeTitle(e.target.innerHTML)}
  >
    <Tab eventKey="profile" title="poster">
      <div className="steps_work">
        <Row className="justify-content-center">
          <Col md={12}>
            <Row>
              <Col md={3}>
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={signupimg} alt="" />
                  </div>
                  <h2>Join Us</h2>
                  <p>Join our drone service community for all needs.</p>
                </div>
              </Col>

              <Col md={3}>
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={submit} alt="" />
                  </div>
                  <h2>Create Your Poster Account</h2>
                  <p>Create an account. Access skilled drone pilots fast.</p>
                </div>
              </Col>

              <Col md={3}>
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={doneimg} alt="" />
                  </div>
                  <h2>Complete Profile</h2>
                  <p>Describe your needs for best pilot matches.</p>
                </div>
              </Col>

              <Col md={3}>
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={job} alt="" />
                  </div>
                  <h2>Start Posting</h2>
                  <p>Post project. Set budget. Our pilots are ready.</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Tab>
    <Tab eventKey="home" title="pilot">
      <div className="steps_work">
        <Row className="justify-content-center">
          <Col md={12}>
            <Row>
              <Col md={6} lg={3} className="mb-3">
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={signupimg} alt="" />
                  </div>
                  <h2>Join Us</h2>
                  <p>Join our drone pilot community for exciting jobs.</p>
                </div>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={submit} alt="" />
                  </div>
                  <h2>Create Your Pilot Profile</h2>
                  <p>Free Sign Up. Create your skill-showcasing profile.</p>
                </div>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={plan} alt="" />
                  </div>
                  <h2>Complete Form</h2>
                  <p>Add details for better job matches.</p>
                </div>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <div className="step_how_work_box text-center">
                  <div className="icon">
                    <img src={droneblue} alt="" />
                  </div>
                  <h2>Take Flight</h2>
                  <p>Bid on jobs and elevate your drone career.</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Tab>
  </Tabs>
</div>


            <Row className="justify-content-between ">
              <Col md="6">
                <div className="faq_cnt">
                  <div>
                    <p>{staticdata?.title}</p>
                    <div>
                      {staticdata.content ? (
                        <>
                          {/* <p>{staticdata.content}</p> */}
                          <div dangerouslySetInnerHTML={{ __html: staticdata?.content }} />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Col>

              <Col md="6">
              <div className='side_how_image'>
              <img className='w-100 mb-3' src={howimage} alt="" />

              <img className='w-100 mb-3' src={howimagesec} alt="" />
            
              </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Howitwork;
