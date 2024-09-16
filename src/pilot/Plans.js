import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

// import planimg from '../assets/images/plans.png';

import { Col, Container, Row } from 'react-bootstrap';

import Planarrow from '../assets/images/planarrow.png';

import Accordion from 'react-bootstrap/Accordion';
// import Skeleton from '@mui/material/Skeleton';
import Form from 'react-bootstrap/Form';
import { getAllLocatData, LoadingBTN, toastifyError } from 'Utility/Utility';

import { useNavigate } from '../../node_modules/react-router-dom/dist/index';

import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';

import Select from '@mui/material/Select';

import OutlinedInput from '@mui/material/OutlinedInput';

import InputLabel from '@mui/material/InputLabel';

import Checkbox from '@mui/material/Checkbox';

import ListItemText from '@mui/material/ListItemText';

import Loading from 'Utility/Loading';

import config from 'config';
import { axiosInstance } from 'Utility/Api';
// import PaymentBTN from './Paypal/PaymentBTN';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const Plans = () => {
  const navigate = useNavigate();
  // const [page, setPage] = useState(false);
  const [myPlanList, setMyPlanList] = useState([]);
  const [extraCatAmount, setExtraCatAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({})
  const [myPlan, setMyPlan] = useState({});
  // const [invoiceModal, setInvoiceModal] = useState(false);

  const [categorylist, setCategorylist] = useState([]);

  const [ultimateRadius, setSelectedCategories] = useState({});
  const handleCheckboxChange = (planId, selected) => {
    setSelectedCategories((prevSelectedCategories) => ({
      ...prevSelectedCategories,
      [planId]: selected
    }));
  };
  const getMyPlan = async () => {
    setLoading(true);
    try {

      const response = await fetch(`${config.url}/user/getPlandatas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },

      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      if (res.status == 200) {
        setMyPlan(res?.getplanss[0]);
        setLoading(false);
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMyPlan({});
      setLoading(false);
    }
  };
  const getcategoryData = async () => {
    try {
      fetch(`${config.url}/admin/getAllJobCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get category data successfully') {
            setCategorylist(data.getCategory);
          }
        });
    } catch (error) {
      console.log(error);
      setCategorylist([]);
    }
  };

  const getPurchasedPlan = async () => {
    setLoading(true);
    try {
      const params = {
        "user_type": "pilot"
      }
      const response = await fetch(`${config.url}/admin/getSubscriptionPlan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.status == 200) {

        userData();
        setExtraCatAmount(res?.priceExtra);
        setMyPlanList(res?.getsubscriptionpane);
        setLoading(false);
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMyPlanList([]);
    }
  };

  useEffect(() => {
    getPurchasedPlan();
    getMyPlan();
    userData()
    getcategoryData();
  }, []);
  const goToPlanPurchasePage = (item) => {
    const obj = {
      planDetails: item,
      extraCategory: ultimateRadius,
      extraCatAmount,
    };
    navigate('/user/plans/purchase', { state: { data: obj } });
  };
  // const [viewAll, setViewAll] = useState();
  const endDateString = myPlan?.end_date;
  const endDate = new Date(endDateString);
  const currentDate = new Date();
  const timeDifference = endDate - currentDate;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  console.log(daysRemaining)
  const freePlanPurchased = async (plan) => {
    setSubLoading(true);
    const param = {
      plan_id: plan?._id,
      transaction_id: '',
      extra_category_radius: [],
      paymentstatus: 'Success',
      amount: plan.amount
    };
    try {
      const res = await axiosInstance.post('/user/createSubscriptionByUser', param);
      if (res.data.status == 200) {
        setSubLoading(false);
        const successParam = {
          plan_id: plan?._id,
          plan_name: plan?.plan_name,
          transaction_id: res.data?.subscription_id,
          paymentstatus: 'Success',
          amount: plan.amount
        };
        navigate('/user/plans/success', { state: { data: successParam } });
      } 
      
    } catch (error) {
      if (error.response.status == 400) {
        toastifyError(error.response.data.message)
      } else {
        toastifyError('API : Something Went Wrong')
      }
      setSubLoading(false);
    }
  };

  const userData = async () => {
    try {
      const res = await axiosInstance.post('user/getPilotProfile')
      if (res.data.status == 200) {
        setUserInfo(res.data.getacceptedjob[0])
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 3.25 }}>
          <Typography variant="h5" className="global_top_head">
            Plans
          </Typography>
        </Grid>

        {/* {page || getAllLocatData()?.subcription_id == 0 ? ( */}
        <div className="top_box pilot_plan_subs plans_box inner_pricing pricing_main bg-white w-100">
          <section className="flex_plans">
            <Container>
              {loading ? (
                <Loading />
              ) : (
                <Row className=" mt-2">
                  {myPlanList?.map((item, i) => (

                    <>
                      <Col className="mb-4" md="4" key={i}>
                        <div className={`plan_det_box ${item?.plan_name == 'Silver' ? 'best_plan' : ''}`}>
                          <div className="pricing">
                            <h3 className="text-capitalize">{item?.plan_name}</h3>

                            <div className="price_month">
                              {/* <p className="text_price">
                                ${ultimateRadius[item._id]?.length > 0
                                  ? item?.amount + ultimateRadius[item._id]?.length * extraCatAmount
                                  : item?.amount} AUD
                              </p> */}

                              <p className="text_price">
                                ${item?.amount} AUD
                              </p>

                              <p className="text_month">/Month</p>
                            </div>

                            <p>{item.plan_description}</p>
                          </div>

                          <ul className="includes">
                            <h2>Included</h2>

                            {
                              item?.included_point?.map((val, i) => (
                                <li key={i}>
                                  <img src={Planarrow} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                                  {val}
                                </li>
                              ))
                            }

                          </ul>



                          <div className="text-center">
                            {item.amount == 0 ? (
                              !subLoading ? (
                                <>
                                  {
                                    userInfo?.subscription_type == "free" ?
                                      <button className="global_btn height_margin">
                                        Current Plan
                                      </button>
                                      :
                                      <>
                                        <div className='mt-2'>
                                          <strong>A Silver or Gold plan is required to purchase extra categories.</strong>
                                        </div>
                                        <button className="global_btn height_margin" onClick={() => freePlanPurchased(item)}> Get Started </button>
                                      </>
                                  }
                                </>
                              ) : (
                                <LoadingBTN />
                              )
                            ) : (
                              <>
                                {
                                  userInfo?.subscription_type == item?.plan_name ?
                                    <button className="global_btn height_margin ">
                                      Current Plan
                                    </button>
                                    :
                                    <button className="global_btn height_margin" onClick={() => goToPlanPurchasePage(item)}>
                                      Purchase
                                    </button>
                                }
                              </>
                            )}
                          </div>
                        </div>


                        <div className={item?.unlimited_radius != 0 ? "estra_cate_purchase" : ''}>


                          <div className='text-start my-3 px-2 mt-0'>
                            {item?.plan_name == 'Silver' ?
                              <>
                                <p className='my-0 py-0'>Expand your reach :</p>
                                <strong>Add extra categories for ${extraCatAmount} each and see opportunities within an unlimited radius.</strong>
                              </>
                              :
                              item?.plan_name == 'Gold' ?
                                <>
                                  <p className='my-0 py-0'>Maximize your opportunities :</p>
                                  <strong>Add extra categories for ${extraCatAmount} each and see opportunities within an unlimited radius.</strong>
                                </>
                                :
                                <></>
                            }

                          </div>

                          {item?.unlimited_radius != 0 && (
                            <div className="advance_option mb-0">
                              <Accordion>
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>Buy extra categories - Unlimited radius</Accordion.Header>

                                  <h6 className="text-capitalize text-danger ">${extraCatAmount} AUD per categories</h6>

                                  <Accordion.Body>
                                    <Form>
                                      <FormControl sx={{ m: 1, width: 300 }} className="mb-2 check_select_outer w-100">
                                        <InputLabel id="demo-multiple-checkbox-label">Choose Category</InputLabel>

                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={ultimateRadius[item._id] || []}
                                          onChange={(e) => handleCheckboxChange(item._id, e.target.value)}
                                          input={<OutlinedInput label="Tag" />}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                          className="check_select "
                                        // placeholder="hello"
                                        >
                                          {categorylist?.filter((name) => !userInfo?.extra_area_category?.includes(name.category_name)).map((name) => (
                                            <MenuItem key={name.category_name} value={name.category_name}>
                                              {/* <Checkbox checked={ultimateRadius && ultimateRadius.indexOf(name.category_name) > -1} /> */}
                                              <Checkbox checked={ultimateRadius[item._id]?.includes(name.category_name)} />
                                              <ListItemText primary={name.category_name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Form>


                                    <div className='Added_new_cat'>
                                      <ul className='p-0'>
                                        {
                                          ultimateRadius[item._id]?.map((item, i) => (
                                            <li key={i}> {item}</li>
                                          ))
                                        }
                                      </ul>
                                      {
                                        ultimateRadius[item._id]?.length > 0 &&

                                        <>

                                          {/* <PaymentBTN
                                          extraAreaCat={ultimateRadius[item._id]}
                                          setExtraAreaCat={setSelectedCategories}
                                          totalAmount={ultimateRadius[item._id]?.length * extraCatAmount}
                                          userData={userData}
                                          setAmntLoading={setAmntLoading}
                                          setInvoiceModal={setInvoiceModal}
                                          invoiceModal={invoiceModal}
                                        /> */}
                                          <button className="global_btn text-" onClick={() => goToPlanPurchasePage(item)}>
                                            Purchase
                                          </button>
                                        </>
                                      }
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                          )}

                        </div>
                      </Col>
                    </>

                  ))}
                </Row>
              )}
            </Container>
          </section>
        </div>
      </Grid>
    </div>
  );
};

export default Plans;
