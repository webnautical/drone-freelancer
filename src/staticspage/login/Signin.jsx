import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Googlelogo from '../../assets/images/search.png';
import dronelogo from '../../assets/images/dronelogo.png';
import Facebooklogo from '../../assets/images/facebook.png';

const Signin = () => {
  return (
    <div className="user_enter">
      <Container>
        <Row className="main_container">
          <Col lg="6" className="text-center">
            <div className="main_logo">
              <img src={dronelogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
            </div>
          </Col>
          <Col lg="6">
            <div className="user_first">
              <Row>
                <h2>Sign in</h2>
                <p>
                  New User ? <span className="hightlight_txt">Create an account</span>
                </p>
                <Col md="12" className="mb-3">
                  <div class="group  error">
                    <input className="inputMaterial" type="text" placeholder="drone@gmail.com" />
                    <span class="bar"></span>
                    <label>Email </label>
                  </div>
                </Col>
                <Col md="12" className="mb-3">
                  <div class="group  error">
                    <input className="inputMaterial" type="password" placeholder="Enter Your Password" />
                    <span class="bar"></span>
                    <label>Password </label>
                  </div>
                  <div className="text-end">
                    <button className="forgot_pass">Forgot Password</button>
                  </div>
                </Col>

                <div md="12" className="">
                  <button className="sign_in front_btn ">Sign in</button>
                </div>

                <div md="12">
                  <div className="more_optio">
                    <p>Or</p>
                  </div>
                </div>

                <Col md="12">
                  <ul className="login_with">
                    <li>
                      {' '}
                      <img src={Googlelogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                    </li>
                    <li>
                      {' '}
                      <img src={Facebooklogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signin;