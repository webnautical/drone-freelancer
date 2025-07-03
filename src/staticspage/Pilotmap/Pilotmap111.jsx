import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Blackdrone from '../../assets/images/blackdrone.png';
import markerBlue from '../../assets/images/markerBlue.png';
import markerYellow from '../../assets/images/markerYellow.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import premiumimg from '../../assets/images/premium.png';
import StarIcon from '@mui/icons-material/Star';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GoogleMap, MarkerF, InfoWindow, Circle, MarkerClusterer } from '@react-google-maps/api';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import config from 'config';
import { axiosInstance } from 'Utility/Api';
import { defaultUserIMG } from 'Utility/Utility';
import Loading from 'Utility/Loading';
import { Checkbox, InputLabel, ListItemText, OutlinedInput } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from 'react';

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

const Pilotmap = () => {
  const [msg, setMsg] = useState('Find & Hire a Skilled Drone Pilot Today...');
  const mapContainerStyle = {
    width: '100%',
    height: '70vh'
  };
  const defaultCenter = {
    lat: -25.274398,
    lng: 133.775136
  };

  const [location, setLocation] = useState(defaultCenter);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [categorylist, setCategorylist] = useState([]);
  const [pilotList, setPilotList] = useState([]);
  const [address, setAddress] = useState('');
  const [categoeryIDs, setCategoryIDs] = useState([]);
  const [searchLatLan, setSearchLatLan] = useState(defaultCenter)
  const [itemsPerPage, setItemPerPage] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadMore, setLoadMore] = useState(false)
  const [latLanList, setLatLanList] = useState([])
  const [selectedUser, setSelectedUsers] = useState([]);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  const handleChange = (value) => {
    setAddress(value);
  };

  const handleSelect = async (value) => {
    try {
      setAddress(value);
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setLocation({ lat: latLng.lat, lng: latLng.lng });
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };

  const getcategoryData = async () => {
    try {
      const res = await fetch(`${config.url}/admin/getAllJobCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resdata = await res.json();
      if (resdata.status == 200) {
        setCategorylist(resdata.getCategory);
      } else {
        setCategorylist([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngPilot = async () => {
    setListLoading(true)
    try {
      const res = await fetch(`${config.url}/user/getAllpilotlatlong`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resdata = await res.json();
      if (resdata.status == 200) {
        setLatLanList(resdata.getpilotdata);
        setListLoading(false)
      } else {
        setLatLanList([]);
        setListLoading(false)
      }
    } catch (error) {
      console.log(error);
      setLatLanList([]);
      setListLoading(false)
    }
  };

  useEffect(() => {
    getLatLngPilot()
    getcategoryData();
    getPageDataFun()
  }, []);

  const [getPageData, setGetPageData] = useState(null)
  const getPageDataFun = async () => {
    const res = await axiosInstance.post('/admin/getallStaticPagedata')
    if (res?.data?.status == 200) {
      const val = res?.data?.getdata?.find((item) => item.title == "Pilot Map")
      setGetPageData(val)
    }
  }


  const searchPilot = async (type) => {
    if (type == 'loadmore') {
      setLoadMore(true)
      setListLoading(false);
      setLoading(false);
    } else {
      setListLoading(true);
      setLoading(true);
    }
    try {
      const params = {
        page_no: type == 'loadmore' ? currentPage + 1 : currentPage,
        location: address,
        category: categoeryIDs
      };
      const res = await axiosInstance.post('/user/getAllpilotList', params);
      if (res.status == 200) {
        if (res?.data?.getpilotdata?.length > 0) {
          setItemPerPage(res?.data?.itemsPerPage)
          setTotalPages(res?.data?.totalCount)
          setLatLanList(res?.data?.getpilotdata);
          if (type == 'loadmore') {
            setPilotList(prevList => [...prevList, ...res.data.getpilotdata]);
          } else {
            setPilotList(res.data.getpilotdata)
          }
          setSearchLatLan(location)
          setLoadMore(false)
          setMsg('');
        } else {
          setPilotList([]);
          // setMsg(`Oops There Are No Pilot found on this location ${address}`);
          setMsg(`Sorry, We couldn't find any drone pilots in your search area. Please try adjusting your location or browsing the pilot map.`);
        }
        setLoading(false);
        setListLoading(false);
      } else {
        setPilotList([]);
        setMsg(`Oops Something Went Wrong !!`);
        setMsg('');
        setLoading(false);
        setListLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMsg(`Something Went Wrong !!`);
      setPilotList([]);
      setLoading(false);
      setListLoading(false);
    }
  };

  const handleMarkerClick = (event, users, position) => {
    if (users.length === 1) {
      setSelectedUsers(users[0]);
    } else {
      setSelectedUsers(null);
      setSelectedUsers(users);
    }
    setInfoWindowPosition(position);
  };

  const handleInfoWindowClose = () => {
    setSelectedUsers([]);
    setInfoWindowPosition(null);
  };

  const goToDetailsPage = (user) => {
    const detailsPageURL = `/profile-details/${user.element._id}`;
    window.open(detailsPageURL, '_blank');
  };

  const resetSearch = () => {
    setPilotList([])
    setMsg('Search Pilot Nearest You !!')
    getLatLngPilot()
    setSearchLatLan(defaultCenter)
    setAddress('')
    setCategoryIDs([])
    setCurrentPage(1)
  }
  const nextPage = async () => {
    setCurrentPage(prevPage => prevPage + 1);
    searchPilot('loadmore');
  };

  const handleCategoryChange = (event) => {
    const { target: { value } } = event;
    setCategoryIDs(typeof value === 'string' ? value.split(',') : value)
  };

  // const getUsersAtPosition = (lat, lng) => {
  //   return latLanList.filter(user => user.latitude === lat && user.longitude === lng);
  // };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  const sliderRef = useRef(null);

  const handleSlideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleSlideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const groupUsersByLocation = (users) => {
    const grouped = {};
    users.forEach(user => {
      const key = `${user.latitude},${user.longitude}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(user);
    });
    return grouped;
  };

  const groupedUsers = groupUsersByLocation(latLanList);

  const createCustomMarkerIcon = (url, count) => {
    const svgMarker = `
      <svg xmlns="http://www.w3.org/2000/svg" width="70" height="60" viewBox="0 0 70 60">
        <foreignObject x="0" y="0" width="60" height="60">
          <img xmlns="http://www.w3.org/1999/xhtml" src="${url}" width="60" height="60"/>
        </foreignObject>
        ${count > 1 &&
      `<rect x="45" y="5" width="20" height="20" fill="red" rx="5" ry="5" />
          <text x="55" y="20" font-size="16" text-anchor="middle" fill="white" font-weight="bold">${count}</text>`
      }
      </svg>
    `;
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarker)}`,
      scaledSize: new window.google.maps.Size(70, 60),
    };
  };

  const clusterStyles = [
    {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 240 240">
          <circle cx="120" cy="120" opacity=".6" r="70" fill="#ff0000"/>
          <circle cx="120" cy="120" opacity=".3" r="90" fill="#ff0000"/>
          <circle cx="120" cy="120" opacity=".2" r="110" fill="#ff0000"/>
        </svg>
      `),
      height: 100,
      width: 50,
      textColor: '#ffffff',
      textSize: 14,
    },
  ];
  return (
    <>
      <div className="pilot_page">
        <div className="bg_top"></div>
        <section className="find_pilot">
          <Container fluid>
            <Row>
              <Col md={5}>
                <div className="find_box">
                  <h1 className='h1_title'>
                    <img src={Blackdrone} alt="logo" style={{ maxWidth: '', maxHeight: '' }} /> Find a local pilot
                  </h1>

                  <div dangerouslySetInnerHTML={{ __html: getPageData?.content }} />

                  <div className="d-md-flex gap-3 mb-3">
                    <div className="pilot-list-plan-box">
                      <img src={markerYellow} alt="" />
                      <h6 className="m-0">Licenced Pilots</h6>
                    </div>
                    <div className="pilot-list-plan-box">
                      <img src={markerBlue} alt="" />
                      <h6 className="m-0">Unlicenced Pilots</h6>
                    </div>
                  </div>


                  <div className="search_box_pilot">
                    <Row>

                      <Col md={12}>
                        <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
                          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="location_input">
                              <span className="top_text">Location</span>
                              <input {...getInputProps({ placeholder: 'Start Typing' })} />
                              <div className="autocomplete-dropdown-container">
                                {loading ? <div>Loading...</div> : null}
                                {suggestions.map((suggestion) => {
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
                      </Col>

                      <Col md={12} className="mt-3">
                        <FormControl sx={{ minWidth: 120 }} className="normal_select pilot_map_select">
                          <InputLabel id="demo-multiple-checkbox-label">Choose Categories</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={categoeryIDs || []}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.map(id => categorylist.find(cat => cat._id === id).category_name).join(', ')}
                            MenuProps={MenuProps}
                            className="check_select"
                            inputProps={{
                              'aria-label': 'Select categories',
                            }}
                            placeholder="Select categories"
                          >
                            {categorylist?.map((name) => (
                              <MenuItem key={name._id} value={name._id}>
                                <Checkbox checked={categoeryIDs?.indexOf(name._id) > -1} />
                                <ListItemText primary={name.category_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Col>

                      <Col md={12} className="mt-4 text-end">
                        <button className="global_btn reset_btn mx-2" onClick={resetSearch}>Reset</button>
                        {loading ? (
                          <button className="global_btn">
                            <div className="spinner-border spinner-border-sm me-1" role="status"></div> Please Wait ...
                          </button>
                        ) : (
                          <button className="global_btn" onClick={() => searchPilot(1)}>Search</button>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="search_result">
                  {pilotList?.length > 0 && <h3>{totalPages} Result Found</h3>}
                  {
                    listLoading ? <Loading /> :
                      <Row className="pt-1">
                        {
                          pilotList?.map((item, i) => (
                            <Col lg={6} className="mt-5" key={i}>
                              <div className="pilot_profile_box">
                                <div className="profile_box">
                                  <div className="user_icon_box">
                                    <img src={item?.element.image ? item?.element.image : defaultUserIMG} alt="product images" />
                                  </div>
                                  <div className="rating_box">
                                    <StarIcon /> {item?.element.reviews}
                                  </div>
                                </div>
                                <div className="profilepilot_details">
                                  <h2 className="text-uppercase">
                                    {item && item?.element.preferred ? (
                                       <img src={markerYellow} alt="" style={{ height: "25px" }} />
                                    ) :  <span className="premium_pilott">
                                <img src={markerBlue} alt="" style={{ height: "25px" }} />
                              </span>}
                                    {item && `${item?.element.first_name + ' ' + item?.element.last_name} `}
                                  </h2>
                                  <p>{item && `${item?.element?.location} `}</p>
                                </div>

                                <div className="view_profile_btn text-end">
                                  <button onClick={() => goToDetailsPage(item)}>View Profile</button>
                                  <VisibilityIcon />
                                </div>
                              </div>
                            </Col>
                          ))
                        }
                        {loadMore ? <p className='mt-3 text-center'>Loading...</p> : pilotList?.length > 0 && currentPage < Math.ceil(totalPages / itemsPerPage) &&
                          <div className='mt-3 text-center dashboard_view_more'>
                            <button onClick={nextPage}> {'Load More'} </button>
                          </div>
                        }
                        {msg && <h5 className="text-center">{msg}</h5>}
                      </Row>
                  }
                </div>
              </Col>

              <Col md={7}>
                <div className="front_map">
                  <GoogleMap mapContainerStyle={mapContainerStyle} zoom={4.9} center={searchLatLan}>
                    <MarkerClusterer options={{ styles: clusterStyles }}>
                      {(clusterer) =>
                        Object.keys(groupedUsers).map(key => {
                          const [latitude, longitude] = key.split(',').map(Number);
                          const users = groupedUsers[key];
                          return (
                            <MarkerF
                              key={key}
                              clusterer={clusterer}
                              position={{ lat: latitude, lng: longitude }}
                              onClick={(event) => handleMarkerClick(event, users, { lat: latitude, lng: longitude })}
                              icon={createCustomMarkerIcon(users[0]?.element?.preferred ? markerYellow : markerBlue, users.length)}
                            />
                          );
                        })}
                    </MarkerClusterer>

                    {selectedUser && !Array.isArray(selectedUser) && (
                      <InfoWindow
                        position={{ lat: selectedUser.latitude, lng: selectedUser.longitude }}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="pop_map">
                          <h5>
                            <img
                              src={selectedUser?.element?.image ? selectedUser?.element?.image : defaultUserIMG}
                              alt="product images"
                              style={{ height: '40px', width: '40px', borderRadius: '100%' }}
                            />{' '}
                            {selectedUser?.element?.first_name + ' ' + selectedUser?.element?.last_name}

                            {selectedUser && selectedUser?.element.preferred ? (
                              <span className="premium_pilott mx-2">
                                <img src={premiumimg} alt="" />
                              </span>
                            ) : (
                              <></>
                            )}
                          </h5>
                          <p>Location: {selectedUser?.element?.location}</p>
                          <div className="text-end">
                            <button className="map_btn" onClick={() => goToDetailsPage(selectedUser)}>
                              View Profile
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    )}

                    {Array.isArray(selectedUser) && selectedUser.length > 0 && (
                      <InfoWindow
                        position={infoWindowPosition}
                        onCloseClick={handleInfoWindowClose}
                      >
                        <div className="pop_map">
                          {/* <h5>Users at this location: {selectedUser.length}</h5> */}
                          <div className="slider-container">

                            <Slider {...settings} ref={sliderRef}>
                              {selectedUser.map((user) => (
                                <div key={user.element._id}>
                                  <h5>
                                    <img
                                      src={user?.element?.image ? user?.element?.image : defaultUserIMG}
                                      alt="product images"
                                      style={{ height: '40px', width: '40px', borderRadius: '100%' }}
                                    />{' '}
                                    {user?.element?.first_name + ' ' + user?.element?.last_name}

                                    {user?.element?.preferred && (
                                      <span className="premium_pilott mx-2">
                                        <img src={premiumimg} alt="" />
                                      </span>
                                    )}
                                  </h5>
                                  <p>Location: {user?.element?.location}</p>
                                  <div className="text-end">
                                    <button className="map_btn" onClick={() => goToDetailsPage(user)}>
                                      View Profile
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </Slider>
                            <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
                              <button className="cs_btn slider-arrow left-arrow" onClick={handleSlideLeft}>
                                <i className="fa-solid fa-angle-left"></i>
                              </button>
                              <button className="cs_btn slider-arrow right-arrow" onClick={handleSlideRight}>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </InfoWindow>
                    )}

                    <Circle
                      center={searchLatLan}
                      options={{
                        fillColor: '#c1121f',
                        fillOpacity: 0.5,
                        strokeColor: '#c1121f',
                        strokeOpacity: 0.8,
                        strokeWeight: 2
                      }}
                    />
                  </GoogleMap>
                </div>
              </Col>

            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Pilotmap;
