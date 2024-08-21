import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Tooltip from '@mui/material/Tooltip';
import { Link, useLocation } from '../../node_modules/react-router-dom/dist/index';
import ArticleIcon from '@mui/icons-material/Article';
import { defaultUserIMG, getAllLocatData, toastifyError, toastifySuccess } from 'Utility/Utility';
// import LinkIcon from '@mui/icons-material/Link';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { axiosInstance } from 'Utility/Api';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CustomeModal from 'Utility/CustomeModal';
import ReviewModal from 'Utility/ReviewModal';
import FreePlanModal from 'Utility/FreePlanModal';
import { timeAgo } from 'Utility/Date';
import Loading from 'Utility/Loading';
import ImagePreviewModal from 'Utility/ImagePreviewModal';


const JobDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [previewImgModal, setPreviewImgModal] = useState([]);
  const JobDetails = useLocation();
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewToId, setReviewToId] = useState();
  const [isBid, setIsBid] = useState(false);
  const data = JobDetails.state ? JobDetails.state.data : null;
  const [jobDataObj, setJobDataObj] = useState({});
  const [allData, setAllData] = useState({});
  const [isReview, setIsReview] = useState();
  const [freePlanModal, setFreePlanModal] = useState(false);

  const [animalRescueData, setAnimalRescueData] = useState({});
  const [bussinessData, setBussinessData] = useState({});
  const getJobData = async () => {
    setGetLoading(true);
    const param = {
      job_id: JobDetails.state.data.jobdata._id
    };
    try {
      const res = await axiosInstance.post('/user/getJobdatas', param);
      if (res.status == 200) {
        setIsReview(res?.data?.isReview);
        setAllData(res?.data?.getjobdata);
        setBussinessData(res?.data?.getjobdata?.business_details);
        setAnimalRescueData(res?.data?.getjobdata?.animal_details);
        setJobDataObj(res?.data?.getjobdata?.jobdata);
        setGetLoading(false);
      }
    } catch (error) {
      console.log(error);
      setGetLoading(false);
      setJobDataObj({});
    }
  };
  useEffect(() => {
    if (JobDetails.state.data.jobdata._id) {
      getJobData();
    }
  }, [JobDetails.state.data.jobdata._id]);

  const [param, setParam] = useState({
    job_id: data.jobdata._id,
    amount: '',
    preposal_description: ''
  });

  const handleChange = (e) => {
    setParam({
      ...param,
      [e.target.name]: e.target.value
    });
  };

  const [error, setError] = useState({
    amount: '',
    preposal_description: ''
  });

  const [count, setCount] = useState(0);

  const validate = () => {
    setCount(count + 1);

    if (param.amount == '') {
      setError((prevValues) => {
        return { ...prevValues, ['amount']: 'Required*' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['amount']: true };
      });
    }

    if (param.preposal_description == '') {
      setError((prevValues) => {
        return { ...prevValues, ['preposal_description']: 'Required*' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['preposal_description']: true };
      });
    }
  };

  useEffect(() => {
    if (error.amount == true && error.preposal_description == true) {
      applyJob();
    }
  }, [count]);

  const applyJob = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/user/pilotPreposalRequest', param);
      if (res.data.status == 200) {
        toastifySuccess('Proposal Send Succefully');
        setIsBid(true);
        setLoading(false);
      } else {
        toastifyError('Proposal Alearedy Done By You !!');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toastifyError("Something Wen't Wrong !!");
      setLoading(false);
    }
  };

  const [proposalType, setPropsalType] = useState('');
  const acceptOrReject = async () => {
    setSubmitLoading(true);
    const param = {
      job_id: data.jobdata._id,
      status: proposalType
    };
    try {
      const res = await axiosInstance.post('/user/updateAwardedStatus', param);
      console.log(res);
      if (res.data.status == 200) {
        toastifySuccess(`You are ${proposalType} job request`);
        getJobData();
        setSubmitLoading(false);
        setShowModal(false);
      } else {
        toastifyError("Something Wen't Wrong !!");
        setShowModal(false);
        setSubmitLoading(false);
      }
    } catch (error) {
      console.log(error);
      toastifyError("Something Wen't Wrong !!");
      setSubmitLoading(false);
    }
  };

  const acceptOrRejectCall = (type) => {
    setPropsalType(type);
    setShowModal(true);
  };
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 7.25 }}>
          <Typography variant="h5" className="global_top_head tc"></Typography>
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
            <div className="task_details top_box">
              {getLoading ? (
                <>
                  <Loading />
                </>
              ) : (
                <>
                  <div className="main_pilot_top_project">
                    <div>
                      <div className="user_det">
                        <div className="user_pro">
                          <Link className="ntext" to={`/profile-details/${allData?.posterdata?._id}`}>
                            <img
                              src={allData?.posterdata?.image == '' ? defaultUserIMG : allData?.posterdata?.image}
                              alt=""
                              style={{ width: '40px', height: '40px', borderRadius: '100%' }}
                              className="grey_img"
                            />
                          </Link>
                        </div>
                        <div className="user_data">
                          <p>Posted By</p>
                          <h2>
                            {' '}
                            <Link className="ntext" to={`/profile-details/${allData?.posterdata?._id}`}>
                              {' '}
                              {allData?.posterdata && `${allData?.posterdata?.first_name + ' ' + allData?.posterdata?.last_name} `}{' '}
                            </Link>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div>
                      {jobDataObj.project_status == 'completed' && jobDataObj.pilot_id == getAllLocatData().login_id ? (
                        <>
                          {isReview ? (
                            <>
                              {' '}
                              <button className="review_btn">Completed</button>{' '}
                            </>
                          ) : (
                            <button
                              className="review_btn"
                              onClick={() => {
                                setReviewToId(data?.posterdata._id);
                                setShowReviewModal(true);
                              }}
                            >
                              Review
                            </button>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <h2 className="text-capitalize">{jobDataObj?.job_details?.name}</h2>
                  <Row>
                    <Col md={6}>
                      <div className="user_location">
                        <div className="user_icon">
                          <LocationOnIcon />
                        </div>

                        <div className="location_det">
                          <p>Location</p>
                          {jobDataObj.job_type == 'animal' ? (
                            <h2>
                              {' '}
                              {animalRescueData &&
                                `${animalRescueData?.location + ', ' + animalRescueData?.state + ', ' + animalRescueData?.city} `}
                            </h2>
                          ) : jobDataObj.job_type == 'business' ? (
                            <h2> {bussinessData && `${bussinessData?.location} `}</h2>
                          ) : (
                            <h2> {jobDataObj && `${jobDataObj?.location + ', ' + jobDataObj?.street} `}</h2>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                    <div className="user_location">
                      <div className="user_icon">
                        <CalendarTodayIcon />
                      </div>

                      <div className="location_det">
                        <p>Date</p>
                        {jobDataObj.job_type == 'animal' ? (
                          <h2> {animalRescueData && `${timeAgo(animalRescueData?.created_at)} `}</h2>
                        ) : jobDataObj.job_type == 'business' ? (
                          <h2> {bussinessData && `${timeAgo(bussinessData?.createdAt)} `}</h2>
                        ) : (
                          <h2>{jobDataObj?.due_date_type ? jobDataObj?.due_date_type : jobDataObj?.work_due_date}</h2>
                        )}
                      </div>
                    </div>
                    </Col>
                  </Row>

                  {jobDataObj?.job_type == 'animal' && (
                    <div className="task_details_des text-capitalize mt-0">
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>animal_type</strong>
                            <h2>{animalRescueData?.animal_type}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>assert_volunteers</strong>
                            <h2>{animalRescueData?.assert_volunteers}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>chip_number</strong>
                            <h2>{animalRescueData?.chip_number}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>collar_describe</strong>
                            <h2>{animalRescueData?.collar_describe}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>disaster_name</strong>
                            <h2>{animalRescueData?.disaster_name}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>email</strong>
                            <h2>{animalRescueData?.email}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>evacuated</strong>
                            <h2>{animalRescueData?.evacuated}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>help_type</strong>
                            <h2>{animalRescueData?.help_type}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>last_seen_details</strong>
                            <h2>{animalRescueData?.last_seen_details}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>microchip</strong>
                            <h2>{animalRescueData?.microchip}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>missing_details</strong>
                            <h2>{animalRescueData?.missing_details}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>my_animal</strong>
                            <h2>{animalRescueData?.my_animal}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>name</strong>
                            <h2>{animalRescueData?.name}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>natural_disaster</strong>
                            <h2>{animalRescueData?.natural_disaster}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>notify_by</strong>
                            <h2>{animalRescueData?.notify_by}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>phone</strong>
                            <h2>{animalRescueData?.phone}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>wearing_collar</strong>
                            <h2>{animalRescueData?.wearing_collar}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>whos_animal</strong>
                            <h2>{animalRescueData?.whos_animal}</h2>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  {jobDataObj?.job_type == 'business' && (
                    <div className="task_details_des text-capitalize mt-0">
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>job_title</strong>
                            <h2>{bussinessData?.job_title}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>company_name</strong>
                            <h2>{bussinessData?.company_name}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>job_type</strong>
                            <h2>{bussinessData?.job_type}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>notify_by</strong>
                            <h2>{bussinessData?.notify_by}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>state</strong>
                            <h2>{bussinessData?.state}</h2>
                          </div>
                        </Grid>

                        <Grid item xs={12}>
                          <div className="box">
                            <strong>description</strong>
                            <h2>{bussinessData?.description}</h2>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className="box">
                            <strong>logo</strong>
                            <div>
                              <button
                                onClick={() => {
                                  setImgModal(true);
                                  setPreviewImgModal([bussinessData?.logo]);
                                }}
                              >
                                <img src={bussinessData?.logo} alt="images" style={{ height: '60px', width: '60px' }} />
                              </button>
                            </div>
                          </div>
                        </Grid>
                        {bussinessData?.images?.length > 0 && (
                          <Grid item xs={4}>
                            <div className="box">
                              <strong>images</strong>
                              <div>
                                <button
                                  onClick={() => {
                                    setImgModal(true);
                                    setPreviewImgModal(bussinessData?.images);
                                  }}
                                >
                                  <img src={bussinessData?.images[0]} alt="images" style={{ height: '60px', width: '60px' }} />
                                </button>
                                {bussinessData.images.length > 1 && <div>{`${bussinessData.images.length - 1} + `}</div>}
                              </div>
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </div>
                  )}

                  <div className="task_details_des text-capitalize">
                    <Grid container spacing={2}>
                      {jobDataObj?.job_details?.need_you_there_for && (
                        <Grid item xl={12}>
                          <div className="box">
                            <strong>- Need you there for</strong>
                            <h2>{jobDataObj?.job_details?.need_you_there_for}</h2>
                          </div>
                        </Grid>
                      )}
                      {jobDataObj?.job_details?.location_nearest_town && (
                        <Grid item xl={12}>
                          <div className="box">
                            <strong>- location nearest town</strong>
                            <h2> - {jobDataObj?.job_details?.location_nearest_town}</h2>
                          </div>
                        </Grid>
                      )}
                      {jobDataObj?.job_details?.its_for_a?.length > 0 && (
                        <Grid item xl={12}>
                          <div className="box">
                            <div>
                              <strong>- its for a</strong>
                            </div>
                            - {jobDataObj?.job_details.its_for_a?.map((item, i) => (
                              <>
                                <span key={i}>{item}</span>
                                {i < jobDataObj.job_details?.its_for_a.length - 1 && <span>, </span>}
                              </>
                            ))}
                          </div>
                        </Grid>
                      )}
                      {jobDataObj?.job_details?.quate_me_for?.length > 0 && (
                        <Grid item xl={12}>
                          <div className="box">
                            <div>
                              <strong>- Quote me for</strong>
                            </div>
                            - {jobDataObj?.job_details?.quate_me_for?.map((item, i) => (
                              <>
                                <span key={i}>{item}</span>
                                {i < jobDataObj.job_details?.quate_me_for.length - 1 && <span>, </span>}
                              </>
                            ))}
                          </div>
                        </Grid>
                      )}
                      {jobDataObj?.job_details?.inspect_a?.length > 0 && (
                        <Grid item xl={12}>
                          <div className="box">
                            <div>
                              <strong>- inspect a</strong>
                            </div>
                           - {jobDataObj?.job_details.inspect_a?.map((item, i) => (
                              <>
                                <span key={i}>{item}</span>
                                {i < jobDataObj.job_details?.inspect_a.length - 1 && <span>, </span>}
                              </>
                            ))}
                          </div>
                        </Grid>
                      )}
                      {jobDataObj?.job_details?.what_kind_country && (
                        <Grid item xl={12}>
                          <div className="box">
                            <strong>-what kind country</strong>
                            -<h2>{data.jobdata.job_details.what_kind_country}</h2>
                          </div>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                  {jobDataObj?.job_details?.task_description && (
                    <div className="main_cnt task_details_des  mt-4 mb-3">
                      <div><strong>- Task Details</strong></div>
                      <div dangerouslySetInnerHTML={{ __html: jobDataObj?.job_details?.task_description }} />
                    </div>
                  )}

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <span><strong>- Task Attachments</strong></span>
                    <div className="attach_ment_details">
                  
                      {jobDataObj?.attachment?.length > 0 &&
                        jobDataObj?.attachment?.map((item, i) => (
                          <>
                          
                            <Tooltip title="Download file">
                           
                              <button onClick={() => downloadFile(item)} key={i} className="Download_btn">
                                <ArticleIcon />
                                Attachments {i + 1}
                              </button>
                            </Tooltip>
                          </>
                        ))}
                    </div>
                  </Grid>
                </>
              )}
            </div>
          </Grid>

          {getLoading ? (
            <>
              <Grid item xl={4} lg={4} md={10} sm={10} xs={10}>
                <div className="global_card_box top_box req_box">
                  <div className="heding_details_box">
                    <div className="Quotesection quote_req">
                      <div className="main-req_outer d-flex justify-content-between align-items-center">
                        <div className="req_pop_up">
                          <div className="d-flex justify-content-center">
                            <p>
                              <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true" />
                              Loading...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </>
          ) : jobDataObj.pilot_id == getAllLocatData()?.login_id &&
            jobDataObj.status == 'accepted' &&
            jobDataObj.awarded_status == 'pending' ? (
            <>
              <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                <div className="global_card_box top_box req_box">
                  <div className="top_heading_card_outer">
                    <p className="top_heading_card">Poster Request</p>
                  </div>

                  <div className="heding_details_box">
                    <div className="Quotesection quote_req">
                      <div className="main-req_outer">
                        <div className="req_pop_up">
                          <div className="poster_img">
                            <img
                              src={allData.posterdata.image == '' ? defaultUserIMG : allData.posterdata.image}
                              alt=""
                              style={{ maxWidth: '', maxHeight: '' }}
                              className="grey_img"
                            />
                          </div>
                          <div>
                            {' '}
                            <p className="text-capitalize">
                              {data.posterdata?.first_name} Awarded You{' '}
                              <span className="highlight_txt d-block">@ {jobDataObj.job_details.name}</span>
                            </p>
                          </div>
                        </div>
                        <div className="option_req_btn mt-3">
                          <button className="accept_btn text-success" onClick={() => acceptOrRejectCall('accepted')}>
                            <CheckIcon />
                            Accept
                          </button>
                          <button className="reject_btn text-danger" onClick={() => acceptOrRejectCall('pendding')}>
                            <CloseIcon />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </>
          ) : jobDataObj.awarded_status == 'accepted' ? (
            <>
              <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                <div className="global_card_box top_box req_box">
                  <div className="top_heading_card_outer">
                    <p className="top_heading_card">Poster Request</p>
                  </div>

                  <div className="heding_details_box">
                    <div className="Quotesection quote_req">
                      <div className="main-req_outer d-flex justify-content-between align-items-center">
                        <div className="req_pop_up">
                          <div className="poster_img">
                            <img
                              src={allData.posterdata.image == '' ? defaultUserIMG : allData.posterdata.image}
                              alt=""
                              style={{ maxWidth: '', maxHeight: '' }}
                              className="grey_img"
                            />
                          </div>
                          <div>
                            {' '}
                            <p className="text-capitalize"> You are accepted @ {allData?.posterdata?.first_name} request !!</p>
                          </div>
                        </div>
                        {/* <div className="">
                            <button
                              className="chat_btn"
                              onClick={() => {
                                toastifySuccess('Wait ...');
                              }}
                            >
                              View Chat
                            </button>
                          </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </>
          ) : (data.bidding_status == 'Submitted' && jobDataObj.awarded_status == 'pending') || isBid ? (
            <>
              <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                <div className="global_card_box top_box req_box">
                  <div className="top_heading_card_outer">
                    <p className="top_heading_card">Alert</p>
                  </div>

                  <div className="heding_details_box">
                    <div className="Quotesection quote_req">
                      <div className="main-req_outer d-flex justify-content-between align-items-center">
                        <div className="req_pop_up">
                          <div className="poster_img">
                            <img
                              src={getAllLocatData()?.img == '' ? defaultUserIMG : getAllLocatData().img}
                              alt=""
                              style={{ maxWidth: '', maxHeight: '' }}
                              className="grey_img"
                            />
                          </div>
                          <div>
                            {' '}
                            <p className="text-capitalize">
                              {' '}
                              You quoted a price of AUD <strong>{allData?.bidding_amount || param.amount}</strong> for this job
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </>
          ) : (
            <>
              {getAllLocatData()?.subcription_type == 'free' || getAllLocatData()?.subcription_type == '' ? (
                <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                  <div className="global_card_box py-4 text-center">
                    <p className="top_heading_card">Please upgrade your current plan to enable us to submit quotes for jobs !!</p>
                  </div>
                </Grid>
              ) : (
                <>
                  <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                    <div className="global_card_box top_box req_box">
                      <div className="top_heading_card_outer">
                        <p className="top_heading_card">Place a Quote on this task</p>
                      </div>
                      {getAllLocatData()?.subcription_type == 'free' || getAllLocatData()?.subcription_type == '' ? (
                        <>
                          <p className="px-3">Please upgrade your current plan to enable us to submit quotes for jobs !!</p>
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="heding_details_box ">
                        <div className="Quotesection">
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <div className="group  error">
                                <input
                                  className="inputMaterial"
                                  type="text"
                                  name="amount"
                                  value={param.amount}
                                  onChange={handleChange}
                                  placeholder="Enter Your Amount"
                                />
                                <label htmlFor="firstName">Your Amount</label>
                                <span className="bar"></span>
                                <span className="errmsg">{error.amount}</span>
                              </div>
                            </Grid>

                            <Grid item xs={12} className="pt-0">
                              <div className="dec_text">
                                <strong>description</strong>

                                <textarea
                                  placeholder="description"
                                  value={param.preposal_description}
                                  name="preposal_description"
                                  onChange={handleChange}
                                >
                                  {param.preposal_description}
                                </textarea>
                                <span className="errmsg">{error.preposal_description}</span>
                              </div>

                              <div className="text-end mt-3">
                                {loading ? (
                                  <>
                                    <button className="global_btn">
                                      <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {getAllLocatData()?.subcription_type == 'free' || getAllLocatData()?.subcription_type == '' ? (
                                      <button
                                        className="global_btn"
                                        onClick={() => setFreePlanModal(true)}
                                        disabled
                                        style={{ cursor: 'not-allowed' }}
                                      >
                                        Submit
                                      </button>
                                    ) : (
                                      <button className="global_btn" onClick={validate}>
                                        Submit
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
        <CustomeModal
          {...{ showModal, setShowModal, submitLoading }}
          handleFunc={acceptOrReject}
          modalMsg={`are you sure ? you want to ${proposalType == 'pendding' ? 'Rejected' : proposalType} this request`}
        />
        <ReviewModal {...{ showReviewModal, setShowReviewModal, reviewToId }} job_id={JobDetails?.state?.data?.jobdata._id} />
        {freePlanModal ? (
          <FreePlanModal
            msg={'Please upgrade your current plan to enable us to submit quotes for jobs !!'}
            freePlanModal={freePlanModal}
            setFreePlanModal={setFreePlanModal}
          />
        ) : (
          <></>
        )}
      </Grid>

      <ImagePreviewModal show={imgModal} previewImg={previewImgModal} onHide={() => setImgModal(false)} />
    </div>
  );
};

export default JobDetails;
