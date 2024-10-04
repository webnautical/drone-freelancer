import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Whitedrone from '../../assets/images/whitedrone.png';

import { useState, useEffect } from 'react';
import config from 'config';
const Privacy = () => {
  const [staticdata, setStaticdata] = useState([]);
  console.log(staticdata, 'dhhd');
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/admin/getStaticdatabyUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'privacy'
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
        <section className="breacrumb"  
         style={{
          backgroundImage: `url(${staticdata?.image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          padding: '195px 0 120px',
        }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col md="8" className="text-center">
                <div className="bread_heading">
                  <h1 className='h1_title'>Privacy & Cookies Policy</h1>
                  <ul>
                    <li>Home</li>
                    <img src={Whitedrone} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                    <li>Privacy & Cookies Policy</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="faq">
          <Container>
            <Row className="justify-content-between align-items-center">
              <Col md="12">
                <div className="faq_cnt">
                  <div>
                    <p> {staticdata.title}</p>
                    <div>
                      {staticdata.content ? (
                        <>
                          <div dangerouslySetInnerHTML={{ __html: staticdata?.content }} />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Privacy;
