import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import productimg from '../assets/images/productimg.png';
// import Loading from 'Utility/Loading';
import { getAllLocatData, toastifyError, toastifySuccess } from 'Utility/Utility';
import Dropdown from 'react-bootstrap/Dropdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from '../../node_modules/react-router-dom/dist/index';
import config from 'config';

import Skeleton from '@mui/material/Skeleton';
import ThereAreNoData from 'Utility/ThereAreNoData';
const MarketPlaceList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/user/getallProductList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.status == 200) {
        setList(res?.getProductList);
        setLoading(false);
      } else {
        setList([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setList([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    getList();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${config.url}/user/deleteProductBypilot/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` }
      });
      const res = await response.json();
      if (res.status == 200) {
        toastifySuccess('Item Successfully Deleted');
        getList();
      } else {
        toastifyError("Something Wen't Wrong !!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const soldOut = async (id, status) => {
    try {
      const param = { status: status };
      const response = await fetch(`${config.url}/user/productUpdateStatus/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
        body: JSON.stringify(param)
      });
      const res = await response.json();
      if (res.status == 200) {
        
        getList();
      } else {
        toastifyError("Something Wen't Wrong !!");
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
            Market Place Listings
          </Typography>
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xl={12} lg={12} md={12}>
            <div className="market_place_listing top_box">
              {loading ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} className="p-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    {list?.length > 0 ? (
                      list?.map((item, i) => (
                        <Grid item xl={3} lg={4} md={4} sm={6} xs={12} key={i}>
                          <div className="box_main_market">
                            <div className="product_market_place">
                              <div className="product_img">
                                <img
                                  src={item.images[0] ? item.images[0] : productimg}
                                  alt="logo"
                                  style={{ maxWidth: '', maxHeight: '' }}
                                />
                              </div>
                              <div className="product_details">
                                <p>{item.title} </p>
                              </div>
                              <div className="price_box">
                                <div>Price</div>
                                <div>{item.price} AUD</div>
                              </div>
                              {item.status == 'unsold' ? (
                                <button className="sold_btn" onClick={() => soldOut(item._id, 'sold')}>
                                  Mark As Sold
                                </button>
                              ) : (
                                <button className="sold_btn bg-danger" onClick={() => soldOut(item._id, 'unsold')}>
                                  Mark As Available
                                </button>
                              )}
                            </div>
                            <div className="status-box">
                              {item.product_approval == 'approved' ? (
                                <p className="w-100 bg-success">Approved</p>
                              ) : item.product_approval == 'pending' ? (
                                <p className="w-100 bg-warning">Pending</p>
                              ) : item.product_approval == 'reject' ? (
                                <p className="w-100 bg-danger">Rejected</p>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="drop_down_menu">
                              <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic">
                                  <MoreVertIcon />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleDelete(item._id)}> Delete</Dropdown.Item>

                                  <Link to={`/user/markeplace/${item._id}`}> Edit</Link>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                          {/* <button onClick={() => handleDelete(item._id)}>Delete</button> */}
                        </Grid>
                      ))
                    ) : (
                      <>
                        <ThereAreNoData
                          title={
                            <div className="global_no_data">
                              <div className='py-4'>
                              <Link to={'/user/markeplace/1'} className='chat_btn' style={{textDecoration: 'none'}}>List an Item</Link>
                              </div>
                              You haven&apos;t listed any items yet. Click the List an Item button to begin!
                            </div>
                          }
                        />
                      </>
                    )}
                  </Grid>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MarketPlaceList;
