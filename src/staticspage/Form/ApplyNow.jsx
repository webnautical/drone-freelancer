import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { axiosInstance } from 'Utility/Api';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import succesimg from '../../../src/assets/images/success-icon.gif';
import { Link } from '../../../node_modules/react-router-dom/dist/index';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlacesAutocomplete from 'react-places-autocomplete';
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getClientSecretFun } from 'Utility/ExportFun';

const ApplyNow = ({ jobData }) => {
  const [successPage, setSuccessPage] = useState();
  const [paymentData, setPaymentData] = useState({});
  const [planDetails, setPlanDetails] = useState(null);
  const [invoiceModal, setInvoiceModal] = useState(false);

  const [invoiceCall, setInvoiceCall] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState(null)

  const [price, setPrice] = useState('');

  useEffect(() => {
    planDetailsFun();
  }, []);

  const planDetailsFun = async () => {
    try {
      const params = {
        user_type: 'poster'
      };
      const res = await axiosInstance.post('/admin/getSubscriptionPlan', params);
      console.log('API Response:', res.data); // Log the API response
      if (res?.data?.status === 200) {
        setPlanDetails(res?.data?.getsubscriptionpane[0]);
      } else {
        setPlanDetails(null);
      }
    } catch (error) {
      console.log('API Error:', error);
      setPlanDetails(null);
    }
  };

  useEffect(() => {
    if (planDetails && planDetails.amount) {
      console.log('Setting Price from planDetails:', planDetails.amount); // Log the planDetails
      setPrice(planDetails.amount);
    }
  }, [planDetails]);


  const createOrder = async (data, actions) => {
    setInvoiceCall(true)
    if (!price) {
      console.error('Price is not set!');
      return;
    }
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: price.toString(),
          },
        },
      ],
    });
  };
  const onSuccess = (details) => {
    console.log('Payment succeeded:', details);
  };

  const onError = (err) => {
    console.error('Error during payment:', err);
  };

  const onCancel = (data) => {
    console.log('Payment canceled:', data);
  };

  const onApprove = (data, actions) => {
    console.log('Payment approved:', data);
    return actions.order.capture().then((details) => {
      if (details.status == 'COMPLETED') {
        applyNow(details, 'paypal');
      }
    });
  };

  const applyNow = async (details,payment_method) => {
    setPaymentMethod(payment_method)
    const paypalParams = {
      transaction_id: details.id,
      paymentstatus: 'Success',
      plan_id: planDetails?._id,
      amount: planDetails?.amount,
      payment_method: payment_method,
      response_json: JSON.stringify(details)
    };
    const params = { ...paypalParams, ...jobData };
    try {
      const res = await axiosInstance.post('/user/fullTimejobPost', params);
      if (res?.data?.status == 200) {
        setSuccessPage('success');
        const data = res?.data?.createdata;
        setPaymentData({ ...paypalParams, ...data });
        toastifySuccess('Your business employment request has been submitted.');
      } else {
        setSuccessPage('failed');
        toastifyError('API : Something Went Wrong');
        setAmntLoading(false);
      }
    } catch (error) {
      console.log(error);
      toastifyError('API : Something Went Wrong');
    }
  };

  const [formData, setFormData] = useState({
    company_name: '',
    abn: '',
    first_name: '',
    last_name: '',
    address: '',
    email: ''
  });

  const [errors, setErrors] = useState({
    company_name: '',
    first_name: '',
    last_name: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    if (invoiceDetails) {
      setFormData({
        ...formData,
        'abn': invoiceDetails?.abn,
        'company_name': invoiceDetails?.company_name,
        'email': invoiceDetails?.email,
        'address': invoiceDetails?.address,
        'first_name': invoiceDetails?.first_name,
        'last_name': invoiceDetails?.last_name,
      })
    } else {
      setFormData({
        ...formData,
        company_name: '',
        abn: '',
        first_name: '',
        last_name: '',
        address: '',
        email: ''
      })
    }
  }, [invoiceDetails])


  const handleModal = () => {
    setInvoiceModal(!invoiceModal)
  }


  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };
  const handleLocationSelect = async (value) => {
    try {
      setFormData((prevValue) => ({
        ...prevValue,
        address: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };
  const handleLocationChange = (value) => {
    setFormData((prevValue) => ({
      ...prevValue,
      address: value
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';
    if (name === 'first_name') {
      errorMessage = value ? '' : 'First name is required';
    } else if (name === 'last_name') {
      errorMessage = value ? '' : 'Last name is required';
    } else if (name === 'email') {
      errorMessage = value ? '' : 'Email is required';
    } else if (name === 'address') {
      errorMessage = value ? '' : 'Address name is required';
    }
    setErrors({
      ...errors,
      [name]: errorMessage
    });
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const isFormFilled = () => {
    for (const key in formData) {
      if (key !== 'abn' && key !== 'company_name' && formData[key] === '') {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    getInvoiceDetailsFun()
    if (invoiceCall === true) {
      formDataBeforePayment()
    }
  }, [invoiceCall])
  const getInvoiceDetailsFun = async () => {
    try {
      const res = await axiosInstance.post('user/get_invoice_detail')
      if (res?.data?.status == 200) setInvoiceDetails(res?.data?.existingdata); else setInvoiceDetails(null)
    } catch (error) { console.error(error) }
  }
  const formDataBeforePayment = async () => {
    try {
      const res = await axiosInstance.post('user/create_invoice_detail', formData)
      if (res?.data === 200) return true; return false
    } catch (error) { console.error(error) }
  };


  const [payBtn, setPayBtn] = useState(false)
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const getClientSecret = async (price) => {
    const res = await getClientSecretFun(price);
    setClientSecret(res)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    console.log("payload", payload)
    if (payload?.paymentIntent?.status == "succeeded") {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      applyNow(payload.paymentIntent, "stripe");
      setProcessing(false);
      formDataBeforePayment()
    }
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
  };
  return (
    <>
      {successPage == 'success' ? (
        <>
          <Row className="justify-content-center">
            <Col className="" md="6">
              <div className="text-center mb-5">
                <img src={succesimg} alt="" />
              </div>
              <p>Transaction ID : {paymentData.transaction_id}</p>
              <p>Payment : <span className='text-capitalize'>{paymentMethod}</span></p>
              <p>Amount : ${paymentData.amount} AUD</p>
              <p>Transaction Date : {paymentData.createdAt}</p>
            </Col>
            <div className='text-center'>
              <div className='go_dahboard mt-3'>  <Link to="/user/dashboard/default" className='global_btn'>Go to Dashboard</Link></div>
            </div>
          </Row>
        </>
      ) : (
        <>
          <div className="form_heading">
            <h2>Business employement portal</h2>
            <p>Don t give up on your job. Let s do this.</p>
          </div>
          <Row className="">
            <Col md="4" className="mb-4">
              <div className="plan_benifits inner_box_form box text-capitalize">
                <h5 className="text-start" style={{ borderBottom: '1px solid #bbb' }}>
                  Plan Benefits
                </h5>
                <ul className="Points_benfits text-start p-0 mt-4">
                  {planDetails?.included_point?.map((item, i) => (
                    <li key={i}>
                      <KeyboardDoubleArrowRightIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col className="" md="8">
              <div className="inner_box_form order_summery box text-capitalize">
                <h5 className="text-start" style={{ borderBottom: '1px solid #bbb' }}>
                  Order Summary
                </h5>
                <table className="table table-striped">
                  <tr>
                    <td className="text-start">
                      <strong>Plan Type</strong>
                    </td>
                    <td className="text-start">{planDetails?.plan_type}</td>
                  </tr>
                  <tr>
                    <td className="text-start">
                      <strong>Job Title</strong>
                    </td>
                    <td className="text-start">{jobData?.job_title}</td>
                  </tr>
                  <tr>
                    <td className="text-start">
                      <strong>Job Type</strong>
                    </td>
                    <td className="text-start">{jobData?.job_type == 'part_time' ? 'Part Time' : 'Full Time'}</td>
                  </tr>

                  <tr>
                    <td className="text-start">
                      <strong>Amount payble</strong>
                    </td>
                    <td className="text-start">${planDetails?.amount} AUD</td>
                  </tr>
                </table>

                <div className="total_payble_amount">
                  <strong>Total Payable Amount : ${planDetails?.amount} AUD</strong>
                </div>
              </div>

              <div className="pay_btn_for_form text-end">
                <React.Fragment>
                  <Dialog
                    className="pop_uo_payment"
                    open={invoiceModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleModal}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle className="text-center top_tittle_form">
                      {"Payment Details"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        <div className="box_form">
                          <Row>
                            <Col md={6} className="mb-2">
                              <div className={`group error`}>
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="first_name"
                                  placeholder="Enter Your First Name"
                                  value={formData.first_name}
                                  onChange={handleChange}
                                />
                                <span className="bar"></span>
                                <label htmlFor="first">First Name</label>
                                <span className="errmsg">{errors.first_name}</span>
                              </div>
                            </Col>
                            <Col md={6} className="mb-2">
                              <div className={`group error`}>
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="last_name"
                                  placeholder="Enter Your Last Name"
                                  value={formData.last_name}
                                  onChange={handleChange}
                                />
                                <span className="bar"></span>
                                <label htmlFor="first">Last Name</label>
                                <span className="errmsg">{errors.last_name}</span>
                              </div>
                            </Col>


                            <Col md={6} className="mb-2">
                              <div className={`group error`}>
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="company_name"
                                  placeholder="Enter Your Company Name"
                                  value={formData.company_name}
                                  onChange={handleChange}
                                />
                                <span className="bar"></span>
                                <label htmlFor="first">Company Name (Optional)</label>
                                <span className="errmsg">{errors.company_name}</span>
                              </div>
                            </Col>

                            <Col md={6} className="mb-2">
                              <div className={`group error`}>
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="abn"
                                  placeholder="ABN"
                                  value={formData.abn}
                                  onChange={handleChange}
                                />
                                <span className="bar"></span>
                                <label htmlFor="first">ABN (Optional)</label>
                                <span className="errmsg">{errors.abn}</span>
                              </div>
                            </Col>


                            <Col md={12} className="mb-3">
                              <div className="marketplace location_search group error">
                                <PlacesAutocomplete
                                  value={formData.address}
                                  name="address"
                                  onChange={handleLocationChange}
                                  onSelect={handleLocationSelect}
                                  searchOptions={searchOptions}
                                >
                                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div className="location_input ">
                                      <span className="top_text">Address</span>
                                      <input {...getInputProps({ placeholder: 'Type address' })} />

                                      <div className="autocomplete-dropdown-container">
                                        {loading ? <div>Loading...</div> : null}
                                        {suggestions?.map((suggestion) => {
                                          const style = {
                                            backgroundColor: suggestion.active ? 'whitesmoke' : '#fff',
                                            padding: '10px 10px',
                                            cursor: 'pointer'
                                          };
                                          return (
                                            <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                                              {suggestion.description}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </PlacesAutocomplete>
                              </div>
                            </Col>


                            <Col md={12} className="mb-2 mt-4">
                              <div className={`group error`}>
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="email"
                                  placeholder="Enter Your Email"
                                  value={formData.email}
                                  onChange={handleChange}
                                />
                                <span className="bar"></span>
                                <label htmlFor="first">Email invoice to</label>
                                <span className="errmsg">{errors.email}</span>
                              </div>
                            </Col>

                            {!payBtn &&
                              <>
                                <div className="col-6">

                                  {
                                    planDetails &&
                                    <PayPalScriptProvider
                                      options={{ "client-id": "AVGl7uVRgL4EJorTFqWykbrX4Mqtcmow30S6z3vcvxMiQGA5r94ELvGfcnZfRGp31TwLW-OPdp79jxKJ" }}
                                    >
                                      <PayPalButtons
                                        className="paypal_btn text-center"
                                        style={{
                                          layout: "horizontal",
                                          color: "gold",
                                          padding: "10",

                                          label: "pay",
                                          tagline: false,
                                          height: 50,
                                          margin: "auto",
                                          align: "center",
                                        }}
                                        createOrder={createOrder}
                                        onSuccess={onSuccess}
                                        onError={onError}
                                        onCancel={onCancel}
                                        onApprove={onApprove}
                                        disabled={!isFormFilled()}
                                      />
                                    </PayPalScriptProvider>
                                  }
                                </div>
                                <div className="col-1"></div>
                                <div className="col-5 text-end">
                                  <button className="chat_btn" onClick={() => { setPayBtn(true); getClientSecret(price) }} style={{ padding: '13px 0px' }}>Pay With Stripe</button>
                                </div>
                              </>}


                            <div className="col-12">
                              {
                                payBtn &&
                                <form onSubmit={handleSubmit}>
                                  <CardElement className="card-stripe-element" />
                                  <button disabled={processing || succeeded} className="pay-stripe-button">
                                    {processing ? "Processing..." : `Pay $${price}`}
                                  </button>
                                  {error && <div className="stripe-error-msg">{error}</div>}
                                  <div className="mt-2">
                                    <p>Secure payments are handled by Stripe. We never even see your card details.</p>
                                  </div>
                                </form>
                              }
                            </div>
                          </Row>
                        </div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>

                <button className="global_btn" onClick={handleModal}>
                  Pay
                </button>

              </div>



            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ApplyNow;
