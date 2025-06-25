import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import dronelogo from '../assets/images/whitedrone.svg';
import '../App.css';
import LoginCom from 'auth-components/LoginCom';
function Login() {
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
                <LoginCom />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;