import React, { useEffect, useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { axiosInstance } from 'Utility/Api';
import { toastifyError, toastifySuccess, getAllLocatData } from 'Utility/Utility';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlacesAutocomplete from 'react-places-autocomplete';
import { Col, Row } from "react-bootstrap";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getClientSecretFun } from 'Utility/ExportFun';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

const PaymentBTN = ({ extraAreaCat, setExtraAreaCat, userData, setAmntLoading, totalAmount, setInvoiceModal, invoiceModal, planPage }) => {
    const [invoiceCall, setInvoiceCall] = useState(false);
    const navigate = useNavigate()
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const createOrder = (data, actions) => {
        setInvoiceCall(true)
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalAmount,
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
            console.log(details)
            if (details.status == "COMPLETED") {
                purchasePlan(details, "paypal")
            }
        });
    };

    const purchasePlan = async (details, payment_method) => {
        setAmntLoading(true)
        const parmas = {
            "transaction_id": details.id,
            "extra_area_category": extraAreaCat,
            "paymentstatus": "Success",
            "amount": totalAmount,
            payment_method: payment_method,
            response_json: JSON.stringify(details)
        };
        try {
            const res = await axiosInstance.post('/user/createExtraCategory', parmas);
            console.log("Purchase", res)
            if (res?.data?.status == 200) {
                setAmntLoading(false)
                userData()
                toastifySuccess("Extra Category Purchase SuccesFully !!")
                if (planPage) {
                    navigate('/user/plans')
                } else {
                    setExtraAreaCat([])
                }
            } else {
                toastifyError("API : Something Went Wrong")
                setAmntLoading(false)
            }
        } catch (error) {
            console.log(error);
            toastifyError("API : Something Went Wrong")
            setAmntLoading(false)
        }
    };

    const checkPlantype = () => {
        if (getAllLocatData().subcription_type == 'free' || getAllLocatData().subcription_type == '') {
            return true
        } else {
            return false
        }
    }

    console.log("getAllLocatData()", getAllLocatData())
    console.log("checkPlantype", checkPlantype())

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

    const getClientSecret = async (totalAmount) => {
        const res = await getClientSecretFun(totalAmount);
        console.log(res)
        setClientSecret(res)
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

        console.log("payload", payload)
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




    return (
        <>
            {
                checkPlantype() &&
                <p className='text-danger'>Alert : After purchase plan ,you can buy extra category. </p>
            }
            {/* <PayPalScriptProvider options={{ 'client-id': 'AVGl7uVRgL4EJorTFqWykbrX4Mqtcmow30S6z3vcvxMiQGA5r94ELvGfcnZfRGp31TwLW-OPdp79jxKJ' }}>
                <PayPalButtons
                    createOrder={createOrder}
                    onSuccess={onSuccess}
                    onError={onError}
                    onCancel={onCancel}
                    disabled={checkPlantype()}
                    onApprove={onApprove}
                />
            </PayPalScriptProvider> */}

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
                                                {/* <span className="errmsg">{errors.company_name}</span> */}
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
                                                {/* <span className="errmsg">{errors.abn}</span> */}
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
                                                    <button className="chat_btn" onClick={() => { setPayBtn(true); getClientSecret(totalAmount) }} style={{ padding: '13px 0px' }}>Pay With Stripe</button>
                                                </div>
                                            </>}

                                        <div className="col-12">
                                            {
                                                payBtn &&
                                                <form onSubmit={handleSubmit}>
                                                    <CardElement className="card-stripe-element" />
                                                    <button disabled={processing || succeeded} className="pay-stripe-button">
                                                        {processing ? "Processing..." : `Pay $${totalAmount}`}
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
                    checkPlantype() ?
                        <button className="global_btn" style={{ cursor: "not-allowed" }}>Pay</button>
                        :
                        <button className="global_btn" onClick={handleModal}>Pay</button>
                }

            </div>
        </>
    )
}

export default PaymentBTN