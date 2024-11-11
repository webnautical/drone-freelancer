import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Planarrow from '../../assets/images/planarrow.png';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { axiosInstance } from 'Utility/Api';
import Loading from 'Utility/Loading';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { LOGIN_AND_GET_INFO_BY_TOKEN_FROM_IOS_AND_ANDROID_APP, getAllLocatData } from 'Utility/Utility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Breacrumb from 'staticspage/Header/Breacrumb';
import { useLocation } from '../../../node_modules/react-router-dom/dist/index';
// import whychoose from '../../assets/images/whychoose.png';
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
const Pricing = () => {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [viewAll, setViewAll] = useState();
  const [extraCatAmount, setExtraCatAmount] = useState();
  const [ultimateRadius, setSelectedCategories] = useState({});

  const queryParamsData = useLocation();
  const queryParams = new URLSearchParams(queryParamsData.search);
  const key = queryParams.get("key");
  const plan_id = queryParams.get("plan_id");
  const categoriesParam = queryParams.get("categories");

  useEffect(()=>{
    if (key !== localStorage.jwt) {
      LOGIN_AND_GET_INFO_BY_TOKEN_FROM_IOS_AND_ANDROID_APP(key);
    }
  },[key])

  const filteredItem = planList?.find(item => item._id === plan_id);

  useEffect(() =>{
    if (key && plan_id && filteredItem) {
      const categories = categoriesParam ? JSON.parse(decodeURIComponent(categoriesParam)) : [];
      const dataToPass = {
        [plan_id]: categories
      };
      const obj = {
        planDetails: filteredItem,
        extraCategory: dataToPass,
        extraCatAmount,
        key: key
      };
      navigate('/user/plans/purchase', { state: { data: obj } });
    }
  },[key, plan_id, filteredItem])

  const planListFun = async () => {
    setLoading(true);
    try {
      const params = {
        user_type: 'pilot'
      };
      const res = await axiosInstance.post('/admin/getSubscriptionPlan', params);
      if (res?.data?.status == 200) {
        setExtraCatAmount(res?.data?.priceExtra);
        setPlanList(res?.data?.getsubscriptionpane);
        setLoading(false);
      } else {
        setPlanList([]);
        setLoading(false);
      }
    } catch (error) {
      setPlanList([]);
      setLoading(false);
      console.log(error);
    }
  };

  const categoryListFun = async () => {
    try {
      const res = await axiosInstance.post('/admin/getAllJobCategory');
      if (res?.data?.status == 200) {
        setCategorylist(res?.data?.getCategory);
      } else {
        setCategorylist([]);
      }
    } catch (error) {
      setCategorylist([]);
      console.log(error);
    }
  };

  useEffect(() => {
    planListFun();
    categoryListFun();
    getPlanCompareList();
  }, []);

  const handleCheckboxChange = (planId, selected) => {
    setSelectedCategories((prevSelectedCategories) => ({
      ...prevSelectedCategories,
      [planId]: selected
    }));
  };

  const goToPlanPurchasePage = (item) => {
    if (!getAllLocatData()?.jwt) {
      navigate('/login');
    } else {
      if (getAllLocatData()?.user_type == 'Poster') {
        setOpen(true);
      } else {
        const obj = {
          planDetails: item,
          extraCategory: ultimateRadius,
          extraCatAmount,
        };
        navigate('/user/plans/purchase', { state: { data: obj } });
      }
    }
  };

  const [planComparison, setPlanComparison] = useState([]);
  const getPlanCompareList = async () => {
    try {
      const res = await axiosInstance.get('/admin/getPlanComparison');
      if (res?.data?.status == 200) {
        setPlanComparison(res?.data?.comparison);
      } else {
        setPlanComparison([]);
      }
    } catch (error) {
      setPlanComparison([]);
      console.log(error);
    }
  };


  // console.log("ultimateRadius",ultimateRadius)

  // const categories = [
  //   "Agriculture",
  //   "Asset or industrial inspection",
  //   "Boating and Water Sports",
  //   "Business Employment Portal"
  // ];
  // const encodedCategories = encodeURIComponent(JSON.stringify(categories));

  // console.log("encodedCategories",encodedCategories)

  // http://localhost:3000/plans?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNiMGY1NDIzN2JiZDk1NDJkODQ4ODgiLCJpYXQiOjE3MjgxMDc2MjB9.YZmoA_iqQl9yaJaDrlQED_JGcob_skZoUS2XyqQZeqo&plan_id=6572d96bb83ec0df3f670f8a&categories=%5B%22Agriculture%22%2C%22Asset%20or%20industrial%20inspection%22%2C%22Boating%20and%20Water%20Sports%22%2C%22Business%20Employment%20Portal%22%5D


  return (
    <>
      <div className="pricing_main pricing_main_front">
        <Breacrumb />

        <section className="plandetails">
          <Container>
            <Row>
              <Col md={12}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="align-middle">
                        <div className="table_tittle"> Drone Freelancer Plan Benefits</div>
                      </th>
                      <th className="align-middle text-center">Free</th>
                      <th className="align-middle text-center p-0">
                        <div className="purchase_highlight">Purchased</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {planComparison?.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="plan_points">
                            {item?.title}
                            <span className="d-block">{item?.subtitle}</span>
                          </div>
                        </td>
                        <td className="text-center align-middle ">
                          {item?.free ? (
                            <i className="fa-solid fa-check text-success"></i>
                          ) : (
                            <i className="fa-solid fa-times text-danger"></i>
                          )}
                        </td>
                        <td className="align-middle text-center ">
                          {item?.purchased ? (
                            <i className="fa-solid fa-check text-success"></i>
                          ) : (
                            <i className="fa-solid fa-times text-danger"></i>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="flex_plans">
          <Container>
            {loading ? (
              <Loading />
            ) : (
              <Row className=" mt-2">
                <div className="main_global_heading mb-3">
                  <p>Pricing Plan</p>
                  <h2>Flexible Plans</h2>
                </div>
                {planList?.map((item, i) => (
                  <Col lg={4} md={6} className="mb-4" key={i}>
                    <div className={`plan_det_box ${item?.plan_name == 'silver' ? 'best_plan' : ''}`}>
                      <div className="pricing">
                        <h3 className="text-capitalize">{item?.plan_name}</h3>

                        <div className="price_month">
                          <p className="text_price">
                            $
                            {ultimateRadius[item._id]?.length > 0
                              ? item?.amount + ultimateRadius[item._id]?.length * extraCatAmount
                              : item?.amount}{' '}
                            AUD
                          </p>

                          <p className="text_month">/Month</p>
                        </div>

                        <p>{item.plan_description}</p>
                      </div>

                      <ul className="includes">
                        <h2>Included</h2>

                        {item?.included_point?.map((val, i) => (
                          <li key={i}>
                            <img src={Planarrow} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                            {val}
                          </li>
                        ))}
                      </ul>

                      {item?.unlimited_radius != 0 && (
                        <div className="advance_option">
                          <Accordion>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>Buy extra categories - Unlimited radius</Accordion.Header>

                              <h6 className="text-capitalize text-danger ">${extraCatAmount} AUD per categories</h6>

                              <Accordion.Body>
                                <Form>
                                  <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer w-100 m-0">
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
                                      className="check_select"
                                      placeholder="hello"
                                    >
                                      {categorylist?.map((name) => (
                                        <MenuItem key={name.category_name} value={name.category_name}>
                                          {/* <Checkbox checked={ultimateRadius && ultimateRadius.indexOf(name.category_name) > -1} /> */}
                                          <Checkbox checked={ultimateRadius[item._id]?.includes(name.category_name)} />
                                          <ListItemText primary={name.category_name} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Form>

                                <div className="Added_new_cat">
                                  <ul className="p-0 mt-2">
                                    {ultimateRadius[item._id]?.map((item, i) => (
                                      <li key={i}> {item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      )}

                      <div className="text-center">
                        {item.amount == 0 ? (
                          <>
                          {
                                    getAllLocatData()?.subcription_type == "free" ?
                                      <button className="global_btn height_margin">
                                        Current Plan
                                      </button>
                                      :
                                      <>
                                        <button className="global_btn height_margin " onClick={() => goToPlanPurchasePage(item)}>Get Started</button>
                                      </>
                                  }
                          </>
                        ) : (
                          <>
                                {
                                  getAllLocatData()?.subcription_type == item?.plan_name ?
                                  <>
                                  {
                                    ultimateRadius[item._id]?.length > 0 ? 
                                    <button className="global_btn  height_margin " onClick={() => goToPlanPurchasePage(item)}>
                                      {ultimateRadius[item._id]?.length > 0 ? "Buy Extra Category" : "Current Plan"}
                                    </button>
                                    :
                                    <button className="global_btn height_margin">Current Plan</button>
                                  }
                                  </>
                                    :
                                    <button className="global_btn height_margin" onClick={() => goToPlanPurchasePage(item)}>
                                    Purchase
                                  </button>
                                }
                              </>
                          
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>

        <section className="why_choose">
          <Container>
            <div className="main_global_heading mb-md-5 mb-3">
              <p>Why Choose Us</p>
              <h3>Your Trusted Partner for Exceptional Service</h3>
            </div>
            <Row className="align-items-center">
              <Col md={12} className="order-md-1 order-2 ">
                <ul className="p-0">
                  <li>
                    {' '}
                    <div className="icon_li">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="30"
                        height="30"
                        viewBox="0 0 214.32 214.32"
                        style={{ enableBackground: 'new 0 0 512 512' }}
                        xmlSpace="preserve"
                      >
                        <g>
                          <path
                            d="M183.673 128.681c-8.297 9.305-19.722 14.821-32.169 15.534-12.432.712-24.425-3.466-33.73-11.764L81.312 99.937c-8.919-7.954-22.649-7.17-30.603 1.751l-1.404 1.574c-7.953 8.919-7.167 22.647 1.752 30.602l35.191 31.382 5.02-5.532a10 10 0 0 1 16.927 3.666l11.951 37.267a9.985 9.985 0 0 1 .696 3.675c0 5.488-4.421 9.943-9.896 9.999l-.124.001a9.945 9.945 0 0 1-2.116-.227l-38.887-8.422a9.998 9.998 0 0 1-5.289-16.493l4.917-5.419-35.031-31.238c-19.208-17.129-20.899-46.691-3.771-65.899l1.404-1.574c17.127-19.207 46.688-20.899 65.898-3.77l36.462 32.515c8.92 7.954 22.648 7.17 30.603-1.751 7.954-8.92 7.168-22.647-1.751-30.602L126.96 49.067l-5.027 5.54a10 10 0 0 1-16.927-3.667l-12.15-37.886A9.998 9.998 0 0 1 104.494.227l38.887 8.421a9.998 9.998 0 0 1 5.289 16.493l-4.911 5.412 36.142 32.23c19.209 17.128 20.901 46.691 3.772 65.898z"
                            fill="#ffffff"
                            opacity="1"
                            data-original="#000000"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <p>Flexible options to suit your needs</p>
                  </li>

                  <li>
                    <div className="icon_li">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="30"
                        height="30"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: 'new 0 0 512 512' }}
                        xmlSpace="preserve"
                      >
                        <g>
                          <path
                            fillRule="evenodd"
                            d="M101.494 57.782c34.357 0 62.209 27.852 62.209 62.209S135.85 182.2 101.493 182.2s-62.208-27.852-62.208-62.21 27.852-62.208 62.209-62.208zM265.726 387.81c8.311-14.396 3.332-32.975-11.062-41.286l-149.073-86.067c-14.395-8.312-32.975-3.333-41.286 11.063-8.301 14.375-3.315 32.986 11.062 41.286l149.073 86.068c14.376 8.298 32.987 3.311 41.286-11.064zm35.814-227.977a6.999 6.999 0 0 1 9.897 9.897l-65.052 65.053a7 7 0 0 1-9.898 0l-35.923-35.923a6.998 6.998 0 1 1 9.897-9.898l30.975 30.975zm-32.487 179.925 137.355-79.3c14.397-8.313 32.976-3.336 41.287 11.061 8.3 14.375 3.313 32.987-11.062 41.287L287.56 398.874a29.963 29.963 0 0 1-15.7 4.017c16.819-17.953 15.634-46.58-2.807-63.133zM410.506 57.782c-34.357 0-62.209 27.852-62.209 62.209s27.852 62.209 62.209 62.209 62.209-27.852 62.209-62.21-27.852-62.208-62.21-62.208zM496 454.218V260.114c0-21.163-17.315-38.478-38.478-38.478H363.49c-21.163 0-38.478 17.315-38.478 38.478v31.172l74.397-42.953c21.058-12.158 48.252-4.872 60.41 16.186 12.158 21.059 4.872 48.252-16.186 60.41l-118.621 68.488v60.8zm-480 0V260.114c0-21.163 17.315-38.478 38.478-38.478h94.032c21.163 0 38.478 17.315 38.478 38.478v31.172l-74.398-42.953c-21.058-12.158-48.251-4.872-60.41 16.186-12.158 21.059-4.872 48.252 16.186 60.41l118.622 68.488v60.8z"
                            fill="#fff"
                            opacity="1"
                            data-original="#fff"
                          />
                        </g>
                      </svg>
                    </div>
                    <p> No long-term commitments</p>
                  </li>

                  <li>
                    <div className="icon_li">
                      <i className="fa-solid fa-users-rectangle"></i>
                    </div>
                    <p> Expand your reach with additional categories</p>
                  </li>

                  <li>
                    <div className="icon_li">
                      <i className="fa-brands fa-mendeley"></i>
                    </div>
                    <p> Access to exclusive discounts on training courses</p>
                  </li>

                  <li>
                    <div className="icon_li">
                      <i className="fa-solid fa-diagram-project"></i>
                    </div>
                    <p> Connect with a wide range of clients and projects</p>
                  </li>
                </ul>
              </Col>

              {/* <Col md={6} className="order-md-2 order-1 ">
                <img className="w-100" src={whychoose} alt="why-choose" />
              </Col> */}
            </Row>
          </Container>
        </section>
      </div>
      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Only Pilot can purchase plan.</DialogContentText>
        </DialogContent>
        <DialogActions>{/* <Button onClick={() => setOpen(false)}>OK</Button> */}</DialogActions>
      </Dialog>
    </>
  );
};

export default Pricing;
