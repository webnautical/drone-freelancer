import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
// import Whitedrone from '../../assets/images/whitedrone.png';
import productimg from '../../assets/images/productimg.png';
import { Link, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import posterWelcome from '../../assets/images/posterwelcome 1.png';
import config from 'config';
import Skeleton from '@mui/material/Skeleton';
// import adimage from '../../assets/images/ad.png'
// import Link from 'themes/overrides/Link';
// import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import PlacesAutocomplete from 'react-places-autocomplete';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
// import Loading from 'Utility/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import Breacrumb from 'staticspage/Header/Breacrumb';
// import { axiosInstance } from 'Utility/Api';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { apiBaseURL } from 'Utility/Utility';
const Marketplace = () => {
  const [popup, setPopup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scrollData, setScrollData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchVal, setSearchVal] = useState({
    title: '',
    location: '',
    asc_desc: ''
  });
  const getList = async (pageNo, type) => {
    setTimeout(() => {
      localStorage.removeItem('popup');
      setPopup(false);
    }, 3000);
    setLoading(true);
    try {
      const param = {
        "page_no": pageNo,
        "title": type == 'reset' ? "" : searchVal.title,
        "location": type == 'reset' ? "" : searchVal.location,
        "sortByPrice": type == 'reset' ? "" : searchVal.asc_desc
      }
      const response = await fetch(`${config.url}/user/getAllProducts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.jwt ? 'Bearer ' + localStorage.jwt : ''}` },
        body: JSON.stringify(param)
      });
      const res = await response.json();
      if (res.status == 200) {
        const data = res?.getallProductList;
        if (type == 'filter') {
          setScrollData(data)
        } else if (type == 'reset') {
          setScrollData(data)
        } else {
          if (data?.length > 0) {
            setScrollData(prevData => [...prevData, ...data]);
            setCurrentPage(pageNo);
          } else {
            setHasMore(false);
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getList(1);
    // advertisementFun()
  }, []);

  const callScroll = () => {
    getList(currentPage + 1);
  };

  const navigate = useNavigate();
  const detailsPage = (data) => {
    navigate('/marketplace-details', { state: { data: data } });
  };


  const handleChange = (e) => {
    setSearchVal({
      ...searchVal,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    setHasMore(true);
    getList(1, 'filter')
  };

  const handleReset = () => {
    setSearchVal({
      ...searchVal,
      title: '',
      location: '',
      asc_desc: ''
    });
    getList(1, 'reset');
  };

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };
  const handleLocationSelect = async (value) => {
    try {
      setSearchVal((prevValue) => ({
        ...prevValue,
        location: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };
  const handleLocationChange = (value) => {
    setSearchVal((prevValue) => ({
      ...prevValue,
      location: value
    }));
  };



  return (
    <>
      <div className="market_place_page">
        <Breacrumb />

        <Container>
          <Row className="mt-4 align-items-center">
            <Col lg="3" xl="3" className="text-end mb-3">
              <TextField
                id="standard-basic"
                label="Search for anything"
                variant="standard"
                style={{ width: '100%' }}
                value={searchVal.title}
                name="title"
                onChange={handleChange}
              />
            </Col>
            <Col lg="3" xl="3" className="mb-3">

              <div className="marketplace location_search group error">
                <PlacesAutocomplete
                  value={searchVal.location}
                  name="location"
                  onChange={handleLocationChange}
                  onSelect={handleLocationSelect}
                  searchOptions={searchOptions}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="location_input market_place">
                      {/* <span className="top_text">Location</span> */}
                      {/* <input {...getInputProps({ placeholder: 'Type Location' })}  /> */}

                      <TextField {...getInputProps()} id="standard-basic" label="Type Location" variant="standard" />

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
            <Col lg="3" xl="3" className="text-start mb-3">
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-standard-label">Sort</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={searchVal.asc_desc}
                  name="asc_desc"
                  onChange={handleChange}
                  label="Age"
                >
                  <MenuItem value={'high_to_low'}>Price: High To Low</MenuItem>
                  <MenuItem value={'low_to_high'}>Price: Low To High</MenuItem>
                </Select>
              </FormControl>
            </Col>
            <Col lg="3" xl="3" className="option_serch text-end d-flex ">
              <button className="chat_btn btn-warning" onClick={() => handleReset()}>
                Reset
              </button>
              <button className="chat_btn ms-1" onClick={() => handleSearch()}>
                Search
              </button>
            </Col>
          </Row>
        </Container>


        <section className="market_place_products">
          {loading ? (
            <Container>

              <Row>
                <Col md="9">
                  <Row>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                    <Col lg="6" xl="4" className="mt-3">
                      <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                      <Skeleton variant="rectangular" height={24} style={{ borderRadius: '10px', width: '100%' }} className="mt-2" />
                      <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    </Col>
                  </Row>
                </Col>
                <Col md="3 mt-3">
                  <div className='adverties_ment_box mb-3'>
                    <Skeleton variant="rectangular" height={327} style={{ borderRadius: '10px', width: '100%' }} className="" />
                  </div>
                </Col>
              </Row>
            </Container>
          ) : scrollData?.length > 0 ? (
            <Container>
              <Row className="mt-4">
                <div className='top_header_design d-flex justify-content-between align-items-center'>
                  <h1 className='page_tittle'>Marketplace Products</h1>
                  <button className='chat_btn reset_btn' onClick={() => navigate('/user/markeplace/1')}>Post an Item <i className="fa-solid fa-plus"></i></button>
                </div>
              </Row>
              <InfiniteScroll dataLength={scrollData.length} next={callScroll} hasMore={hasMore} endMessage={<div className='text-cneter'><p className='text-center- mt-3'>No more data to load.</p></div>}>
                <Row>
                  <Col md="12">
                    <Row>
                      {scrollData.map((item, i) => (
                        <Col lg="6" xl="3" key={i}>

                          {
                            item?.productdata ?
                              <button onClick={() => detailsPage(item)} className="main_pro_box_mark border-0 bg-none w-100">
                                <div className="product_market_place" style={{ cursor: 'pointer' }}>
                                  <div className="product_img">
                                    <img
                                      src={item?.productdata?.images[0] ? item?.productdata.images[0] : productimg}
                                      alt="logo"
                                      style={{ maxWidth: '', maxHeight: '' }}
                                    />
                                  </div>
                                  <div className="product_details">
                                    <p>{item?.productdata?.title}</p>
                                    <p style={{ fontSize: "13px" }}><LocationOnIcon style={{ color: "#0198ff" }} />{item?.productdata?.location}</p>
                                  </div>
                                  <div className="price_box">
                                    <div>Price</div>
                                    <div>{item?.productdata?.price} AUD</div>
                                  </div>
                                </div>
                              </button>
                              :
                              <div className='adverties_ment_box mb-3' key={i}>
                                <Link to={item?.advertisement?.redirect_url} target='_blank'>
                                  <img src={apiBaseURL() + "/files/" + item?.advertisement?.image} alt='ad-banner' />
                                <span>Sponsored</span>
                                </Link>
                              </div>
                          }
                        </Col>
                      ))}
                    </Row>
                  </Col>
                 
                </Row>
              </InfiniteScroll>
            </Container>
          ) : (
            <h4 className="text-center">There Are No Data To Display</h4>
          )}
        </section>
      </div>
      {localStorage.getItem('popup') && popup ? (
        <div className="c-modal" style={{ cursor: 'pointer' }}>
          <div className="c-modal-body mt-5">
            <img src={posterWelcome} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
            <h3 className="text-capitalize">welcome {localStorage.getItem('loginname')}</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy
              text ever since the 1500s
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Marketplace;