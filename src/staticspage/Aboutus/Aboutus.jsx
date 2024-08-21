import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import Whitedrone from '../../assets/images/whitedrone.png';
// import Firstd from '../../assets/images/about (1).png';
// import Secd from '../../assets/images/about (2).png';
import { useState, useEffect } from 'react';
import config from "config";
import Breacrumb from 'staticspage/Header/Breacrumb';
const Aboutus = () => {

  const [staticdata, setStaticdata] = useState([]);
  console.log(staticdata, "dhhd")
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/admin/getaboutdata`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        //   Authorization: `Bearer ${localStorage.jwt}`
        // },

      }).then((res) => {
        return res.json()
      })
        .then((data) => {

          if (data.message === "get data successfully") {
            // console.log(data)
            setStaticdata(data.getaboutus);
            // setloading(false);
          }
          // setloading(false);
        });
    } catch (error) {
      console.log(error);
      // setloading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <>
      <div className="aboutpage">
      <Breacrumb />


        <section className="about_cnt">
          <Container>
            <Row className="align-items-center">
              <Col md="6">
                <div className="main_global_heading">
                  <p>{staticdata?.title}</p>

                  <h2>{staticdata?.heading}</h2>

                </div>

                <div dangerouslySetInnerHTML={{ __html: staticdata?.ptag }} />
              </Col>

              <Col md="6">
                <div className="ab_images">
                  <Row>
                    <Col md="6" className="first">
                      <img
                        src={staticdata?.image_one}
                        alt={"First"}
                        style={{ maxWidth: '', maxHeight: '' }}
                      />
                    </Col>
                    <Col md="6" className="first">
                      <img
                        src={staticdata?.image_two}
                        alt={"2nd"}
                        style={{ maxWidth: '', maxHeight: '' }}
                      />
                    </Col>

                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Aboutus;
