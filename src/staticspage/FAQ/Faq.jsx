import React from "react";
import { Col, Container, Row } from "react-bootstrap";
// import Whitedrone from "../../assets/images/whitedrone.png";
import Accordion from "react-bootstrap/Accordion";
// import Rightfaq from "../../assets/images/faqi.png";
// import Circleblue from "../../assets/images/faqc.png";
// import Header from "staticspage/Header/Header";
// import Footer from "staticspage/Footer/Footer";
import { useState, useEffect } from 'react';
import config from "config";
import { Link } from "../../../node_modules/react-router-dom/dist/index";
import Breacrumb from "staticspage/Header/Breacrumb";


const Faq = () => {
  const [staticdata, setStaticdata] = useState([]);
  // const [baner, setBaner] = useState([]);
  // const [setImage] = useState([]);
  console.log(staticdata, "dhhd")
  const [activeKey, setActiveKey] = useState(null);

  const handleAccordionToggle = (eventKey) => {
    // Toggle the active key to either open or close the accordion item
    setActiveKey(activeKey === eventKey ? null : eventKey);
  };

  const getData = async () => {

    try {
      fetch(`${config.url}/admin/getAllQuation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify({
          url: "about_us"
        })
      }).then((res) => {
        return res.json()
      })
        .then((data) => {

          if (data.message === "Get all Queation successfully") {
            // console.log(data)
            setStaticdata(data.getallquation[0].qa);
            // setBaner(data.getallquation[0].baner);
            // setImage(data.getallquation[0].image);
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

      <div className="faq_page">
      <Breacrumb />


        <section className="faq">
          <Container>
            <Row className="justify-content-center align-items-center">
              <Col md="8">
                <div className="faq_cnt ">
                  <div className="main_global_heading text-center">
                    {/* <p className="tex-center">FAQ</p> */}
                    <h2 className="tex-center">Frequently Asked Questions</h2>
                    <span className="text-dark">If you have more questions or need further assistance, feel free to contact our support team at  <Link to={'mailto:support@dronefreelanceer.com'}><strong>support@dronefreelanceer.com</strong></Link> , and we will be happy to help</span>
                  </div>
                  <div>

                    <div className="faq_cnt mt-4">
                      <Accordion activeKey={activeKey} onSelect={handleAccordionToggle} defaultActiveKey="0">
                        {staticdata.map((row, index) => (
                          <Accordion.Item key={index} eventKey={index.toString()}>
                            <Accordion.Header>{row.quetion}</Accordion.Header>
                            <Accordion.Body>
                              <div dangerouslySetInnerHTML={{ __html: row.answer }} />
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                  </div>

                </div>
              </Col>
              {/* <Col md="6" className="text-center">
                <div className="right_img">
                  <div className="circle">
                    <img
                      src={Circleblue}
                      alt="logo"
                      style={{ maxWidth: "", maxHeight: "" }}
                    />
                  </div>
                  <div className="img_box">
                    <img
                      src={image}
                      alt="logo"
                      style={{ maxWidth: "", maxHeight: "" }}
                    />
                  </div>
                </div>
              </Col> */}
            </Row>
          </Container>
        </section>
      </div>

    </>
  );
};

export default Faq;