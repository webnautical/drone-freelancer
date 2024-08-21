import React from 'react';
import Herodrone from '../../assets/images/drone.png';
import { Container, Row, Col } from 'react-bootstrap';
// import Getimage from '../../assets/images/get (1).png';
// import Getimage1 from "../../assets/images/get (2).png";
// import Getimage2 from "../../assets/images/get (3).png";
// import Posimg from '../../assets/images/posimg.png';
// import Optionimg from '../../assets/images/option (1).png';
// import Optionimgtwo from '../../assets/images/option (2).png';
// import Optionimgthree from '../../assets/images/option (3).png';
import Dronepng from '../../assets/images/droneicon.png';
import Arrowsvg from '../../assets/images/arrow.svg';
// import Respng from '../../assets/images/res.png';
// import Phone from '../../assets/images/phone.png';
// import Userimg from '../../assets/images/user.png';
import Quoteimg from '../../assets/images/left-quote.png';
import Whitequote from '../../assets/images/wleft-quote.png';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import StarIcon from '@mui/icons-material/Star';
import AppleIcon from '@mui/icons-material/Apple';
import ShopIcon from '@mui/icons-material/Shop';
import config from 'config';
import { useState, useEffect } from 'react';
import baner from '../../assets/images/sliderbanner.png';
import { getAllLocatData } from 'Utility/Utility';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from '@mui/material/Button';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Home = () => {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [staticdata, setStaticdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [recorddata, setRecorddata] = useState([]);
  const [dronImg, setDronImg] = useState();
  const [bannerImg, setBannerImg] = useState();
  const [userRecord, setUserRecord] = useState('');
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/admin/getHomePageContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data.message === 'home content data get successfully') {
            setDronImg(data?.addHomecontent[0]?.dronImage);
            setBannerImg(data?.addHomecontent[0]?.banerImage);
            setStaticdata(data.addHomecontent);
          } else {
            setDronImg(Herodrone);
            setBannerImg(baner);
            setStaticdata([]);
          }
        });
    } catch (error) {
      setDronImg(Herodrone);
      setBannerImg(baner);
      setStaticdata([]);
    }
  };
 
  const getDataTopcategory = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/admin/getTopcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.message === 'get data successfully') {
            setFilteredData(res.getallcategory);
            // setLoading(false);
          }
          // setLoading(false);
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };
 
  const getReviewsData = async () => {
    // setLoading(true);
    try {
      fetch(`${config.url}/admin/getAllReviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((res) => {
          if (res.message === 'get data successfully') {
            setRecorddata(res.getallreview);
          } else {
            setRecorddata([]);
          }
        });
    } catch (error) {
      console.log(error);
      setRecorddata([]);
    }
  };
  const getAppdata = async () => {
    try {
      fetch(`${config.url}/admin/getAppLinkcontent`, {
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
          console.log(data, 'data');
          if (data.message === 'get data successfully') {
            setUserRecord(data.getApplinkModel);
          }
          // setloading(false);
        });
    } catch (error) {
      console.log(error);
      // setloading(false);
    }
  };
  useEffect(() => {
    getAppdata();
    getData();
    getDataTopcategory();
    getReviewsData();
  }, []);
 
  const getQuetesCall = (item) => {
    if (!getAllLocatData()?.jwt) {
      navigate('/login')
    } else {
      if (getAllLocatData()?.user_type == "Pilot") {
        setOpen(true);
      } else {
        navigate('/user/postjob', { state: { details: item } })
      }
    }
  }
 
  const navigatePage = (page) => {
    const text = page.toLowerCase().replace(/\s+/g, '-');
    console.log(text)
    if (text == 'get-a-quote!') {
      getQuetesCall()
    } else if(text == 'business-employment-portal'){
      navigate(`/page?v=${text}`)
    }else if(text == 'search-pilots!'){
      navigate(`/pilot-map`)
    } else {
      navigate(`/${text}`)
    }
  }

  return (
    <div>
      <section
        className="slider_section"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
      >
        <div className="slider_box" data-aos="fade-up" data-aos-duration="2000">
          <img src={dronImg} alt="" style={{ maxWidth: '', maxHeight: '' }} />
        </div>
      </section>
 
      <section className="hero_content">
        <Container>
          <Row className="justify-content-center">
            <Col lg="10">
              <>
                {staticdata.length > 0 && (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: staticdata[0]?.ptag }} />
                  </>
                )}
              </>
            </Col>
          </Row>
        </Container>
      </section>
 
      <section className="get_start">
        <Container>
          <>
            <div className="global_heading" data-aos="fade-up" data-aos-duration="1000">
              {/* <h2>
                {staticdata[0]?.getstartedsection?.tital}
              </h2> */}
              <div dangerouslySetInnerHTML={{ __html: staticdata[0]?.getstartedsection?.tital }} />
 
              {/* <div className="pos_img">
                <img src={Posimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
              </div> */}
            </div>
            <Row className="get_q">
              {staticdata[0]?.getstartedsection?.quates?.map((row,i) => (
                <Col lg="6" xl="4" className="mb-5" data-aos="fade-up" data-aos-duration="1000" key={row._id}>
                  <div className="faicility_box">
                    <div className="icon_text">
                      <div className="image_box">
                        <img src={row.image} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
                      </div>
                      <div className="text_box">
                        <h3>{row.tital}</h3>
                        <p>{row.subheading} </p>
                      </div>
                    </div>
                    {
                      i === 0 ?
                      <button className="front_btn w-100" onClick={() => navigatePage( i == 0 ? 'get-quotes' : i == 1 ? 'login' : i == 2 ? 'business-employment-portal' : row.tital)}>Get a Quote!</button>
                      :
                      i === 1 ?
                      <button className="front_btn w-100" onClick={() => navigatePage( i == 0 ? 'get-quotes' : i == 1 ? 'login' : i == 2 ? 'business-employment-portal' : row.tital)}>Join Us!  </button>
                      :
                      <button className="front_btn w-100" onClick={() => navigatePage( i == 0 ? 'get-quotes' : i == 1 ? 'login' : i == 2 ? 'business-employment-portal' : row.tital)}>Get A Pilot!</button>
                    }
                  </div>
                </Col>
              ))}
            </Row>
          </>
        </Container>
      </section>
 
      <section className="how_work">
        <Container>
          <Row>
            <>
              <div className="main_global_heading" data-aos="fade-up" data-aos-duration="2000">
                <h2>{staticdata[0]?.howitworksection?.subheading}</h2>
                <h3>
                  {staticdata[0]?.howitworksection?.tital}
                  {/* <span className="breack_word"> Meet Your Requirements</span> */}
                </h3>
               {/* <p> At Drone Freelancer, we can tailor the search for pilots that meet your exact criteria and skill requirements, providing you with the best quotes for your job! Or you can take a look through our directory yourself to choose your pilot based on your specific requirements.</p> */}
               <p>{staticdata[0]?.howitworksection?.content}</p>
              </div>
 
              <div className="option_box">
                <Row className="justify-content-center">
                  {staticdata[0]?.howitworksection?.option.map((option, index) => (
                    <Col lg="4" key={option._id}>
                      <div className="option_inner" data-aos="fade-up" data-aos-duration={1000 + index * 500}>
                        <h6>{option.tital}</h6>
                        <img className="optin_img" src={option.image} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
 
                        <ul>
                          {option.points.map((point, pointIndex) => (
                            <div key={pointIndex}>
                              <img src={pointIndex % 7 === 0 ? Dronepng : Arrowsvg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
 
                              {
                                pointIndex == option.points.length - 1 ?
                                  <div className='d-flex justify-content-center mt-2'><button className='global_btn d-block' onClick={() => navigatePage(point)}>{point}</button></div> : <> <li>{point}</li></>
                              }
                            </div>
                          ))}
                        </ul>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          </Row>
        </Container>
      </section>
 
      <section className="top_cat">
        <Container>
          <div className="main_global_heading">
            <h2>Our Top Categories</h2>
          </div>
          <div className="cat_main">
            <Row>
              <>
                {filteredData.map((item, index) => (
                  <Col
                    key={index}
                    md="6"
                    lg="4"
                    xl="3"
                    className="mb-5"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                  >
                    <div className="cat_box">
                      <div className="icon_img">
                        <img
                          src={item.image}
                          alt={'topcategoryimage'}
                          style={{
                            width: '95px',
                            height: '95px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <h3>{item.category_name}</h3>
                        <p>{item?.category_description}</p>
                      </div>
                    </div>
                    <div className="mb_minus text-center">
                      <button className="front_btn" onClick={() => getQuetesCall(item)}>Get Quotes</button>
                    </div>
                  </Col>
                ))}
              </>
            </Row>
          </div>
        </Container>
      </section>
 
      <section className="app_download">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md="6">
              <div className="left_app_links">
                <div className="main_global_heading" data-aos="fade-up" data-aos-duration="2000">
                  <h2>{userRecord?.title}</h2>
                  <h3>{userRecord?.heading} </h3>
                  {/* <p>Our customers wanted to access drone freelancers from anywhere, whether in the office or on the go. Now, you can do so with our downloadable app for Apple and Android devices.</p> */}
                  <p>{userRecord?.content}</p>
                </div>
                <div className="side_btn mt-5" data-aos="fade-up" data-aos-duration="2000">
                  {/* <button className="front_btn ">
                    {' '}
                    <AppleIcon />
                    App Store{' '}
                  </button> */}
                  <a
                    href={userRecord?.app_store_link || 'https://play.google.com/store'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="front_btn"
                  >
                    <AppleIcon />
                    App store
                  </a>
                  {/* <button className="front_btn ">
                    <ShopIcon />
                    Play Store
                  </button> */}
                  <a
                    href={userRecord?.play_store_link || 'https://play.google.com/store'}
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
            <Col>
              <div className="phone_img text-center" data-aos="fade-up" data-aos-duration="3000">
                {/* <img src={Phone} alt="logo" style={{ maxWidth: '', maxHeight: '' }} /> */}
                <img src={userRecord?.image} alt="logo" style={{ maxWidth: '', maxHeight: '' }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
 
      <section className="review">
        <Container>
          <div className="main_global_heading">
            <h2 className='top_rev_heading'>Testimonial</h2>
            <h3>What Our Customers Have To Say</h3>
            <p>See what our valued customers have to say about our drone pilot hire services!</p>
          </div>
          <div className="main_rev_box">
            <Row>
              <Col>
                <Swiper
                  autoplay={{
                    delay: 9000,
                    disableOnInteraction: false
                  }}
                  modules={[Autoplay, Pagination, Navigation]}
                  breakpoints={{
                    576: {
                      slidesPerView: 1
                    },
                    768: {
                      slidesPerView: 1
                    },
                    991: {
                      slidesPerView: 3
                    },
                    1024: {
                      slidesPerView: 3
                    }
                  }}
                  spaceBetween={50}
                  loop={true}
 
                // onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log( slide change )}
                >
                  <>
                    {recorddata.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="review_box">
                          <div className="quote_circle">
                            <img src={Quoteimg} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            <img src={Whitequote} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="white_img" />
                          </div>
                          <div className="star_rating">
                            <ul>
                              <li>
                                <StarIcon />
                              </li>
                              <li>
                                <StarIcon />
                              </li>
                              <li>
                                <StarIcon />
                              </li>
                              <li>
                                <StarIcon />
                              </li>
                              <li>
                                <StarIcon />
                              </li>
                            </ul>
                          </div>
                          <div className="review_text">
                            <p>
                              {item?.reviews}
                              {/* Lorem Ipsum is simply dummy text of the printing and
                              typesetting industry. Lorem Ipsum has been the
                              industry s standard dummy text ever since the 1500s. */}
                            </p>
                          </div>
 
                          <div className="user_details_main">
                            <div className="user_img">
                              <img
                                src={item?.image}
                                alt={`userimages`}
                                style={{
                                  width: '95px',
                                  height: '95px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
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
 
export default Home;