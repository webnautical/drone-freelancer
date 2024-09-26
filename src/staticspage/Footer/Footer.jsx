import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import dronelogo from '../../assets/images/whitedrone.svg';
import { Link } from 'react-router-dom';
import yellowphoto from '../../assets/images/yellow.png'
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <div className="footer_outer">
          <Row>
            <Col md="4">
              <div className="logo_footer">
                <img src={dronelogo} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                <div>
                <a href="https://www.knowyourdrone.gov.au" target="_blank" rel="noopener noreferrer">
                  <img src={yellowphoto} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img mt-3" />
                </a>
                </div>
              </div>
            </Col>
            <Col md="4">
              <div className="quick_links">
                <h2>Quick Links</h2>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                  <Link to="/contact-us" >Contact Us</Link>
                  </li>
                  {/* <li>How We Work</li> */}
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                 
                  <li>
                    {' '}
                    <Link to="/how-it-works">How It Works</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md="4">
              <div className="quick_links ">
                {/* <h2 className="invisible">Quick Links</h2> */}
                <ul>
                  <li>
                    <Link to="/privacy&cookies">Privacy & Cookies Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms-condition">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/why-drone-freelancer">Why Drone Freelancer</Link>
                  </li>
                  <li>
                  <a href="https://www.knowyourdrone.gov.au" target="_blank" rel="noopener noreferrer">Know Your Drone (by CASA)</a>


                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="copyright">
    

          Copyright © {currentYear} Drone Freelancer - Developed by <a href="https://webnautical.com/">Webnautical</a>
        </div>
      </Container>
    </footer>
  );
};
 
export default Footer;