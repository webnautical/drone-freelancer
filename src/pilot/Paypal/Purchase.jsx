import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import {
  useLocation,
  useNavigate,
} from "../../../node_modules/react-router-dom/dist/index";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { axiosInstance } from "Utility/Api";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { encryptLocalStorageData, getAllLocatData } from "Utility/Utility";
// import Button from "@mui/material/Button";
import PlacesAutocomplete from 'react-places-autocomplete';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";


import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PaymentBTN from "./PaymentBTN";
import Loading from "Utility/Loading";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const PurchasePlan = () => {
  const [open, setOpen] = React.useState(false);
  const [invoiceCall, setInvoiceCall] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPayBtn(false)
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
    abn: '',
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



  const PlanDetails = useLocation();
  const PlanDetailsData = PlanDetails.state ? PlanDetails.state.data : null;
  const planPrice = PlanDetailsData?.planDetails?.amount;
  const extraCategory = PlanDetailsData?.extraCategory[
    PlanDetailsData?.planDetails?._id
  ]
    ? PlanDetailsData?.extraCategory[PlanDetailsData?.planDetails?._id]
    : []
  const extraCatPrice = PlanDetailsData?.extraCategory[PlanDetailsData?.planDetails?._id]
    ? PlanDetailsData?.extraCategory[PlanDetailsData?.planDetails?._id]
      ?.length * PlanDetailsData?.extraCatAmount
    : 0;
  const getPermision = () => {
    return (userInfo?.subscription_type == 'Silver' || userInfo?.subscription_type == 'Gold') && (userInfo?.subscription_type == PlanDetailsData?.planDetails?.plan_name) ? true : false
  }
  const total = getPermision() ? parseInt(extraCatPrice) : parseInt(planPrice) + parseInt(extraCatPrice);
  const navigate = useNavigate();




  const createOrder = async (data, actions) => {
    setInvoiceCall(true)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
    });
  };

  const onSuccess = (details) => {
    console.log("Payment succeeded:", details);
  };

  const onError = (err) => {
    console.error("Error during payment:", err);
  };

  const onCancel = (data) => {
    console.log("Payment canceled:", data);
  };

  const onApprove = (data, actions) => {
    console.log("Payment approved:", data);
    return actions.order.capture().then((details) => {
      console.log(details);
      if (details.status == "COMPLETED") {
        purchasePlan(details, "paypal");
      }
    });
  };

  const purchasePlan = async (details, payment_method) => {
    const parmas = {
      plan_id: PlanDetailsData?.planDetails?._id,
      transaction_id: details?.id,
      extra_category_radius: PlanDetailsData?.extraCategory[
        PlanDetailsData?.planDetails?._id
      ]
        ? PlanDetailsData?.extraCategory[PlanDetailsData?.planDetails?._id]
        : [],
      paymentstatus: "Success",
      amount: total,
      payment_method: payment_method,
      response_json: JSON.stringify(details)
    };
    try {
      const res = await axiosInstance.post(
        "/user/createSubscriptionByUser",
        parmas
      );
      if (res.data.status == 200) {
        const dataParam = {
          login_id: getAllLocatData()?.login_id,
          jwt: getAllLocatData()?.jwt,
          user_type: getAllLocatData()?.user_type,
          loginname: getAllLocatData()?.loginname,
          loginstatus: "1",
          subcription_id: details?.id,
        };
        encryptLocalStorageData("web-secret", dataParam, "DoNotTryToAccess");
        const date = new Date(details?.created * 1000);
        const successParam = {
          plan_id: PlanDetailsData?.planDetails?._id,
          plan_name: PlanDetailsData?.planDetails?.plan_name,
          transaction_id: details?.id,
          paymentstatus: "Success",
          amount: total,
          date: details?.create_time || date?.toLocaleString(),
        };
        navigate("/user/plans/success", { state: { data: successParam } });
      } else {
        navigate("/user/plans/success");
      }
    } catch (error) {
      console.log(error);
      console.log("API : Something Went Wrong");
    }
  };

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
    userData()
  }, [])

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
  const userData = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.post('user/getPilotProfile')
      if (res.data.status == 200) {
        setUserInfo(res.data.getacceptedjob[0])
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const [payBtn, setPayBtn] = useState(false)
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    getClientSecretFun()
  }, [])

  const getClientSecretFun = async () => {
    try {
      const params = {
        "amount": total,
        "currency": "usd"
      }
      const res = await axiosInstance.post('user/createPaymentInstant', params)
      if (res?.data?.status == 200) {
        setClientSecret(res?.data?.clientSecret)
      }
    } catch (error) { console.error(error) }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    console.log("clientSecret", clientSecret)
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload?.paymentIntent?.status == "succeeded") {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      purchasePlan(payload.paymentIntent, "stripe");
      setProcessing(false);
      formDataBeforePayment()
    }
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
  };

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [amntLoding, setAmntLoading] = useState(false);

  console.log("PlanDetailsData", PlanDetailsData)
  console.log("amntLoding", amntLoding)
  return (
    <Grid container>
      <Grid item xs={12} sx={{ mt: 3.25 }}>
        <Typography variant="h5" className="global_top_head">
          Plans
        </Typography>
      </Grid>

      <div className="top_box plans_box inner_pricing pricing_main bg-white w-100">
        <section className="flex_plans">
          <Row className=" mt-2 justify-content-around">
            {
              loading ? <Loading />
                :
                <Col md="11">
                  <Row className="justify-content-between">

                    <Col className="" md="4">
                      {
                        getPermision() ?
                          <div className="plan_benifits inner_box_form box text-capitalize">
                            <h5
                              className="text-start"
                              style={{ borderBottom: "1px solid #bbb" }}
                            >
                              Extra Categories Benefits
                            </h5>

                            <ul className="Points_benfits text-start p-0 mt-4">
                              <li>
                                <KeyboardDoubleArrowRightIcon />
                                Unlimited radius
                              </li>
                            </ul>
                          </div>
                          :
                          <div className="plan_benifits inner_box_form box text-capitalize">
                            <h5
                              className="text-start"
                              style={{ borderBottom: "1px solid #bbb" }}
                            >
                              Plan Benefits
                            </h5>

                            <ul className="Points_benfits text-start p-0 mt-4">
                              <li>
                                <KeyboardDoubleArrowRightIcon />
                                Chat access
                              </li>
                              <li>
                                <KeyboardDoubleArrowRightIcon />
                                Exciting New Job Alert in Your Area!
                              </li>
                              <li>
                                <KeyboardDoubleArrowRightIcon />
                                You can post your product on the drone freelancer
                                marketplace
                              </li>
                            </ul>
                          </div>
                      }
                    </Col>

                    <Col className="" md="8">
                      <div className="inner_box_form order_summery box text-capitalize">
                        <h5
                          className="text-start"
                          style={{ borderBottom: "1px solid #bbb" }}
                        >
                          Order Summary
                        </h5>
                        {
                          getPermision() ?
                            <table className="table table-striped">
                              <tr>
                                <td className="text-start">
                                  <strong>Your current plan</strong>
                                </td>
                                <td className="text-start">
                                  {userInfo?.subscription_type}
                                </td>
                              </tr>
                            </table>
                            :
                            <table className="table table-striped">
                              <tr>
                                <td className="text-start">
                                  <strong>Plan Type</strong>
                                </td>
                                <td className="text-start">
                                  {PlanDetailsData?.planDetails?.plan_name}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-start">
                                  <strong>Radius</strong>
                                </td>
                                <td className="text-start">
                                  {PlanDetailsData?.planDetails?.radius}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-start">
                                  <strong>validity</strong>
                                </td>
                                <td className="text-start">
                                  {PlanDetailsData?.planDetails?.plan_type}
                                </td>
                              </tr>
                              <tr>
                                <td className="text-start">
                                  <strong>Amount payble</strong>
                                </td>
                                <td className="text-start">
                                  ${PlanDetailsData?.planDetails?.amount} AUD
                                </td>
                              </tr>
                            </table>
                        }

                        {PlanDetailsData?.extraCategory[
                          PlanDetailsData?.planDetails?._id
                        ] && (
                            <>
                              <p className="text-start">
                                <strong>Extra Category Add on</strong>
                              </p>
                              <div className="extra_cat_box mt-0">
                                <table className="table table-striped">
                                  {PlanDetailsData?.extraCategory[
                                    PlanDetailsData?.planDetails?._id
                                  ]?.map((item, i) => (
                                    <>
                                      <tr key={i}>
                                        <td className="text-start">
                                          <strong>
                                            <span className="me-1">{i + 1} :</span>
                                            {item}
                                          </strong>
                                        </td>
                                        <td className="text-center">
                                          ${PlanDetailsData?.extraCatAmount} AUD
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </table>
                              </div>
                            </>
                          )}

                        <div className="total_payble_amount">
                          <strong>Total Payable Amount : ${total} AUD</strong>
                        </div>


                      </div>

                      <div className="pay_btn_for_form text-end">
                        <React.Fragment>
                          <Dialog
                            className="pop_uo_payment"
                            open={open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={handleClose}
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
                                          <PayPalScriptProvider
                                            options={{
                                              "client-id":
                                                "AVGl7uVRgL4EJorTFqWykbrX4Mqtcmow30S6z3vcvxMiQGA5r94ELvGfcnZfRGp31TwLW-OPdp79jxKJ",
                                            }}
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
                                        </div>
                                        <div className="col-1"></div>
                                        <div className="col-5 text-end">
                                          <button className="chat_btn" onClick={() => setPayBtn(true)} style={{ padding: '13px 0px' }}>Pay With Stripe</button>
                                        </div>
                                      </>}

                                    <div className="col-12">
                                      {
                                        payBtn &&
                                        <form onSubmit={handleSubmit}>
                                          <CardElement className="card-stripe-element" />
                                          <button disabled={processing || succeeded} className="pay-stripe-button">
                                            {processing ? "Processing..." : `Pay $${total}`}
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

                        {
                          getPermision() ?
                            <PaymentBTN
                              extraAreaCat={extraCategory}
                              // setExtraAreaCat={setExtraAreaCat}
                              totalAmount={total}
                              userData={userData}
                              setAmntLoading={setAmntLoading}
                              setInvoiceModal={setInvoiceModal}
                              invoiceModal={invoiceModal}
                              planPage={true}
                            />
                            :
                            <button className="global_btn" onClick={handleClickOpen}>Pay </button>
                        }

                      </div>

                    </Col>
                  </Row>
                </Col>
            }
          </Row>
        </section>
      </div>
    </Grid>
  );
};

export default PurchasePlan;
