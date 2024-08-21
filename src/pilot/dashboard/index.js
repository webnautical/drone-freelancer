// material-ui
import React from 'react';
import { Grid, Typography } from '@mui/material';
import defaultUser from '../../assets/images/defaultuser.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';

import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import prepilot from '../../assets/images/premium.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { Link, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import productimg from '../../assets/images/productimg.png';
import threeDImg from '../../assets/images/threeDImg.png';
import Skeleton from '@mui/material/Skeleton';
import Dropdown from 'react-bootstrap/Dropdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { defaultUserIMG, toastifyError, toastifySuccess } from 'Utility/Utility';
import config from 'config';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { axiosInstance } from 'Utility/Api';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { timeAgo } from 'Utility/Date';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
// import config from 'config';
const DashboardDefault = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const role = localStorage.getItem('user_type');
  const jwt = localStorage.getItem('jwt');
  const [userInfo, setUserInfo] = useState({});
  const [pilotInfo, setPilotInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviewList, setReviewList] = React.useState([]);
  const [reviewListLimit, setReviewListLimit] = React.useState([]);
  const [viewMoreREviewToggle, setViewMoreREviewToggle] = useState(true);

  const [equipmentData, setEquipment] = useState({});
  const [qualificationData, setQualificationData] = useState({});

  const [portfolioData, setPortfolioData] = useState();
  const [portfolioImg, setPortfolioImg] = useState([]);
  const [portfolioYTVideo, setPortfolioYTVideo] = useState([]);
  const [portfolio3DImage, setPortfolio3DImage] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [viewMore, setViewMore] = useState(true);
  const [portfolioDelLoading, setPortfolioDelLoading] = useState(Array(portfolioYTVideo?.length).fill(false));

  const headers = {
    Authorization: `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  };
  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.url}/user/getPilotProfile`, {
        method: 'POST',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.status == 200) {
        setUserInfo(res);
        if (res?.getacceptedjob) {
          setPilotInfo(res?.getacceptedjob[0]);
          setEquipment(res?.getacceptedjob[0]?.equipment);
          setQualificationData(res?.qualification[0]);
        } else {
          setEquipment({});
          setQualificationData({});
        }
        setLoading(false);
      } else {
        setEquipment({});
        setQualificationData({});
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    if (jwt) {
      getUserInfo();
      getList();
      getPortfoliList();
      getReview();
    }
  }, [jwt]);

  const [list, setList] = useState([]);
  const getList = async () => {
    try {
      const response = await fetch(`${config.url}/user/getallProductList`, {
        method: 'POST',
        headers: headers
      });
      const res = await response.json();
      if (res.status == 200) {
        setList(res?.getProductList);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setList([]);
    }
  };

  const profileEditPage = (page) => {
    navigate('/user/profileedit', { state: { data: page, portfolioData: modalItem } });
  };

  const youtubeID = (url) => {
    const videoURLId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([\w-]{11})/);
    if (videoURLId && videoURLId[1]) {
      return videoURLId[1];
    }

    const urlParams = new URLSearchParams(new URL(url).search);
    const videoId = urlParams.get('v');
    return videoId;
  };

  const getPortfoliList = async () => {
    try {
      const response = await fetch(`${config.url}/user/getportFolio`, {
        method: 'POST',
        headers: headers
      });
      const res = await response.json();
      if (res.status == 200) {
        setPortfolioData(res?.portfoliodata);
        const list = res?.portfoliodata;
        setPortfolioImg(list?.images?.slice(0, 3));
        setPortfolioYTVideo(list?.videos?.slice(0, 3));
        setPortfolio3DImage(list?.three_d_images?.slice(0, 3));
      } else {
        setPortfolioData({});
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const viewMorePortfolio = (type) => {
    if (type == 'images') {
      if (viewMore) {
        setPortfolioLoading(true);
        setTimeout(() => {
          setPortfolioImg(portfolioData.images);
          setPortfolioLoading(false);
        }, 1000);
      } else {
        const ImagesList = portfolioImg?.slice(0, 3);
        setPortfolioImg(ImagesList);
      }
    } else if (type == 'ytVideo') {
      if (viewMore) {
        setPortfolioLoading(true);
        setTimeout(() => {
          setPortfolioYTVideo(portfolioData?.videos);
          setPortfolioLoading(false);
        }, 1000);
      } else {
        const listData = portfolioYTVideo?.slice(0, 3);
        setPortfolioYTVideo(listData);
      }
    }
  };

  const deletePortfolioItem = async (type, index, id) => {
    setPortfolioDelLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });
    try {
      const param = {
        type: type,
        Id: id
      };
      const res = await axiosInstance.post('/user/deleteportFolioItem', param);
      if (res?.data.status == 200) {
        console.log(res.data);
        toastifySuccess('Item Deleted Succesfully !!');
        getPortfoliList();
        setPortfolioDelLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          setViewMore(true);
          return newLoading;
        });
      } else {
        toastifyError("Something Wen't Wrong !!");
        setPortfolioDelLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
      }
    } catch (error) {
      console.log(error);
      setPortfolioDelLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };

  const getReview = async () => {
    try {
      const res = await fetch(`${config.url}/user/getAllReviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resRes = await res.json();
      if (resRes.status == 200) {
        setReviewList(resRes?.getallreviews);
        setReviewListLimit(resRes?.getallreviews?.slice(0, 3));
      } else {
        setReviewList([]);
      }
    } catch (error) {
      console.log(error);
      setReviewList([]);
    }
  };

  const viewMoreReview = () => {
    if (viewMoreREviewToggle) {
      setReviewListLimit(reviewList);
    } else {
      setReviewListLimit(reviewList?.slice(0, 3));
    }
  };
  const viewProfile = () => {
    const data = {
      element: userInfo.getacceptedjob[0],
      qualification: userInfo.qualification[0],
      productlist: list,
      portfoliodata: [portfolioData]
    };
    navigate(`/profile-details/${userInfo.getacceptedjob[0]._id}`, { state: { data } });
  };

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal className="" {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <p className="shoot_title text-capitalize">{props?.item?.title}</p>
              <div className="total_images_section">
                {props?.type == 'video' ? (
                  <>
                    {props?.item?.videos?.map((item, i) => (
                      <iframe
                        style={{ width: '100%', height: '400px' }}
                        key={i}
                        src={`https://www.youtube.com/embed/${youtubeID(item)}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ))}
                  </>
                ) : props?.type == 'three_d_images' ? (
                  <>
                    {props?.item?.three_d_images?.length > 0 &&
                      props?.item?.three_d_images?.map((item, i) => (
                        <Link to={`${item}`} target="_blank" key={i}>
                          <img src={threeDImg} alt="" style={{ maxWidth: '', height: '350px' }} className="grey_img" />
                        </Link>
                      ))}
                  </>
                ) : (
                  <>
                    {props?.item?.images?.map((item, i) => (
                      <>
                        <img src={item} alt="" style={{ width: '100%', height: '400px' }} className="grey_img" key={i} />
                      </>
                    ))}
                  </>
                )}
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="edit_portfolio_btn text-end">
                {' '}
                <button onClick={() => profileEditPage(4)}>
                  {' '}
                  <EditIcon />
                  Edit This Portfolio{' '}
                </button>
              </div>
              <div className="project_details_box">
                <div className="description">
                  <h2>About This project</h2>
                  <p>{props?.item?.description}</p>
                </div>
              </div>
            </Grid>
          </Grid>
        </Modal.Body>
      </Modal>
    );
  }
  const [modalShow, setModalShow] = React.useState(false);
  const [modalItem, setModalItem] = React.useState();
  const [portModalType, setPortModalType] = React.useState();
  const [open, setOpen] = React.useState(false);
  const baseURL = window.location.origin;
  const dynamicProfileURL = baseURL + `/profile-details/${userInfo?.getacceptedjob && userInfo?.getacceptedjob['0']?._id}`;

  const shareProfile = (type) => {
    try {
      if (type == 'copy') {
        navigator.clipboard.writeText(dynamicProfileURL);
        toastifySuccess('Link Copied');
      }
    } catch (error) {
      copyFallback(dynamicProfileURL);
      toastifySuccess('Link Copied');
    }
  };

  const copyFallback = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mt: 3.25 }}>
        <Typography variant="h5" className="global_top_head">
          Dashboard
        </Typography>
      </Grid>
      <Grid className="pt-4" item xl={8} lg={8} md={12} xs={12} sm={12} order={{ xs: 2, md: 2, xl: 1, lg: 1 }}>
        <div className="profile_view top_box">
          {loading ? (
            <Grid container className="text-center">
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12} className="text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <Skeleton variant="circular" width={160} height={160} />
                </div>
              </Grid>
              <Grid item xl={9} lg={9} md={9} sm={9} xs={12} text-center>
                <div className="d-flex justify-content-between">
                  <Skeleton animation="wave" width={350} height={40} />
                  <Skeleton className="me-3" animation="wave" width={150} height={40} />
                </div>
                <Skeleton animation="wave" width={350} height={40} />
                <Skeleton animation="wave" width={50} height={40} />
                <Skeleton animation="wave" width={350} height={40} />
              </Grid>
            </Grid>
          ) : (
            <Grid container justifyContent="center">
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12} className="tc">
                <img
                  src={
                    userInfo?.getacceptedjob
                      ? userInfo?.getacceptedjob['0']?.image != ''
                        ? userInfo?.getacceptedjob['0']?.image
                        : defaultUser
                      : defaultUser
                  }
                  alt="logo"
                  style={{ maxWidth: '', maxHeight: '' }}
                  className="pilot_profile_dash_img grey_img"
                />
              </Grid>
              <Grid item xl={9} lg={9} md={9} sm={9} xs={12} text-center>
                <div className="profile_details">
                  <div className="name_location">
                    <h2 className="profile_name_edit">
                      <span className="text-uppercase">
                        {userInfo?.getacceptedjob &&
                          `${userInfo?.getacceptedjob['0']?.first_name + ' ' + userInfo?.getacceptedjob['0']?.last_name} `}
                      </span>
                      {userInfo?.getacceptedjob && userInfo?.getacceptedjob['0']?.preferred ? (
                        <div className="edit_pro_div">
                          <span className="premium_pilot">
                            <img src={prepilot} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                      <button className="edit_pro" style={{ fontSize: '18px' }} onClick={() => viewProfile()}>
                        <VisibilityIcon />
                      </button>
                    </h2>

                    {role != 'Guest' ? (
                      <>
                        <div className="pilot_lacation">
                          <LocationOnIcon />
                          <span className="text-capitalize">
                            {userInfo?.getacceptedjob && `${userInfo?.getacceptedjob['0']?.location} `}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="Poster_lacation">
                          {/* <LocationOnIcon /> */}
                          <span className="text-capitalize">You Are Login As Guest</span>
                        </div>
                      </>
                    )}
                  </div>
                  {role != 'Guest' && (
                    <>
                      <div className="share_profile">
                        <button className="pilot share_btn" onClick={() => setOpen(true)}>
                          <ShareIcon />
                          Share profile
                        </button>
                        <Dialog
                          open={open}
                          // TransitionComponent={Transition}
                          keepMounted
                          onClose={() => setOpen(false)}
                          aria-describedby="alert-dialog-slide-description"
                        >
                          <DialogTitle>{'Share With'}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                              <ul className="social_share d-flex">
                                <li className="facebook_icon">
                                  <Link
                                    to={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dynamicProfileURL)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FacebookIcon />
                                  </Link>
                                </li>

                                <li className="twitter_icon">
                                  <Link
                                    to={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                      dynamicProfileURL
                                    )}&text=Check out this profile`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <TwitterIcon />
                                  </Link>
                                </li>
                                <li>
                                  <button className="copy_icon" onClick={() => shareProfile('copy')}>
                                    <ContentCopyIcon />
                                  </button>
                                </li>
                              </ul>
                            </DialogContentText>
                          </DialogContent>
                        </Dialog>

                        {/* onClick={()=>navigate(`/profile-details/${data.element._id}`, { state: { data } })} */}
 
                        <Link className="dash_edit_btn global_btn"  to={'/user/profileedit'} style={{textDecoration : 'none'}}>
                          <EditIcon />
                            Edit
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                {role != 'Guest' && (
                  <>
                    <div className="pilot_achivments">
                      <ul>
                        <li>
                          <div className="achive_tittle">
                            <h2>Rating</h2>
                            {userInfo?.getacceptedjob && (
                              <>
                                <div className="d-flex align-items-center">
                                  <StarIcon className="star_des" /> <span>{userInfo?.averageRating}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </li>
                        {/* <li>
                    <div className="achive_tittle">
                      <h2>Flights Made</h2>
                      <p>12</p>
                    </div>
                  </li> */}
                      </ul>
                      <p className="polot_bioo text-capitalize">
                        {userInfo?.getacceptedjob && `${userInfo?.getacceptedjob['0']?.short_description} `}
                      </p>
                    </div>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </div>

        {role != 'Guest' && (
          <>
            <Grid item xs={12} sx={{ mb: 3.25 }}>
              <div className="global_card_box">
                <div className="top_heading_card_outer">
                  <p className="top_heading_card">Portfolio</p>
                  <button className="dash_edit_btn global_btn" onClick={() => profileEditPage(4)}>
                    <AddIcon />
                    Add
                  </button>
                </div>
                <div className="heding_details_box">
                  <Grid container spacing={2}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                      <TabContext value={value}>
                        <Box className="main_tab_design">
                          <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab className="tab_design" label="Images" value="1" />
                            <Tab className="tab_design" label="Youtube Videos" value="2" />
                            <Tab className="tab_design" label="3D Models" value="3" />
                          </TabList>
                        </Box>
                        {loading || portfolioLoading ? (
                          <>
                            <Grid container spacing={2} className="pt-2">
                              <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <Skeleton variant="rectangular" height={200} className="ms-3" />
                              </Grid>
                              <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <Skeleton variant="rectangular" height={200} className="ms-3" />
                              </Grid>
                              <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                                <Skeleton variant="rectangular" height={200} className="ms-3" />
                              </Grid>
                            </Grid>
                          </>
                        ) : portfolioData ? (
                          <>
                            <TabPanel className="inner_tab_deisgn" value="1">
                              <Grid container spacing={2}>
                                {portfolioImg?.length > 0 ? (
                                  portfolioImg?.map((item, i) => (
                                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                                      <Button
                                        className="pilot_portfolio p-0"
                                        variant=""
                                        onClick={() => {
                                          setModalShow(true);
                                          setModalItem(item);
                                          setPortModalType('images');
                                        }}
                                      >
                                        <div className="img_box">
                                          <img
                                            src={item.images[0]}
                                            alt=""
                                            style={{ maxWidth: '100%', maxHeight: '' }}
                                            className="grey_img"
                                          />
                                          <div className="project_name text-capitalize">{item.title}</div>
                                        </div>
                                      </Button>
                                      {portfolioDelLoading[i] ? (
                                        <button className="btn d-block">
                                          <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                        </button>
                                      ) : (
                                        <button className="dlt_btn" onClick={() => deletePortfolioItem('image', i, item._id)}>
                                          <DeleteOutlineIcon />
                                        </button>
                                      )}
                                    </Grid>
                                  ))
                                ) : (
                                  <>
                                    <p className="mt-4 no_data text-capitalize">There are no portfolio images to display </p>
                                  </>
                                )}
                              </Grid>
                              {portfolioData?.images?.length > 3 ? (
                                <div className="text-end">
                                  {viewMore ? (
                                    <div className="dashboard_view_more text-center">
                                      <button
                                        className="mt-2"
                                        onClick={() => {
                                          viewMorePortfolio('images');
                                          setViewMore(false);
                                        }}
                                      >
                                        View All
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="dashboard_view_more text-center">
                                      <button
                                        className="mt-2"
                                        onClick={() => {
                                          viewMorePortfolio('images');
                                          setViewMore(true);
                                        }}
                                      >
                                        View Less
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </TabPanel>
                            <TabPanel className="inner_tab_deisgn" value="2">
                              <Grid container spacing={2}>
                                {portfolioYTVideo?.length > 0 ? (
                                  portfolioYTVideo?.map((item, i) => (
                                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                                      <Button className="w-100 p-0 main_outer_portfolio" variant="">
                                        <div className="img_box">
                                          {/* <img src={item.videos[0]} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" /> */}
                                          <iframe
                                            height={220}
                                            src={`https://www.youtube.com/embed/${youtubeID(item?.videos[0]) || ''}`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                          />
                                        </div>
                                      </Button>
                                      {portfolioDelLoading[i] ? (
                                        <button className="btn d-block">
                                          <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                        </button>
                                      ) : (
                                        <div className="outer_portfolio d-flex text-end">
                                          <button
                                            className="one-line-text dlt_btn"
                                            onClick={() => {
                                              setModalShow(true);
                                              setModalItem(item);
                                              setPortModalType('video');
                                            }}
                                          >
                                            {item.title}
                                          </button>
                                          <button className="dlt_btn" onClick={() => deletePortfolioItem('video', i, item._id)}>
                                            <DeleteOutlineIcon />
                                          </button>
                                        </div>
                                      )}
                                    </Grid>
                                  ))
                                ) : (
                                  <>
                                    {' '}
                                    <p className="mt-4 no_data text-capitalize">There are no portfolio yt videos to display </p>
                                  </>
                                )}
                              </Grid>
                              {portfolioData?.videos?.length > 3 ? (
                                <div className="text-end">
                                  {viewMore ? (
                                    <div className="mid_btn_global text-center">
                                      <button
                                        className=""
                                        onClick={() => {
                                          setViewMore(false);
                                          viewMorePortfolio('ytVideo');
                                        }}
                                      >
                                        View All
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-primary mt-2"
                                      onClick={() => {
                                        setViewMore(true);
                                        viewMorePortfolio('ytVideo');
                                      }}
                                    >
                                      View Less
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </TabPanel>
                            <TabPanel className="inner_tab_deisgn" value="3">
                              <Grid container spacing={2}>
                                {portfolio3DImage?.length > 0 ? (
                                  portfolio3DImage?.map((item, i) => (
                                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                                      <Button className="p-0 w-100" variant="">
                                        <div className="">
                                          <Link to={`${item?.featuredImage}`} target="_blank">
                                            <img className="w-100" src={threeDImg} alt="" />
                                          </Link>
                                        </div>
                                      </Button>
                                      {portfolioDelLoading[i] ? (
                                        <button className="btn d-block">
                                          <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                        </button>
                                      ) : (
                                        <div className="outer_portfolio  d-flex text-end">
                                          <button
                                            className="dlt_btn"
                                            onClick={() => {
                                              setModalShow(true);
                                              setModalItem(item);
                                              setPortModalType('three_d_images');
                                            }}
                                          >
                                            {item.title}
                                          </button>
                                          <button className="dlt_btn" onClick={() => deletePortfolioItem('three_d_image', i, item._id)}>
                                            <DeleteOutlineIcon />
                                          </button>
                                        </div>
                                      )}
                                    </Grid>
                                  ))
                                ) : (
                                  <>
                                    {' '}
                                    <p className="mt-4 no_data text-capitalize">There are no portfolio 3D images to display </p>
                                  </>
                                )}
                              </Grid>
                              {portfolioData?.three_d_images?.three_d_images?.length > 3 ? (
                                <div className="text-end">
                                  {viewMore ? (
                                    <button
                                      className="btn btn-sm btn-primary mt-2"
                                      onClick={() => {
                                        viewMorePortfolio('3dImages');
                                        setViewMore(false);
                                      }}
                                    >
                                      View All
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-primary mt-2"
                                      onClick={() => {
                                        viewMorePortfolio('3dImages');
                                        setViewMore(true);
                                      }}
                                    >
                                      View Less
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </TabPanel>
                          </>
                        ) : (
                          <>
                            <div className="heding_details_box">
                              <p className="no_data mb-0">There are no portfolio to display</p>
                            </div>
                          </>
                        )}
                      </TabContext>
                    </Box>
                    <MyVerticallyCenteredModal type={portModalType} item={modalItem} show={modalShow} onHide={() => setModalShow(false)} />
                  </Grid>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sx={{ mb: 3.25 }}>
              <div className="global_card_box">
                <div className="top_heading_card_outer">
                  <p className="top_heading_card">Equipment</p>
                  <button className="dash_edit_btn global_btn" onClick={() => profileEditPage(3)}>
                    <AddIcon />
                    Add
                  </button>
                </div>

                <div className="heding_details_box">
                  {equipmentData ? (
                    equipmentData?.drone?.length != 0 ? (
                      <>
                        {equipmentData?.payload && (
                          <p className="no_data">
                            <strong>Payload :</strong> {equipmentData?.payload}
                          </p>
                        )}

                        {equipmentData?.camera_specification?.length > 0 && (
                          <p className="no_data">
                            <strong>Camera Specification :</strong> {equipmentData.camera_specification.map((item) => item).join(', ')}
                          </p>
                        )}

                        {equipmentData?.drone?.length > 0 && (
                          <p className="no_data">
                            <strong>Drone :</strong> {equipmentData.drone.map((item) => item).join(', ')}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="no_data">No Equipment Details have been added.</p>
                      </>
                    )
                  ) : (
                    <p className="no_data">No Equipment Details have been added.</p>
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3.25 }}>
              <div className="global_card_box">
                <div className="top_heading_card_outer">
                  <p className="top_heading_card">Qualification</p>
                  <button className="dash_edit_btn global_btn" onClick={() => profileEditPage(0)}>
                    <AddIcon />
                    Add
                  </button>
                </div>
                <div className="heding_details_box text-capitalize">
                  {pilotInfo?.qualification_id !== '' ? (
                    qualificationData ? (
                      <>
                        {/* {qualificationData?.qualification && (
                        <p className="no_data">
                          <strong>Qualification :</strong> {qualificationData?.qualification}
                        </p>
                      )} */}

                        {qualificationData?.qualification_expiry && (
                          <p className="no_data">
                            <strong>Licence Expiry :</strong> {qualificationData?.qualification_expiry}
                          </p>
                        )}

                        {qualificationData?.maximum_wind_speed && (
                          <p className="no_data">
                            <strong>Maximum Wind Speed :</strong> {qualificationData?.maximum_wind_speed}
                          </p>
                        )}

                        {qualificationData?.addition_services?.length > 1 && (
                          <p className="no_data">
                            <strong>Addition Services :</strong> {qualificationData.addition_services.map((item) => item).join(', ')}
                          </p>
                        )}
                        {qualificationData?.radio_certificate?.length > 1 && (
                          <p className="no_data">
                            <strong>Radio Certificate :</strong> {qualificationData.radio_certificate.map((item) => item).join(', ')}
                          </p>
                        )}
                        {qualificationData?.lisencs_type && (
                          <p className="no_data">
                            <strong>License Type :</strong> {qualificationData.lisencs_type.map((item) => item).join(', ')}
                          </p>
                        )}

                        {qualificationData?.weight_limit && (
                          <p className="no_data">
                            <strong>Weight Limit :</strong> {qualificationData.weight_limit.map((item) => item).join(', ')}
                          </p>
                        )}

                        {qualificationData?.flight_time_limit && (
                          <p className="no_data">
                            <strong>Flight Time Limit :</strong> {qualificationData.flight_time_limit}
                          </p>
                        )}

                        {qualificationData?.pro_drone_oprator_longtime && (
                          <p className="no_data">
                            <strong>I&apos;ve been a piolet for:</strong> {qualificationData.pro_drone_oprator_longtime}
                          </p>
                        )}

                        {qualificationData?.rate_skill_level && (
                          <p className="no_data">
                            <strong>Rate Skill Level :</strong> {qualificationData.rate_skill_level}
                          </p>
                        )}
                        <div className="attach_ment_details">
                          {qualificationData?.attachment?.map((item, i) => (
                            <>
                              <Tooltip title="Download file">
                                <Link to={item} download className="" target="_blank">
                                  <ArticleIcon />
                                  Attachement {i + 1}
                                </Link>
                              </Tooltip>
                            </>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="no_data">No Qualification Details have been added.</p>
                    )
                  ) : (
                    <p className="no_data">No Qualification Details have been added.</p>
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3.25 }}>
              <div className="global_card_box">
                <div className="top_heading_card_outer">
                  <p className="top_heading_card">Total Reviews</p>
                </div>
                <div className="heding_details_box">
                  {reviewListLimit?.length > 0 ? (
                    reviewListLimit?.map((item, i) => (
                      <>
                        <div className="reviews_box mt-2" key={i}>
                          <div className="top_sec">
                            <div className="user">
                              <div className="user_imgg">
                                <img
                                  src={item.reviewerImage != '' ? item.reviewerImage : defaultUserIMG}
                                  alt=""
                                  style={{ width: '50px', maxHeight: '50px', borderRadius: '100%' }}
                                />
                              </div>
                              <div className="user_deatils">
                                <h2>{item?.reviewerFirstname + ' ' + item?.reviewerLastname}</h2>
                                <Stack spacing={1}>
                                  <Rating name="half-rating-read" defaultValue={item.rating} precision={0.5} readOnly />
                                </Stack>
                              </div>
                            </div>

                            <div className="user_review">
                              <p>{item.review}</p>
                            </div>
                            <div className="date_review text-end">{timeAgo(item.createdAt)}</div>
                          </div>
                          <div className="mid_sec"></div>
                          <div className="end_section"></div>
                        </div>
                      </>
                    ))
                  ) : (
                    <>
                      <p className="no_data">There are No Review to display </p>
                    </>
                  )}
                  {reviewList?.length > 3 ? (
                    <div className="text-end mt-3">
                      <div className="dashboard_view_more text-center">
                        <button
                          className=""
                          onClick={() => {
                            viewMoreReview();
                            setViewMoreREviewToggle(!viewMoreREviewToggle);
                          }}
                        >
                          {' '}
                          {viewMoreREviewToggle ? 'View All' : 'View Less'}{' '}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sx={{ mb: 3.25 }}>
              <div className="pilot_profile product_card_profile global_card_box">
                <div className="top_heading_card_outer">
                  <p className="top_heading_card">Marketplace Products</p>
                </div>
                <div className="heding_details_box">
                  <Grid container spacing={2}>
                    {list?.length > 0 ? (
                      list.map((item, i) => (
                        <Grid xl={4} lg={4} md={4} sm={6} xs={12} key={i} className="p-2">
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
                              {/* {item.status == 'unsold' ? (
                                <button className="sold_btn" onClick={() => soldOut(item._id, 'sold')}>
                                  Mark As Sold
                                </button>
                              ) : (
                                <button className="sold_btn bg-danger" onClick={() => soldOut(item._id, 'unsold')}>
                                  Mark As In Stock
                                </button>
                              )} */}
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
                                  {/* <Dropdown.Item onClick={() => handleDelete(item._id)}> Delete</Dropdown.Item> */}

                                  <Link to={`/user/markeplace/${item._id}`}> Edit</Link>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </Grid>
                      ))
                    ) : (
                      <>
                        <Grid item xs={12} className="m-0 p-0">
                          <div className="">
                            <p className="no_data p-3 m-0">There are no product to display</p>
                          </div>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </div>
              </div>
            </Grid>
          </>
        )}
      </Grid>

      {role != 'Guest' && (
        <>
          <Grid className="pt-4" item xl={4} lg={4} md={12} xs={12} sm={12} order={{ xs: 1, md: 1, xl: 2, lg: 1 }}>
            <Grid item xs={12} sx={{ mb: 3.25 }}>
              {loading ? (
                <>
                  <div className="pendind_details_box top_box">
                    <div className="d-flex justify-content-between">
                      <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="" />
                      <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="" />
                    </div>
                    <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '100%' }} className="mt-4" />

                    <div className="d-flex justify-content-end">
                      {' '}
                      <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="mt-4" />
                    </div>
                  </div>
                </>
              ) : pilotInfo?.subscription_type == 'free' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">Purchase subscription Plan</div>
                    <button className="pending_btn">Free Plan Activated</button>
                  </div>
                  <p>
                    Your current subscription plan is the free version, which may not provide access to all features. Consider upgrading
                    your plan to access all features.
                  </p>
                  <div className="tend">
                    <Link className="global_fade_btn" to={'/user/plans'}>
                      Upgrade Plan
                      <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
              ) : pilotInfo?.subscription_type == '' && pilotInfo?.subcription_id == '' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">Purchase subscription Plan</div>
                    <button className="pending_btn" onClick={()=>navigate('/user/plans')}>Buy Now</button>
                  </div>
                  <p className="mt-3">Please purchase a subscription plan to access all features.</p>
                  <div className="tend">
                    <Link className="global_fade_btn" to={'/user/plans'}>
                      Purchase Plan
                      <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
              ) : pilotInfo?.subscription_type !== 'free' && pilotInfo?.subcription_id !== '' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">Purchase subscription Plan</div>
                    <button className="pending_btn bg-success">{pilotInfo?.subscription_type} Plan Activated</button>
                  </div>
                  <p>
                    Congratulations! You have full access to all features with your <strong>{pilotInfo?.subscription_type}</strong> plan
                    subscription. Enjoy exploring all that our platform has to offer!
                  </p>
                  <div className="tend">
                    <Link className="global_fade_btn" to={'/user/plans'}>
                      View your plan
                      <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mb: 3.25 }}>
              {loading ? (
                <>
                  <div className="pendind_details_box top_box">
                    <div className="pendind_details_box top_box">
                      <div className="d-flex justify-content-between">
                        <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="" />
                        <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="" />
                      </div>
                      <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '100%' }} className="mt-4" />

                      <div className="d-flex justify-content-end">
                        {' '}
                        <Skeleton variant="rectangular" style={{ borderRadius: '10px', width: '40%' }} className="mt-4" />
                      </div>
                    </div>
                  </div>
                </>
              ) : pilotInfo?.status == 'Active' && pilotInfo?.qualification_id !== '' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">
                      <p className="" style={{ fontWeight: 'bold' }}>
                        Qualification
                      </p>
                    </div>
                    <button className="pending_btn bg-success">Approved</button>
                  </div>
                  <p>Congratulations! Your qualifications have been approved by our admin team.</p>
                </div>
              ) : pilotInfo?.status == 'Inactive' && pilotInfo?.qualification_id !== '' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">
                      <p className="" style={{ fontWeight: 'bold' }}>
                        Qualification
                      </p>
                    </div>
                    <button className="pending_btn">Pending</button>
                  </div>
                  <p>
                    Thank you for uploading your qualifications. Your submission is now awaiting approval from our admin team. We&apos;ll
                    notify you as soon as it&apos;s reviewed and processed.
                  </p>
                  <p className="no_data">
                    <div className="tend">
                      <button onClick={() => profileEditPage(0)} className="global_fade_btn">
                        Complete your Profile
                        <KeyboardArrowRightIcon />
                      </button>
                    </div>
                  </p>
                </div>
              ) : pilotInfo?.qualification_id == '' && qualificationData?.qualification == '' ? (
                <div className="pendind_details_box top_box">
                  <div className="pending_status">
                    <div className="pending_status_name">
                      <p className="" style={{ fontWeight: 'bold' }}>
                        Qualification
                      </p>
                    </div>
                    <button className="pending_btn">Upload Now</button>
                  </div>
                  <p className="mt-3">New users, please upload qualifications to complete your profile for personalized service.</p>
                  <p className="no_data">
                    <div className="tend">
                      <button onClick={() => profileEditPage(0)} className="global_fade_btn">
                        Complete your Profile
                        <KeyboardArrowRightIcon />
                      </button>
                    </div>
                  </p>
                </div>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DashboardDefault;
