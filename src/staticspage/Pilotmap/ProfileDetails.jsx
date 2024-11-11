import React, { useLayoutEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import defaultuserimg from '../../assets/images/defaultuser.png';
import premiumimg from '../../assets/images/premium.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import portfolioimg from '../../assets/images/shoot.jpg';
import Skeleton from '@mui/material/Skeleton';
import { Link, useNavigate, useParams } from '../../../node_modules/react-router-dom/dist/index';
import { Grid } from '../../../node_modules/@mui/material/index';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import threeDImg from '../../assets/images/threeDImg.png';
import config from 'config';
// import Loading from 'Utility/Loading';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { timeAgo } from 'Utility/Date';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TwitterIcon from '@mui/icons-material/Twitter';
import loginimgmodal from '../../assets/images/log.png';
// import LinkIcon from '@mui/icons-material/Link';
// import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { defaultUserIMG, toastifySuccess } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';
import SocialLinkCom from 'Utility/SocialLinkCom';
const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({});
  const [portfolioImg, setPortfolioImg] = useState([]);
  const [portfolioYTVideo, setPortfolioYTVideo] = useState([]);
  const [portfolio3DImage, setPortfolio3DImage] = useState([]);
  const [viewMore, setViewMore] = useState(true);
  const [viewMoreREviewToggle, setViewMoreREviewToggle] = useState(true);

  const [pilotInfo, setPilotInfo] = useState({});
  const [productList, setProductList] = useState([]);
  const [qualification, setQualification] = useState({});
  const [equipment, setEquipment] = useState({});
  const [review, setReview] = useState([]);
  const [reviewListLimit, setReviewListLimit] = React.useState([]);
  const [profileObj, setProfileObj] = useState({});
  const [productCount, setProductCount] = useState({});
  useLayoutEffect(() => {
    if (id) {
      getProfileData();
      getProductCount();
    } else {
      navigate('/pilotmap');
    }
  }, []);
  const getProfileData = async () => {
    setLoading(true);
    try {
      const param = { id: id };
      const response = await fetch(`${config.url}/user/getUserdatas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
      });
      const res = await response.json();
      if (res.status == 200) {
        setProfileObj(res);
        setPilotInfo(res?.getUserdata);
        setProductList(res?.ProductList);
        setQualification(res?.qualification);
        setEquipment(res?.getUserdata?.equipment);
        setPortfolioData(res?.portfolios);
        setPortfolioImg(res?.portfolios?.images?.slice(0, 3));
        setPortfolioYTVideo(res?.portfolios?.videos?.slice(0, 3));
        setPortfolio3DImage(res?.portfolios?.three_d_images?.slice(0, 3));
        setReview(res?.getallreviews);
        setReviewListLimit(res?.getallreviews?.slice(0, 3));
        setLoading(false);

        if (localStorage.getItem('jwt') || localStorage.getItem('user_type') == 'admin') {
          setOpen(false);
        } else {
          setOpen(true);
        }
      } else {
        setPilotInfo([]);
        setProductList([]);
        setQualification({});
        setEquipment({});
        setPortfolioData({});
        setPortfolioImg([]);
        setPortfolioYTVideo([]);
        setPortfolio3DImage([]);
        setLoading(false);
      }
    } catch (error) {
      setPilotInfo([]);
      setProductList([]);
      setQualification({});
      setEquipment({});
      setPortfolioData({});
      setPortfolioImg([]);
      setPortfolioYTVideo([]);
      setPortfolio3DImage([]);
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const detailsPage = (data) => {
    const params = {
      productdata: data,
      pilotdata: pilotInfo,
      roomdata: null
    };
    navigate('/marketplace-details', { state: { data: params } });
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
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const viewMorePortfolio = (type) => {
    if (type == 'images') {
      if (viewMore) {
        setPortfolioImg(portfolioData.images);
      } else {
        const ImagesList = portfolioImg?.slice(0, 3);
        setPortfolioImg(ImagesList);
      }
    } else if (type == 'ytVideo') {
      if (viewMore) {
        setPortfolioYTVideo(portfolioData.videos);
      } else {
        const listData = portfolioYTVideo?.slice(0, 3);
        setPortfolioYTVideo(listData);
      }
    }
  };
  const viewMoreReview = () => {
    if (viewMoreREviewToggle) {
      setReviewListLimit(review);
    } else {
      setReviewListLimit(review?.slice(0, 3));
    }
  };

  const getProductCount = async () => {
    try {
      const res = await axiosInstance.post(`user/postedJobscount/${id}`);
      if (res?.status == 200) {
        setProductCount(res.data);
      } else {
        setProductCount({});
      }
    } catch (error) {
      setProductCount({});
    }
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
                        <>
                          <Link to={`${item}`} target="_blank" key={i}>
                            <img src={threeDImg} alt="" style={{ width: '100%', height: '350px' }} className="grey_img" />

                            {/* <iframe style={{ width: '100%', height: '400px' }} key={i} src={item} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> */}
                          </Link>
                        </>
                      ))}
                  </>
                ) : (
                  <>
                    {props?.item?.images?.map((item, i) => (
                      <>
                        <img src={item} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" key={i} />
                      </>
                    ))}
                  </>
                )}
              </div>
            </Grid>
            <Grid item xs={4}>
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
  const [openShare, setOpenShare] = useState(false);
  const baseURL = window.location.origin;
  const dynamicProfileURL = baseURL + `/profile-details/${pilotInfo?._id}`;
  const shareProfile = (type) => {
    try {
      if (type == 'copy') {
        navigator.clipboard.writeText(dynamicProfileURL);
        toastifySuccess('Link Copied');
      }
    } catch (error) {
      copyFallback(dynamicProfileURL);
      toastifySuccess('Link Copied (Fallback)');
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

  const isEmpty = Object.keys(profileObj).length === 0;

  console.log("pilotInfo", pilotInfo)
  return (
    <section className="details_p">
      <div className="bg_top"></div>
      <Container>
        {loading ? (
          <div className="skeloton mt-5">
            <Container>
              <div className="inner_skelton">
                <Row>
                  <Col md="3" className="mt-3 text-center">
                    <Skeleton variant="circular" width={200} height={200} />
                  </Col>
                  <Col md="9" className="mt-3 text-center">
                    <Skeleton animation="wave" width={150} />
                    <Skeleton animation="wave" width={500} />
                    <Skeleton className="mt-3" animation="wave" width={60} height={40} />
                    <Skeleton animation="wave" width={500} />
                  </Col>
                </Row>
              </div>

              <div className="inner_skelton">
                <Row>
                  <Col md="4" className="mt-3 text-center">
                    <Skeleton variant="rectangular" width={397} height={200} style={{ borderRadius: '10px' }} className="" />
                  </Col>

                  <Col md="4" className="mt-3 text-center">
                    <Skeleton variant="rectangular" width={397} height={200} style={{ borderRadius: '10px' }} className="" />
                  </Col>
                  <Col md="4" className="mt-3 text-center">
                    <Skeleton variant="rectangular" width={397} height={200} style={{ borderRadius: '10px' }} className="" />
                  </Col>
                </Row>
              </div>

              <div className="inner_skelton">
                <Skeleton animation="wave" width={150} />
                <Row>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                </Row>
              </div>
              <div className="inner_skelton">
                <Skeleton animation="wave" width={150} />
                <Row>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                  <Col md="12" className="mt-3 text-center">
                    <Skeleton animation="wave" width={450} />
                  </Col>
                </Row>
              </div>
              <div className="inner_skelton">
                <Skeleton animation="wave" width={150} />
                <Row>
                  <Col md="12" className="mt- text-center">
                    <Skeleton animation="wave" height={200} />
                  </Col>
                  <Col md="12" className="mt-1 text-center">
                    <Skeleton animation="wave" height={200} />
                  </Col>
                </Row>
              </div>
              <div className="inner_skelton">
                <Skeleton animation="wave" width={150} />
                <Row>
                  <Col lg="6" xl="4" className="mt-3">
                    <Skeleton variant="rectangular" width={397} height={327} style={{ borderRadius: '10px' }} className="" />
                    <Skeleton variant="rectangular" width={397} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                  </Col>
                  <Col lg="6" xl="4" className="mt-3">
                    <Skeleton variant="rectangular" width={397} height={327} style={{ borderRadius: '10px' }} className="" />
                    <Skeleton variant="rectangular" width={397} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                  </Col>
                  <Col lg="6" xl="4" className="mt-3">
                    <Skeleton variant="rectangular" width={397} height={327} style={{ borderRadius: '10px' }} className="" />
                    <Skeleton variant="rectangular" width={397} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                    <Skeleton variant="rectangular" width={60} height={24} style={{ borderRadius: '10px' }} className="mt-2" />
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        ) : (
          <>
            {!isEmpty ? (
              <div className="inner_profile_details">
                <Row>
                  {/* Profile */}
                  <Col md="12" className="mt-3">
                    <div className="profile_data">
                      <Row>
                        <Col md="3" className="text-center">
                          <div className="profile_img_pilot_info">
                            <img
                              src={pilotInfo.image ? (pilotInfo?.image != '' ? pilotInfo?.image : defaultUserIMG) : defaultuserimg}
                              alt=""
                            />
                          </div>
                        </Col>
                        <Col md="9">
                          <div className="mail_deatails">
                            <div className="name_sec">
                              <h2 className="text-uppercase">
                                {pilotInfo && `${pilotInfo.first_name + ' ' + pilotInfo.last_name} `}
                                {pilotInfo && pilotInfo.preferred ? (
                                  <span className="premium_pilott">
                                    <img src={premiumimg} alt="" />
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </h2>

                              <p className="location">
                                <LocationOnIcon />
                                {pilotInfo && `${pilotInfo.location || pilotInfo.street + ', ' + pilotInfo.state} `}
                              </p>
                              <div className="main_poster_details d-flex">
                                <div className="poster_deatils">
                                  <h3>Rating</h3>
                                  {profileObj && (
                                    <>
                                      <div className="star_main d-flex align-items-center">
                                        {' '}
                                        <StarIcon className="star_des" /> <span>{profileObj?.averageRating}</span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {pilotInfo?.role === 'Poster' && (
                                  <>
                                    <div className="poster_deatils">
                                      <p>total jobs</p>
                                      <h3>{productCount?.totalJobs}</h3>
                                    </div>
                                    <div className="poster_deatils">
                                      <p>total hires</p>
                                      <h3>{productCount?.totalAwarded}</h3>
                                    </div>
                                    <div className="poster_deatils">
                                      <p>Completed</p>
                                      <h3>{productCount?.totalCompleted}</h3>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="share_profile">
                              <button className="share_btn" onClick={() => setOpenShare(true)}>
                                <ShareIcon />
                                Share Profile
                              </button>
                              <Dialog
                                open={openShare}
                                // TransitionComponent={Transition}
                                keepMounted
                                onClose={() => setOpenShare(false)}
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
                                        {/* </button> */}
                                      </li>
                                      {/* <li className="insta_icon">
                                    <button onClick={() => shareProfile('ig')}>
                                      <InstagramIcon />
                                    </button>
                                  </li> */}
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
                            </div>
                          </div>
                          <div className="deccribe mt-2">
                            <p>{pilotInfo && `${pilotInfo.short_description} `}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>



                  {pilotInfo?.role == 'Pilot' && (
                    <>
                      {
                        (pilotInfo?.subscription_type?.toLowerCase() === "gold" || pilotInfo?.subscription_type?.toLowerCase() === "silver") && (
                          <Col md="12" className="mt-3">
                            <div className="global_card_box outer_profile">
                              <div className="heasding_front">Personal Information</div>
                              <div className="p-3 ">
                                {
                                  <>
                                    {pilotInfo?.email && (
                                      <p className="no_data">
                                        <strong>Email :</strong> {pilotInfo?.email}
                                      </p>
                                    )}

                                    {pilotInfo?.phone && (
                                      <p className="no_data">
                                        <strong>Phone :</strong> {pilotInfo?.phone}
                                      </p>
                                    )}

                                    {pilotInfo?.company && (
                                      <p className="no_data">
                                        <strong>Company name:</strong> {pilotInfo?.company}
                                      </p>
                                    )}

                                    {pilotInfo?.specilization?.length > 0 && (
                                      <p className="no_data">
                                        <strong>Specilization :</strong>{' '}
                                        {pilotInfo.specilization.map((item) => item).join(', ')}
                                      </p>
                                    )}

                                    <SocialLinkCom label="Website" url={pilotInfo?.website_link} />
                                    <SocialLinkCom label="Facebook" url={pilotInfo?.facebook_link} />
                                    <SocialLinkCom label="Instagram" url={pilotInfo?.instagram_link} />
                                    <SocialLinkCom label="TikTok" url={pilotInfo?.tiktok_link} />

                                    {pilotInfo?.twitter_link && (
                                      <p className="no_data">
                                        <strong>Contact Email :</strong> <Link to={`mailto:${pilotInfo?.twitter_link}`} target='_blank'>{pilotInfo?.twitter_link}</Link>
                                      </p>
                                    )}


                                  </>
                                }
                              </div>
                            </div>
                          </Col>
                        )
                      }


                      {/* Portfolio */}
                      <Col md="12" className="mt-3">
                        <div className="global_card_box">
                          <div className="top_heading_card_outer">
                            <p className="top_heading_card">Portfolio</p>
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
                                            </Grid>
                                          ))
                                        ) : (
                                          <>
                                            {' '}
                                            <p className="no_data">There is no portfolio to display.</p>
                                          </>
                                        )}
                                      </Grid>
                                      {portfolioData?.images?.length > 3 ? (
                                        <div className="text-end">
                                          {viewMore ? (
                                            <button
                                              className="btn btn-sm btn-primary mt-2"
                                              onClick={() => {
                                                viewMorePortfolio('images');
                                                setViewMore(false);
                                              }}
                                            >
                                              View All
                                            </button>
                                          ) : (
                                            <button
                                              className="btn btn-sm btn-primary mt-2"
                                              onClick={() => {
                                                viewMorePortfolio('images');
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
                                    <TabPanel className="inner_tab_deisgn" value="2">
                                      <Grid container spacing={2}>
                                        {portfolioYTVideo?.length > 0 ? (
                                          portfolioYTVideo?.map((item, i) => (
                                            <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                                              <Button className="p-0 main_outer_portfolio" variant="">
                                                <div className="img_box">
                                                  <iframe
                                                    height={180}
                                                    src={`https://www.youtube.com/embed/${youtubeID(item?.videos[0])}`}
                                                    title="YouTube video player"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                  />
                                                </div>
                                              </Button>
                                              <div className="text-end">
                                                <button
                                                  className="dlt_btn"
                                                  onClick={() => {
                                                    setModalShow(true);
                                                    setModalItem(item);
                                                    setPortModalType('video');
                                                  }}
                                                >
                                                  {item.title}
                                                </button>
                                              </div>
                                            </Grid>
                                          ))
                                        ) : (
                                          <>
                                            {' '}
                                            <p className="no_data">There is no portfolio to display. </p>
                                          </>
                                        )}
                                      </Grid>
                                      {portfolioData?.videos?.length > 3 ? (
                                        <div className="text-end">
                                          {viewMore ? (
                                            <button
                                              className="btn btn-sm btn-primary mt-2"
                                              onClick={() => {
                                                setViewMore(false);
                                                viewMorePortfolio('ytVideo');
                                              }}
                                            >
                                              View All
                                            </button>
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
                                              <Button className="p-0" variant="">
                                                <div className="img_box">
                                                  {/* <Link to={`${item}`} target="_blank">
                                                    <img
                                                      src={threeDImg}
                                                      alt=""
                                                      style={{ maxWidth: '', height: '200px' }}
                                                      className="grey_img"
                                                    />
                                                  </Link> */}
                                                  <Link to={`${item?.featuredImage}`} target="_blank">
                                                    <img className="w-100" src={threeDImg} alt="" />
                                                  </Link>
                                                </div>
                                              </Button>
                                              <div className="text-end">
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
                                              </div>
                                            </Grid>
                                          ))
                                        ) : (
                                          <>
                                            {' '}
                                            <p className="no_data">There is no portfolio to display. </p>
                                          </>
                                        )}
                                      </Grid>
                                      {portfolioData?.three_d_images?.length > 3 ? (
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
                                </TabContext>
                              </Box>
                              <MyVerticallyCenteredModal
                                type={portModalType}
                                item={modalItem}
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                              />
                            </Grid>
                          </div>
                        </div>
                      </Col>

                      {/* Equipment */}
                      <Col md="12" className="mt-3">
                        <div className="global_card_box outer_profile">
                          <div className="heasding_front">Equipment</div>
                          <div className="p-3 ">
                            {equipment ? (
                              (equipment?.camera_specification?.length > 0 || equipment?.drone?.length > 0) ? (
                                <>
                                  {equipment?.payload && (
                                    <p className="no_data">
                                      <strong>Payload :</strong> {equipment?.payload}
                                    </p>
                                  )}

                                  {equipment?.camera_specification?.length > 0 && (
                                    <p className="no_data">
                                      <strong>Camera Specification :</strong>{' '}
                                      {equipment.camera_specification.map((item) => item).join(', ')}
                                    </p>
                                  )}

                                  {equipment?.drone?.length > 0 && (
                                    <p className="no_data">
                                      <strong>Drone :</strong> {equipment.drone.map((item) => item).join(', ')}
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
                      </Col>

                      {/* Qualification */}
                      <Col md="12" className="mt-3">
                        <div className="global_card_box outer_profile">
                          <div className="heasding_front">Qualification</div>
                          <div className="p-3 ">
                            {qualification ? (
                              <>
                                {qualification?.qualification_expiry && (
                                  <p className="no_data">
                                    <strong>Licence Expiry :</strong> {qualification?.qualification_expiry}
                                  </p>
                                )}

                                {qualification?.maximum_wind_speed && (
                                  <p className="no_data">
                                    <strong>Maximum Wind Speed :</strong> {qualification?.maximum_wind_speed}
                                  </p>
                                )}

                                {qualification?.addition_services?.length > 1 && (
                                  <p className="no_data">
                                    <strong>Addition Services :</strong> {qualification.addition_services.map((item) => item).join(', ')}
                                  </p>
                                )}
                                {qualification?.radio_certificate?.length > 1 && (
                                  <p className="no_data">
                                    <strong>Radio Certificate :</strong> {qualification.radio_certificate.map((item) => item).join(', ')}
                                  </p>
                                )}
                                {qualification?.lisencs_type && (
                                  <p className="no_data">
                                    <strong>License Type :</strong> {qualification?.lisencs_type?.map((item) => item).join(', ')}
                                  </p>
                                )}

                                {qualification?.weight_limit && (
                                  <p className="no_data">
                                    <strong>Weight Limit :</strong> {qualification?.weight_limit?.map((item) => item).join(', ')}
                                  </p>
                                )}

                                {qualification?.flight_time_limit && (
                                  <p className="no_data">
                                    <strong>Flight Time Limit :</strong> {qualification.flight_time_limit}
                                  </p>
                                )}

                                {qualification?.pro_drone_oprator_longtime && (
                                  <p className="no_data">
                                    <strong>I&apos;ve been a piolet for:</strong> {qualification.pro_drone_oprator_longtime}
                                  </p>
                                )}

                                {qualification?.rate_skill_level && (
                                  <p className="no_data">
                                    <strong>Rate Skill Level :</strong> {qualification.rate_skill_level}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="no_data">No Qualification Details have been added.</p>
                            )}
                          </div>
                        </div>
                      </Col>
                    </>
                  )}

                  {/* Total Reviews */}
                  <Col md="12" className="mt-3">
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
                                      <Link to={`/profile-details/${item?.reviewer_Id}`}>
                                        <img
                                          src={item.reviewerImage != '' ? item.reviewerImage : defaultUserIMG}
                                          alt=""
                                          style={{ width: '50px', maxHeight: '50px', borderRadius: '100%' }}
                                        />
                                      </Link>
                                    </div>
                                    <div className="user_deatils">
                                      <h2>
                                        <Link className="ntext" to={`/profile-details/${item?.reviewer_Id}`}>
                                          {item?.reviewerFirstname + ' ' + item?.reviewerLastname}
                                        </Link>
                                      </h2>
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
                        {review?.length > 3 ? (
                          <div className="text-end mt-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                viewMoreReview();
                                setViewMoreREviewToggle(!viewMoreREviewToggle);
                              }}
                            >
                              {viewMoreREviewToggle ? 'View All' : 'View Less'}
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </Col>

                  {pilotInfo.role === 'Pilot' && (
                    <>
                      {/* Marketplace */}
                      <Col md="12" className="mt-3">
                        <div className="global_card_box outer_profile">
                          <div className="heasding_front">Marketplace</div>
                          <div className="p-2 ">
                            <Grid container spacing={2}>
                              {productList?.length > 0 ? (
                                productList.map((item, i) => (
                                  <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                                    <button onClick={() => detailsPage(item)} className="main_pro_box_mark border-0 bg-none w-100">
                                      <div className="product_market_place" style={{ cursor: 'pointer' }}>
                                        <div className="product_img">
                                          <img
                                            src={item.images[0] ? item.images[0] : portfolioimg}
                                            alt="logo"
                                            style={{ maxWidth: '', maxHeight: '' }}
                                          />
                                        </div>
                                        <div className="product_details">
                                          <p>{item.title}</p>
                                        </div>
                                        <div className="price_box">
                                          <div>Price</div>
                                          <div>${item.price}</div>
                                        </div>
                                      </div>
                                    </button>
                                  </Grid>
                                ))
                              ) : (
                                <>
                                  <Grid item xs={12} className="m-0 p-0">
                                    <h5 className="text-center m-0 p-0">There are no product to display</h5>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </div>
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            ) : (
              <>
                {/* Invalid User ID */}
                <Col md="12" className="my-3">
                  <div className="profile_data">
                    <Row>
                      <Col md="12" className="text-center">
                        <p>Oops, You access wrong url ?</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </>
            )}
          </>
        )}
      </Container>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }} // Apply blur effect to the backdrop
      >
        <DialogTitle className="text-center" id="alert-dialog-title">{'Please Log in to your account'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="text-center">
              <div className="log_in_acc">
                <img src={loginimgmodal} alt="log in" />
              </div>
              <p>
                Please log in to access this profile. To log in, click on the Login Now button below. If you do not have an account, you can
                sign up.
              </p>
              <h6>Thank you!</h6>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/login')}>Login Now</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default ProfileDetails;
