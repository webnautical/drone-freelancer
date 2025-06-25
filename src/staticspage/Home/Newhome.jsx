import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "aos/dist/aos.css";
import AOS from "aos";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import thirdbanner from '../../assets/images/thirdbanner.gif'
import shpaeleft from "../../assets/images/left-shape.png";
import shpaeright from "../../assets/images/right-shape.png";
import points from "../../assets/images/points.png";
import howwe from "../../assets/images/how-we.jpg";
import Quoteimg from "../../assets/images/left-quote.png";
import Whitequote from "../../assets/images/wleft-quote.png";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import StarIcon from "@mui/icons-material/Star";
import AppleIcon from "@mui/icons-material/Apple";
import ShopIcon from "@mui/icons-material/Shop";
// import config from "config";
import { useState, useEffect } from "react";
// import baner from "../../assets/images/sliderbanner.png";
// import Herodrone from "../../assets/images/drone.png";
import catdrone from "../../assets/images/cat-drone.png";
import { getAllLocatData } from "Utility/Utility";
import {
  useNavigate,
} from "../../../node_modules/react-router-dom/dist/index";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Button from "@mui/material/Button";
import { axiosInstance } from "Utility/Api";
import PostJob from "poster/PostJob";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Newhome = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [homePageData, setHomePageData] = useState(null)
  const [topCategoryList, setTopCategoryList] = useState([])
  const [reviewList, setReviewList] = useState([])
  const [appData, setAppData] = useState(null)
  useEffect(() => {
    getHomePageData()
    getTopCategoryListFun()
    getReviewListFun()
  }, [])

  // HOME PAGE FUNCTION
  const getHomePageData = async () => {
    try {
      const res = await axiosInstance.post('/admin/getHomePageContent');
      if (res?.status) {
        setHomePageData(res?.data?.addHomecontent[0])
      } else {
        setHomePageData(null)
      }
    } catch (error) {
      console.log(error)
      setHomePageData(null)
    }
  }

  // TOP CATEGORY LIST FUNCATION
  const getTopCategoryListFun = async () => {
    try {
      const params = { type: "live" }
      const res = await axiosInstance.post('/admin/getTopcategory', params);
      if (res?.status) {
        setTopCategoryList(res?.data?.getallcategory)
      } else {
        setTopCategoryList([])
      }
    } catch (error) {
      setTopCategoryList([])
    }
  }

  // REVIEW LIST AND GET APP DATA FUNCATION
  const getReviewListFun = async () => {
    try {
      const appResult = await axiosInstance.post('/admin/getAppLinkcontent');
      if (appResult?.status) { setAppData(appResult?.data?.getApplinkModel) } else { setAppData(null) }
      const res = await axiosInstance.post('/admin/getAllReviews');
      if (res?.status) {
        setReviewList(res?.data?.getallreview)
      } else {
        setReviewList([])
      }
    } catch (error) {
      setReviewList([])
    }
  }

  // REDIRECT TO THE JOB POST PAGE 
  const getQuetesCall = (item) => {
    if (!getAllLocatData()?.jwt) {
      navigate("/login");
    } else {
      if (getAllLocatData()?.user_type == "Pilot") {
        setOpen(true);
      } else {
        navigate("/user/postjob", { state: { details: item } });
      }
    }
  };

  // HANDLE REDIRECT
  const navigatePage = (page) => {
    const text = page.toLowerCase().replace(/\s+/g, "-");
    if (text == "get-a-quote!") {
      getQuetesCall();
    } else if (text == "business-employment-portal") {
      navigate(`/page?v=${text}`);
    } else if (text == "search-pilots!") {
      navigate(`/pilot-map`);
    } else {
      navigate(`/${text}`);
    }
  };


  // SLIDER
  const category = {
    loop: true,
    autoplay: false,
    autoplaySpeed: 800,
    margin: 30,
    dots: false,
    nav: false,
    responsiveClass: true,
    infinite: true,
    speed: 100,

    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 1,
        loop: true,
      },
    },
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="new_home">

      {/* HOME BANNER SECTION */}
      <section
        className="slider_section"
        style={{
          backgroundImage: `url(${homePageData?.banerImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="mid_cnt_box">
          <Container>
            <Row className="justify-content-center">
              <Col md={12} className="text-center">
                <div className="mid_cnt_box_main">

                  <div dangerouslySetInnerHTML={{
                    __html: homePageData?.bannerContent1,
                  }} />

                  <div className="d-md-flex flex-wrap gap-3 justify-content-center mt-4 mb-4">
                    <button className="squre_btn border-0" onClick={() => navigate("/pilot-directory")}>  Hire a Drone Pilot</button>
                    <button className="squre_btn_white" onClick={() => navigate("/user/dashboard/default")}>  Join as a Pilot</button>
                  </div>

                  <Row className="justify-content-center">
                    <Col md={10}>
                      <div className="sec_box">
                        <div dangerouslySetInnerHTML={{
                          __html: homePageData?.bannerContent2,
                        }} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section className="post-a-job-home app_download">
        <div className="container">
          <PostJob jobPostType={"front"}/>
        </div>
      </section>


      {/* HOW  IT WORK SECTION */}
      <section className="how_work">
        <Container>
          <Row>
            <>
              <div className="main_global_heading" data-aos="fade-up" data-aos-duration="2000">
                <h2 className="new_hightlist_text"> {homePageData?.howitworksection?.subheading}</h2>
                <h3> {homePageData?.howitworksection?.tital} </h3>
                <p>{homePageData?.howitworksection?.content}</p>
              </div>

              <div className="how_we_sec mt-md-5 mt-3">
                <Row className="align-items-center ">
                  <Col lg={5} className="text-center ">
                    <div className="img_b_how_we">
                      <img className="main_img w-70 m-auto" src={homePageData?.howitworksImage || howwe} alt="how-we-work-img" />
                      <img className="left_img_box" src={shpaeright} alt="shape-img" />
                    </div>
                  </Col>

                  <Col lg={7} className="">

                    {homePageData?.howitworksection?.option.map((option, i) => (
                      <div className="point_how_we mb-5" key={i}>
                        <h4>
                          <img src={points} alt="bullet-img" width="22px" />
                          {option.tital}
                        </h4>

                        {option.points.map((point) => (
                          <>
                            <p>{point}</p>

                          </>
                        ))}

                        {
                          i === 0 ?
                            <div className="text-center minus_box">
                              <button className="squre_btn border-0" onClick={() => navigatePage("get-a-quote!")}>
                                Get A Quote<i className="fa-solid fa-arrow-right"></i>
                              </button>
                            </div>
                            :
                            <div className="text-center minus_box">
                              <button className="squre_btn border-0" onClick={() => navigatePage("search-pilots!")}>
                                Search Pilots<i className="fa-solid fa-arrow-right"></i>
                              </button>
                            </div>
                        }
                      </div>
                    ))}

                  </Col>
                </Row>
              </div>
            </>
          </Row>
        </Container>
      </section>

      {/* MID CONTENT */}
      <section className="hero_content" >
        <Container>
          <div className="hero_content_main" style={{ backgroundImage: `url(${homePageData?.droneHireBg})` }}>
            <Row className="justify-content-center">
              <Col lg="12" className="text-start">
                <div className="d-md-flex gap-3 align-items-center justify-content-center">
                  <>
                    {homePageData && (
                      <>
                        <div className="text-center cnt_drone"
                          dangerouslySetInnerHTML={{
                            __html: homePageData?.ptag,
                          }}
                        />
                      </>
                    )}
                  </>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* GET STARTED SECTION */}
      <section className="get_start">
        <Container>
          <>
            <div
              className="global_heading"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div dangerouslySetInnerHTML={{ __html: homePageData?.getstartedsection?.tital }}
              />
            </div>
            <Row className="align-items-center mt-md-5 mt-3">
              <Col lg={7} className="order-lg-1 order-2">
                <Row className="get_q">

                  {homePageData?.getstartedsection?.quates?.map((option, i) => (
                    <Col md="12"
                      className="mb-md-5 mb-3"
                      data-aos="fade-up" data-aos-duration="1000" key={i}>
                      <div className="faicility_box">
                        <div className="icon_text">
                          <div className="image_box">
                            <img
                              src={option?.image}
                              alt="logo"
                              style={{ maxWidth: "", maxHeight: "" }}
                            />
                          </div>
                          <div className="text-start">
                            <div className="text_box">
                              <h3>{option?.tital}</h3>
                              <p>{option?.subheading}</p>
                            </div>
                            {
                              i === 0 ?
                                <button className="" onClick={() => navigatePage('get-a-quote!')}>Get a Quote! <i className="fa-solid fa-arrow-right"></i></button>
                                :
                                i === 2 ?
                                  <button className="" onClick={() => navigatePage("user/dashboard/default")}>Join Us! <i className="fa-solid fa-arrow-right"></i> </button>
                                  :
                                  <button className="" onClick={() => navigatePage('business-employment-portal')}>Get A Pilot! <i className="fa-solid fa-arrow-right"></i></button>
                            }
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}

                  {/* <Col
                    md="12"
                    className="mb-md-5 mb-3"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <div className="faicility_box">
                      <div className="icon_text">
                        <div className="image_box">
                          <img
                            src={thirdbanner}
                            alt="logo"
                            style={{ maxWidth: "", maxHeight: "" }}
                          />
                        </div>
                        <div className="text-start">
                          <div className="text_box">
                            <h3>Looking to hire? Find qualified pilots!</h3>
                            <p>Sign up today and create an Ad to find the right pilot for your business.</p>
                          </div>
                          <button className=" ">Get A Pilot <i className="fa-solid fa-arrow-right"></i></button>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col
                    md="12"
                    className="mb-md-5 mb-3"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <div className="faicility_box">
                      <div className="icon_text">
                        <div className="image_box">
                          <img
                            src={secondbanner}
                            alt="logo"
                            style={{ maxWidth: "", maxHeight: "" }}
                          />
                        </div>
                        <div className="text-start">
                          <div className="text_box">
                            <h3>Are you a qualified pilot? Join our network!</h3>
                            <p>Sign up today and join our growing network of professional drone pilots.</p>
                          </div>
                          <button className=" ">Join Us<i className="fa-solid fa-arrow-right"></i></button>
                        </div>
                      </div>
                    </div>
                  </Col> */}

                </Row>
              </Col>

              <Col lg={5} className="text-center order-lg-2 order-1">
                <div className="img_b_how_we">
                  <img
                    className="main_img w-70 m-auto"
                    src={homePageData?.getStartedImage || thirdbanner}
                    alt="how-we-work-img"
                  />
                  <img className="right_shpe_box" src={shpaeleft} alt="" />
                </div>
              </Col>
            </Row>
          </>
        </Container>
      </section>

      {/* CATEGORY SECTIONS */}
      <section className="top_cat">
        <Container>
          <div className="cat_main">
            <Row className="align-items-center">
              <Col lg={5}>
                <div className="main_global_heading text-start">
                  <h2 className="new_hightlist_text">
                    Discover Our Categories
                  </h2>
                  <h3>Our Top Categories</h3>
                </div>

                <div className="mb-lg-0 mb-0">
                  <img className="w-100" src={homePageData?.categoryDronImage || catdrone} alt="drone-img" />
                </div>
              </Col>
              <Col lg={7}>
                <OwlCarousel className="owl-theme" {...category}>

                  {topCategoryList?.map((item, index) => (
                    <div className="item" key={index}>
                      <div className="mycategory_scrool" >
                        <Row>
                          {
                            item?.lists?.map((cat, i) => (
                              <Col
                                md="6"
                                className="mb-5 mt_space"
                                data-aos="fade-up"
                                data-aos-duration="2000"
                                key={i}
                              >
                                <div className="cat_box" >
                                  <div className="icon_img">
                                    <img
                                      src={cat.image}
                                      alt={"topcategoryimage"}
                                      style={{
                                        width: "95px",
                                        height: "95px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        margin: "auto",
                                      }}
                                    />
                                    <h3>{cat.category_name}</h3>
                                    <p>{cat?.category_description}</p>
                                  </div>
                                  <div className="mb_minus text-center">
                                    <button
                                      className="front_btn"
                                      onClick={() => getQuetesCall(cat)}
                                    >
                                      Get Quotes
                                    </button>
                                  </div>
                                </div>

                              </Col>
                            ))
                          }
                        </Row>
                      </div>
                    </div>
                  ))}

                </OwlCarousel>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* PLAY STORE AND APP STORE SECTION */}
      <section className="app_download">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col lg={6}>
              <div className="left_app_links">
                <div
                  className="main_global_heading"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                >
                  <h2 className="new_hightlist_text">{appData?.title}</h2>
                  <h3>{appData?.heading} </h3>
                  <p>{appData?.content}</p>
                </div>
                <div className="side_btn mt-3" data-aos="fade-up" data-aos-duration="2000" >
                  <a href={appData?.app_store_link || "https://play.google.com/store"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="front_btn"
                  ><AppleIcon /> App store
                  </a>

                  <a
                    href={
                      appData?.play_store_link ||
                      "https://play.google.com/store"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="front_btn"
                  >
                    <ShopIcon />
                    Play Store
                  </a>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="phone_img text-center" data-aos="fade-up" data-aos-duration="3000">
                <img src={appData?.image} alt="logo" style={{ maxWidth: "", maxHeight: "" }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="review">
        <Container>
          <div className="main_global_heading">
            <h2 className="new_hightlist_text">Testimonial</h2>
            <h3>What Our Customers Have To Say</h3>
            <p>
              See what our valued customers have to say about our drone pilot
              hire services!
            </p>
          </div>
          <div className="main_rev_box">
            <Row>
              <Col>
                <Swiper
                  autoplay={{
                    delay: 9000,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay, Pagination, Navigation]}
                  breakpoints={{
                    576: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 1,
                    },
                    991: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  spaceBetween={50}
                  loop={true}
                >
                  <>
                    {reviewList.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="review_box">
                          <div className="quote_circle">
                            <img
                              src={Quoteimg}
                              alt="logo"
                              style={{ maxWidth: "", maxHeight: "" }}
                              className="grey_img"
                            />
                            <img
                              src={Whitequote}
                              alt="logo"
                              style={{ maxWidth: "", maxHeight: "" }}
                              className="white_img"
                            />
                          </div>
                          <div className="star_rating">
                            <ul>
                              <li><StarIcon /></li>
                              <li> <StarIcon /> </li>
                              <li> <StarIcon /> </li>
                              <li> <StarIcon /> </li>
                              <li> <StarIcon /> </li>
                            </ul>
                          </div>
                          <div className="review_text">
                            <p>{item?.reviews}</p>
                          </div>

                          <div className="user_details_main">
                            <div className="user_img">
                              <img
                                src={item?.image}
                                alt={`userimages`}
                                style={{
                                  width: "95px",
                                  height: "95px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div className="user_details">
                              <h2>{item?.name}</h2>
                              <p>{item?.role}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </>
                </Swiper>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Only Poster can get a quote.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Newhome;
