import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import productimg from '../assets/images/productimg.png';
import { axiosInstance } from 'Utility/Api';
import Loading from 'Utility/Loading';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import Dropdown from 'react-bootstrap/Dropdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from '../../node_modules/react-router-dom/dist/index';

const ProductList = () => {

    // const navigate = useNavigate();
  const location = useLocation();
  const Userdata = location.state;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getList = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/user/getProductListByadmin',{userId:Userdata._id});
      setLoading(true);
      if (res.status == 200) {
        setList(res?.data?.getProductList);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setList([]);
    }
  };
  useEffect(() => {
    getList();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/user/deleteProductBypilot/${id}`);
      if (res.status == 200) {
        toastifySuccess("Product Deleted SuccessFully !!")
        getList()
      } else {
        toastifyError("Something Wen't Wrong !!")
      }
    } catch (error) { console.log(error) }
  };

  const soldOut = async (id, status) => {
    try {
      const param = { 'status': status }
      const res = await axiosInstance.post(`/user/productUpdateStatus/${id}`, param,{
       
      
      });
      console.log("res",res)
      if (res.status == 200) {
        if (status == "sold") {
          toastifySuccess("Product Sold Out SuccessFully !!")
        } else {
          toastifySuccess("Product UnSold SuccessFully !!")
        }
        getList()
      } else {
        toastifyError("Something Wen't Wrong !!")
      }
    } catch (error) { console.log(error) }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 7.25 }}>
          <Typography variant="h5" className="global_top_head">
            Market Place Listings
          </Typography>
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xl={12} lg={12} md={12}>
            <div className="market_place_listing top_box">
              {loading ? (
                <>
                  <Loading />
                </>
              ) : (
                <></>
              )}
              <Grid container spacing={2} >
                {list.map((item, i) => (
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12} key={i}>
                    <div className='box_main_market'>
                      <div className="product_market_place">
                        <div className="product_img">
                          <img src={item.images[0] ? item.images[0] : productimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                        </div>
                        <div className="product_details">
                          <p>{item.title} </p>
                        </div>
                        <div className="price_box">
                          <div>Price</div>
                          <div>${item.price}</div>
                        </div>
                        {
                          item.status == "unsold" ?
                            <button className="sold_btn" onClick={() => soldOut(item._id, "sold")}>Mark As Sold</button>
                            :
                            <button className="sold_btn bg-danger" onClick={() => soldOut(item._id, "unsold")}>Mark As In Stock</button>
                        }
                      </div>

                      <div className="drop_down_menu">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <MoreVertIcon />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDelete(item._id)}> Delete
                            </Dropdown.Item>
                            <Dropdown.Item >
                              <Link to={`/user/markeplace/${item._id}`}> Edit</Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductList;
