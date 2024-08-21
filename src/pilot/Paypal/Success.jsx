import React from 'react'
import { Grid, Typography } from '@mui/material';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation } from '../../../node_modules/react-router-dom/dist/index';
import fail from '../../assets/images/fail.gif';
import success from '../../assets/images/success-icon.gif';
const Success = () => {
    const PlanDetails = useLocation();
    const PlanDetailsData = PlanDetails.state ? PlanDetails.state.data : null;

    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{ mt: 3.25 }}>
                    <Typography variant="h5" className="global_top_head">
                        Plans
                    </Typography>
                </Grid>
                <div className=" plans_box inner_pricing pricing_main bg-white w-100">
                    <section className="flex_plans">
                        <Container>
                            <Row className="mt-2 justify-content-center">
                                {
                                    PlanDetailsData?.transaction_id !== undefined ?
                                        <>
                                            <Col md="6">
                                                <div className="payement_box box text-capitalize">
                                                    <h6 className='text-center succes_gif mb-3'><img src={success} alt='' /></h6>
                                                    <h4 className='text-center text-success suces_txt'> {PlanDetailsData?.amount == 0 ? 'Your free plan now activated' : 'Payment Successful'}</h4>
                                                    <p className='mb-1'><strong>Transaction ID : </strong>{PlanDetailsData?.transaction_id}</p>
                                                    <p className='mb-1'><strong>Transaction Date : </strong>{PlanDetailsData?.date}</p>

                                                    <hr></hr>
                                                    <p className='mb-1'><strong>Plan Name : </strong>{PlanDetailsData?.plan_name}</p>
                                                    <p className='mb-1'><strong>Total Amount : </strong> ${PlanDetailsData?.amount} AUD</p>

                                                </div>
                                                
                                            </Col>
                                        </>
                                        :
                                        <>
                                            <Col md="6">
                                                <div className="payement_box box text-capitalize">
                                                    <h6 className='text-center faild_gif'><img src={fail} alt='' /></h6>
                                                    <h4 className='text-center stuest_txt'>Failed</h4>
                                                    <p>Oops! It looks like there was an issue processing your payment. We apologize for any inconvenience caused. Please double-check your payment details and try again. If the problem persists, feel free to contact our support team for assistance.</p>
                                                    <h4 className='text-success'>Thank you for your patience!</h4>
                                                </div>
                                            </Col>
                                        </>

                                }

                              <div className='go_dahboard mt-3'>  <Link to="/user/dashboard/default" className='global_btn'>Go to Dashboard</Link></div>
                            </Row>
                        </Container>
                    </section>
                </div>
            </Grid>
        </>
    )
}

export default Success