import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import Tooltip from '@mui/material/Tooltip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArticleIcon from '@mui/icons-material/Article';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from '../../node_modules/react-router-dom/dist/index';

import { axiosInstance } from 'Utility/Api';
import config from 'config';
import Loading from 'Utility/Loading';
import { defaultUserIMG, toastifyError, toastifySuccess } from 'Utility/Utility';
import CustomeModal from 'Utility/CustomeModal';
import ReviewModal from 'Utility/ReviewModal';
import { timeAgo } from 'Utility/Date';
import ImagePreviewModal from 'Utility/ImagePreviewModal';

const PostAJobDetails = () => {
  const navigate = useNavigate();
  const JobDetails = useLocation();
  // const JobDetailsData = JobDetails.state ? JobDetails.state.data : null;
  const [JobDetailsData, setJobDetails] = useState({});
  const [allData, setAllData] = useState({});
  const [animalRescueData, setAnimalRescueData] = useState({});
  const [bussinessData, setBussinessData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [previewImgModal, setPreviewImgModal] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [pilotID, setPilotID] = useState();

  const getJobData = async () => {
    setLoading(true);
    const param = {
      job_id: JobDetails.state.data._id
    };
    try {
      const res = await axiosInstance.post('/user/getJobdatas', param);
      if (res.status == 200) {
        setAllData(res?.data);
        setJobDetails(res?.data?.getjobdata?.jobdata);
        setAnimalRescueData(res?.data?.getjobdata?.animal_details);
        setBussinessData(res?.data?.getjobdata?.business_details);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (JobDetails?.state?.data?._id || showReviewModal == false) {
      getJobData();
      getPilotRequest();
    }
  }, [JobDetails?.state?.data?._id, showReviewModal]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [getProposalReqList, setProposalReqList] = useState([]);
  const param = {
    job_id: JobDetails.state.data._id
  };

  const getPilotRequest = async () => {
    try {
      fetch(`${config.url}/user/getPilotPreposalList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify(param)
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status == 200) {
            setProposalReqList(data.pilotdata);
          } else {
            setProposalReqList([]);
          }
        });
    } catch (error) {
      console.log(error);
      setProposalReqList([]);
    }
  };

  const goToChat = (item) => {
    navigate('/user/chats', { state: { data: item, JobDetailsData: JobDetailsData } });
  };

  const [proposalId, setProposalId] = useState();
  const [showModal, setShowModal] = useState(false);

  const awardedJob = async () => {
    setSubmitLoading(true);
    const param = { preposal_id: proposalId };
    try {
      const res = await axiosInstance.post('/user/acceptPreposalRequestByposter', param);
      if (res.status == 200) {
        setSubmitLoading(false);
        toastifySuccess('Job Awared Successfully !!');
        setShowModal(false);
        getJobData();
        getPilotRequest();
      } else {
        toastifyError('Something Went Wrong !!');
        setShowModal(false);
        setSubmitLoading(false);
      }
    } catch (error) {
      toastifyError('Something Went Wrong !!');
      console.error('Error:', error);
      setShowModal(false);
      setSubmitLoading(false);
    }
  };

  const completeProject = async () => {
    setSubmitLoading(true);
    const param = { job_id: JobDetails.state.data._id, pilot_id: pilotID };
    try {
      const res = await axiosInstance.post('/user/completeProject', param);
      if (res.status == 200) {
        setSubmitLoading(false);
        toastifySuccess('Job Completed Successfully !!');
        setShowModal(false);
        getJobData();
        getPilotRequest();
      } else {
        toastifyError('Something Went Wrong !!');
        setShowModal(false);
        setSubmitLoading(false);
      }
    } catch (error) {
      toastifyError('Something Went Wrong !!');
      console.error('Error:', error);
      setShowModal(false);
      setSubmitLoading(false);
    }
  };
  const [popupMsg, setPopupMsg] = useState('');
  const [openModalType, setOpenModalType] = useState('');
  const confirmPopupCall = (type, id) => {
    setOpenModalType(type);
    setShowModal(true);
    if (type == 'awarded') {
      setPopupMsg('are you sure you want to award this job');
      setProposalId(id);
    }
    if (type == 'completed') {
      setPopupMsg('are you sure you want to complete this job');
    }
  };

  const [reviewToId, setReviewToId] = useState();

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
          <Typography variant="h5" className="global_top_head tc">
            {/* Currently activated Membership */}
          </Typography>
        </Grid>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
            <div className="task_details top_box">
              {loading ? (
                <>
                  <Loading />
                </>
              ) : (
                <>
                  <div className="user_det">
                    <div className="user_pro">
                      <img
                        src={localStorage.getItem('img') ? localStorage.getItem('img') : defaultUserIMG}
                        alt=""
                        style={{ width: '50px', height: '50px', borderRadius: '100%' }}
                        className="grey_img"
                      />
                    </div>

                    <div className="user_data">
                      <p>Posted By</p>
                      <h2> {localStorage.getItem('loginname')}</h2>
                    </div>
                  </div>
                  <h2 className="text-capitalize mt-3 mb-0">{JobDetailsData?.job_details?.name}</h2>
                  <p className="cat_tittle">{JobDetailsData?.categoryName}</p>

                  <Row>
                    <Col md={6}>
                      <div className="user_location">
                        <div className="user_icon">
                          <LocationOnIcon />
                        </div>

                        <div className="location_det">
                          <p>Location</p>
                          {JobDetailsData.job_type == 'animal' ? (
                            <h2>
                              {' '}
                              {animalRescueData &&
                                `${animalRescueData?.location + ', ' + animalRescueData?.state + ', ' + animalRescueData?.city} `}
                            </h2>
                          ) : (
                            <h2> {JobDetailsData?.location} </h2>
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
                          {JobDetailsData.job_type == 'animal' ? (
                            <h2> {animalRescueData && `${timeAgo(animalRescueData?.created_at)} `}</h2>
                          ) : JobDetailsData.job_type == 'business' ? (
                            <h2> {bussinessData && `${timeAgo(bussinessData?.createdAt)} `}</h2>
                          ) : (
                            <h2>{JobDetailsData?.due_date_type ? JobDetailsData?.due_date_type : JobDetailsData?.work_due_date}</h2>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {JobDetailsData?.job_type == 'animal' && (
                    <div className="task_details_des text-capitalize">
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

                  {JobDetailsData?.job_type == 'business' && (
                    <div className="task_details_des text-capitalize">
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
                            <strong>location</strong>
                            <h2>{bussinessData?.location}</h2>
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

                  <Grid container spacing={2}>
                    {JobDetailsData?.job_details?.its_for_a?.length > 0 && (
                      <Grid item xl={12}>
                        <div className="box">
                          <div>
                            {' '}
                            <strong>- its for a</strong>
                          </div>

                          - {JobDetailsData?.job_details?.its_for_a?.map((item, i) => (
                            <>
                              <span key={i}>{item}</span>
                              {i < JobDetailsData?.job_details?.its_for_a.length - 1 && <span>, </span>}
                            </>
                          ))}
                        </div>
                      </Grid>
                    )}
                    {JobDetailsData?.job_details?.quate_me_for?.length > 0 && (
                      <Grid item xl={12}>
                        <div className="box">
                          <div>
                            {' '}
                            <strong>- Quote me for</strong>
                          </div>
                          - {JobDetailsData?.job_details?.quate_me_for?.map((item, i) => (
                            <>
                              <span key={i}>{item}</span>
                              {i < JobDetailsData?.job_details.quate_me_for.length - 1 && <span>, </span>}
                            </>
                          ))}
                        </div>
                      </Grid>
                    )}
                    {JobDetailsData?.job_details?.inspect_a?.length > 0 && (
                      <Grid item xl={12}>
                        <div className="box">
                          <strong>- inspect a</strong>
                          - {JobDetailsData?.job_details?.inspect_a?.map((item, i) => (
                            <span key={i}>{item}</span>
                          ))}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                  {JobDetailsData?.job_details?.task_description && (
                    <div className="main_cnt task_details_des mt-4 mb-3">
                      <div><strong>
                      - Task Details</strong></div>
                    <div dangerouslySetInnerHTML={{ __html: JobDetailsData?.job_details?.task_description }} />
                    </div>
                  )}

                  <div className="attach_ment_details">
                    {JobDetailsData?.attachment?.length > 0 &&
                      JobDetailsData?.attachment?.map((item, i) => (
                        <>
                          <Tooltip title="Download file">
                            <button onClick={() => downloadFile(item)} key={i} className="Download_btn">
                              <ArticleIcon /> Attachement {i + 1}
                            </button>
                          </Tooltip>
                        </>
                      ))}
                  </div>
                </>
              )}
            </div>
          </Grid>

          <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
            <div className="global_card_box pilot_req top_box req_box">
              <div className="top_heading_card_outer">
                <p className="top_heading_card">Pilot Request</p>
              </div>

              {loading ? (
                <Loading />
              ) : getProposalReqList?.length > 0 ? (
                getProposalReqList?.map((item, i) => (
                  <div className="poster_main_req_box heding_details_box" key={i}>
                    <div className="pilor_req_box">
                      <div className="req_user">
                        <div className="req_user_pro">
                          <img
                            src={item.pilotdata.image == '' ? defaultUserIMG : item.pilotdata.image}
                            alt=""
                            className="grey_img"
                            style={{ width: '50px', height: '50px', borderRadius: '100%' }}
                          />
                        </div>

                        <div className="req_user_dec">
                          <h2 className="text-uppercase ">
                            {' '}
                            <Link to={`/profile-details/${item.pilotdata._id}`} className="text-dark" style={{ textDecoration: 'none' }}>
                              {item.pilotdata.first_name}
                            </Link>{' '}
                          </h2>
                          <p>
                            <Stack spacing={1}>
                              <Rating name="half-rating-read" defaultValue={item.pilotdata.reviews} precision={0.5} readOnly />
                            </Stack>
                          </p>
                        </div>
                      </div>
                      <div className="price_requsred"> {item.job_data.amount} AUD</div>
                    
                    </div>
                    <div>
                    
                        <div className="req_user_btn justify-content-end">
                          <button className="chat_btn" onClick={() => goToChat(item)}>
                            Chat
                          </button>
                          {item.jobStatus == 'accepted' && JobDetailsData?.awarded_status !== 'accepted' ? (
                            <button className="award_btn">Pending</button>
                          ) : JobDetailsData?.awarded_status == 'accepted' &&
                            JobDetailsData?.project_status !== 'completed' &&
                            item?.job_data?.preposal_status == 'accepted' ? (
                            <button
                              className="chat_btn"
                              onClick={() => {
                                confirmPopupCall('completed', item.job_data._id);
                                setPilotID(item.pilotdata._id);
                              }}
                            >
                              Mark As Complete
                            </button>
                          ) : item.pilotdata._id == JobDetailsData?.pilot_id && JobDetailsData?.project_status == 'completed' ? (
                            <>
                              {allData.isReview ? (
                                <>
                                  {' '}
                                  <button className="chat_btn award_btn">Completed</button>{' '}
                                </>
                              ) : (
                                <button
                                  className="chat_btn"
                                  onClick={() => {
                                    setReviewToId(item.pilotdata._id);
                                    setShowReviewModal(true);
                                  }}
                                >
                                  {' '}
                                  Review
                                </button>
                              )}
                            </>
                          ) : item?.job_data?.preposal_status == 'pendding' &&
                            item.jobStatus == 'pending' &&
                            JobDetailsData?.pilot_id !== '' ? (
                            <button className="award_btn d-none" style={{ cursor: 'not-allowed' }}>
                              Award
                            </button>
                          ) : (
                            <button className="award_btn" onClick={() => confirmPopupCall('awarded', item.job_data._id)}>
                              Award
                            </button>
                          )}
                        </div>
                      </div>

                    <p className="pilot_quote_text">{item?.job_data?.preposal_description}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="pilot_req_box heding_details_box">
                    <div className="pilor_req_box"></div>
                    <h5 className="warning_if_job">You haven&apos;t received any quotes for this project yet</h5>
                  </div>
                </>
              )}
            </div>
          </Grid>
          <CustomeModal
            {...{ showModal, setShowModal, submitLoading }}
            handleFunc={openModalType == 'completed' ? completeProject : awardedJob}
            modalMsg={popupMsg}
          />

          <ReviewModal {...{ showReviewModal, setShowReviewModal, reviewToId }} job_id={JobDetails.state.data._id} />
        </Grid>
      </Grid>

      <ImagePreviewModal show={imgModal} previewImg={previewImgModal} onHide={() => setImgModal(false)} />
    </div>
  );
};

export default PostAJobDetails;
