
import * as React from 'react';
import { Grid, Typography } from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../../assets/css/styleposter.css';
import reviewImg from '../../assets/images/no-review.png';
// import Loading from 'Utility/Loading';
import config from 'config';
import { timeAgo } from 'Utility/Date';
import { Skeleton } from '../../../node_modules/@mui/material/index';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { defaultUserIMG } from 'Utility/Utility';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import ThereAreNoData from 'Utility/ThereAreNoData';
import { axiosInstance } from 'Utility/Api';
import { getAllLocatData } from 'Utility/Utility';
// import DeleteProfileButton from 'Utility/DeleteProfileButton';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const navigate = useNavigate();
  const [postAJobList, setPostAJob] = React.useState([]);
  const [posterInfo, setPosterInfo] = React.useState({});
  const [filter, setFilter] = React.useState([])
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState('all')
  const [reviewList, setReviewList] = React.useState([])
  const [productCount, setProductCount] = React.useState({})
  const [countLoad, setCountLoad] = React.useState(false)
  const getPostData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.url}/user/getAllPostedJobsByposter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        setPostAJob(resultdata?.getpostedjob);
        setFilter(resultdata?.getpostedjob)
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getProductCount = async () => {
    setCountLoad(true);
    try {
      const res = await axiosInstance.post(`user/postedJobscount/${getAllLocatData()?.login_id}`)
      if (res?.status == 200) {
        setProductCount(res.data)
        setCountLoad(false);
      } else {
        setProductCount({})
        setCountLoad(false);
      }
    } catch (error) {
      setCountLoad(false);
      setProductCount({})
    }
  }

  const getProfileInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.url}/user/getUserdatas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        setPosterInfo(resultdata?.getUserdata);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getPostData();
    getProfileInfo();
    getReview()
    getProductCount()
  }, []);

  const updateProfile = () => {
    navigate('/user/poster-update-profile', { state: { posterInfo } });
  };
  const goToViewDetails = (data) => {
    navigate('/user/jobs-details', { state: { data } });
  };

  const handleChangeFilter = (type) => {
    setSort(type)
    if (type == "pendding") {
      const filterData = postAJobList.filter((item) => {
        return item.status == type
      });
      setFilter(filterData)
    }
    if (type == "accepted") {
      const filterData = postAJobList.filter((item) => {
        return item.status == type
      });
      setFilter(filterData)
    }
    if (type == "completed") {
      const filterData = postAJobList.filter((item) => {
        return item.project_status == type
      });
      setFilter(filterData)
    }
    if (type == "all") {
      setFilter(postAJobList)
    }
  }
  const getReview = async () => {
    try {
      const res = await fetch(`${config.url}/user/getAllReviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resRes = await res.json();
      setReviewList(resRes.getallreviews);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ mt: 3.25 }}>
        <Typography variant="h5" className="global_top_head">
          Dashboard
        </Typography>
      </Grid>

      <Grid className="pt-4" item xl={8} lg={8} order={{ xs: 2, md: 2, xl: 1, lg: 1 }}>
        {countLoad ? (
          <Grid container spacing={2} className="count_main">
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <Skeleton variant="rectangular" width={200} height={30} />
                <Skeleton variant="circular" width={30} height={30} className="mt-2" />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <Skeleton variant="rectangular" width={200} height={30} />
                <Skeleton variant="circular" width={30} height={30} className="mt-2" />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <Skeleton variant="rectangular" width={200} height={30} />
                <Skeleton variant="circular" width={30} height={30} className="mt-2" />
              </div>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} className="count_main">
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <p>Total Posted Jobs</p>
                <h2>{productCount?.totalJobs}</h2>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <p>Total Hires</p>
                <h2>{productCount?.totalAwarded}</h2>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="details_count_box top_box">
                <p>Completed</p>
                <h2>{productCount?.totalCompleted}</h2>
              </div>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="posted_job_list">
              <div className="top_heding">
                <h2>{sort} Job List {filter.length}</h2>
                <div>
                  {' '}
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="sort_btn">
                    <Select value={sort} onChange={(e) => handleChangeFilter(e.target.value)} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                      <MenuItem value='all'>All</MenuItem>
                      <MenuItem value={'pendding'}>Posted</MenuItem>
                      <MenuItem value={'accepted'}>Awarded</MenuItem>
                      <MenuItem value={'completed'}>Completed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="post_listing_box">
                {loading ? (
                  <div>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                      <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <div className='d-flex justify-content-between'>
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      </div>

                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                      <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <div className='d-flex justify-content-between'>
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      </div>

                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                      <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <div className='d-flex justify-content-between'>
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                        <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      </div>

                    </Grid>


                  </div>
                ) : (
                  filter.length > 0 ?
                    filter?.map((item, i) => (
                      <div className="job_list_box" key={i}>
                        <Grid container spacing={2}>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div className="job_tittle_box">
                              <h2>{item.job_details.name}</h2>
                              <div dangerouslySetInnerHTML={{ __html: item.job_details?.task_description }} />
                            </div>
                          </Grid>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <div className="job_option_main">
                              <div className="job_option">
                                <div className="posted_date">{timeAgo(item.created_at)}</div>
                                <div className="job_amount">
                                  {item.status == 'pendding' ? (
                                    <p className="text-danger fw-bold">Not Awarded</p>
                                  ) : (
                                    <p className="text-success fw-bold">Awarded</p>
                                  )}
                                </div>
                              </div>
                              <div className="view_btn">
                                <button className="global_btn" onClick={() => goToViewDetails(item)}>
                                  View Details
                                </button>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    ))
                    :
                    <ThereAreNoData title={<div className="global_no_data">There are no listings yet.<span>Looks like you haven&apos;t Award any tasks yet.</span></div>} />
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid className="pt-4" item xl={4} lg={4} md={12} xs={12} order={{ xs: 1, md: 1, xl: 2, lg: 1 }}>
        <Grid item xs={12} sx={{ mb: 3.25 }}>
          <div className="profile_poster_box details_count_box top_box">
            {loading ? (
              <div className='d-flex' style={{ gap: '10px' }}>
                <div> <Skeleton variant="circular" width={84} height={84} /></div>
                <div><Skeleton className="mt-2" variant="rectangular" width={170} />
                  <Skeleton className="mt-2" variant="rectangular" width={150} />
                  <Skeleton className="mt-2" variant="rectangular" width={40} /></div>
              </div>
            ) : (
              <>
                <div className="global_wbtn">
                  <button onClick={() => updateProfile(posterInfo)}>
                    Edit Profile <ArrowForwardIosIcon />
                  </button>
                </div>
                <div className="main_pro_box">
                  <div className="profile_img_poster">
                    <img src={posterInfo.image ? posterInfo.image : defaultUserIMG} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                  </div>
                  <div className="prfile_photo_details">
                    <div className="prfile_photo_details_name">{posterInfo?.first_name}</div>
                    <div className="prfile_photo_details_gmail">
                      <MailIcon />
                      {posterInfo?.email}
                    </div>
                    {
                      posterInfo?.phone != '' &&
                      <div className="prfile_photo_details_phone">
                        <CallIcon />
                        {posterInfo?.phone}
                      </div>
                    }
                  </div>
                </div>
                {/* <div className='text-end'>
                <DeleteProfileButton />
                </div> */}
              </>
            )}
          </div>
        </Grid>

        <Grid item xs={12} sx={{ mb: 3.25 }}>
          <div className="">
            <div className="top_heding mt-5">
              <h2>Review</h2>
            </div>

            <div className="review_listings">
              <ul>
                {
                  loading ? <>
                    <div>
                      <Skeleton variant="rectangular" width={150} height={15} />
                      <li>
                        <Skeleton variant="circular" width={40} height={40} className="mt-0" />
                        <Skeleton variant="rectangular" width={100} height={30} />
                        <Skeleton variant="rectangular" width={200} height={30} />
                      </li>
                    </div>
                    <div className='mt-2'>
                      <Skeleton variant="rectangular" width={150} height={15} />
                      <li>
                        <Skeleton variant="circular" width={40} height={40} className="mt-0" />
                        <Skeleton variant="rectangular" width={100} height={30} />
                        <Skeleton variant="rectangular" width={200} height={30} />
                      </li>
                    </div>
                  </>
                    :
                    reviewList?.length > 0 ?
                      reviewList?.map((item, i) => (
                        <>

                          <li key={i} className='mt-0 pt-0'>
                            <div className="review_user">
                              <div className="img_user">
                                <img src={item.reviewerImage ? item.reviewerImage : defaultUserIMG} alt="logo" style={{ maxWidth: '', maxHeight: '', borderRadius: '100%' }} className="grey_img" />
                              </div>
                              <span className="user_name text-capitalize">{item?.reviewerFirstname + ' ' + item?.reviewerLastname}</span>
                            </div>
                            <span className='m-0 p-0'>{timeAgo(item.reviewedAt)}</span>
                            <div className="rating">
                              <ul>
                                <li>
                                  <Stack spacing={1}>
                                    <Rating name="half-rating-read" defaultValue={item.rating} precision={0.5} readOnly />
                                  </Stack>
                                </li>
                              </ul>
                            </div>

                          </li>
                        </>
                      ))
                      :
                      <>
                        <div className='empty_list_area text-center mt-5' style={{ width: '100%' }}>
                          <img src={reviewImg} alt="" style={{ maxWidth: '250px', maxHeight: '' }} className="" />
                          <p className='text-capitalize'>{<div className="global_no_data">There are no listings yet.<span>Looks like you haven&apos;t Award any tasks yet.</span></div>}</p>
                        </div>
                      </>
                }
              </ul>
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
