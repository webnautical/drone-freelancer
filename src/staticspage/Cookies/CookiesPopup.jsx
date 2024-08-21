// CookiesPopup.js

import React, { useState, useEffect } from 'react';
import {Container } from "react-bootstrap";
import { Link } from '../../../node_modules/react-router-dom/dist/index';


const CookiesPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('cookiesAccepted');
    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', true);
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="cookies-popup">
    <Container>
    <div className="cookies-popup-content align-items-center">
          <p className='m-0'>Dronefreelancer uses cookies to improve your experience. By using our site, you agree to our <Link to="/privacy&cookies">Cookies Policy</Link></p>
          <button onClick={acceptCookies}>Accept All Cookies</button>
        </div>
    </Container>
      </div>
    )
  );
};

export default CookiesPopup;
