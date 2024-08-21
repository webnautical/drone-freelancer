import React from "react";
import { Col, Container, Row } from "react-bootstrap";
// import Whitedrone from "../../assets/images/whitedrone.png";
 
import {useState ,useEffect} from "react"
import config from "config";
import Breacrumb from "staticspage/Header/Breacrumb";
 
const Whydronmatchmaker = () => {
 
    const [staticdata, setStaticdata] = useState([]);
    const getData = async () => {
        // setloading(true);
        try {
            fetch(`${config.url}/admin/getStaticdatabyUrl`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: "why-drone-freelancer",
                })
 
            }).then((res) => {
                return res.json()
            })
                .then((data) => {
 
                    if (data.message === "Data get successfully") {
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

 
                <section className="faq">
                    <Container>
                        <Row className="justify-content-between align-items-center">
                            <Col md="12">
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
 
                        </Row>
                    </Container>
                </section>
            </div>
         
        </>
    );
};
 
export default Whydronmatchmaker;