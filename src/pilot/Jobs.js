import React, { useEffect, useState } from 'react';
// material-ui
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { axiosInstance } from 'Utility/Api';
import Skeleton from '@mui/material/Skeleton';
import { timeAgo } from 'Utility/Date';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
// import Chip from '@mui/material/Chip';
import ThereAreNoData from 'Utility/ThereAreNoData';
import { getAllLocatData } from 'Utility/Utility';
 
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
 
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
 
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
 
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
 
export default function Jobs() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
 
  const [loading, setLoading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [acceptedList, setAcceptedList] = useState([]);

  const getJobList = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/user/getAllJobrequestlist`);
      if (res.status == 200) {
        const list = res?.data?.getjobdata
        console.log("list",list)
        setLoading(false)
        const accepted = list?.filter((item) => {
          return item.jobdata.pilot_id == getAllLocatData()?.login_id && item.jobdata.status == "accepted" && item.jobdata.awarded_status == "accepted"
        });
        setAcceptedList(accepted)
        const jobs = list.filter((item) => {
          return item.jobdata.awarded_status != "accepted"
        });
        setJobList(jobs)
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    getJobList();
  }, []);
 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  const viewDetails = (data) => {
    navigate('/user/job-details', { state: { data } });
  };
 
  return (
    <div>
      <Grid Container spacing={3}>
        <Grid item xs={12} sx={{ mt: 5.25 }}>
          <Typography variant="h5" className="global_top_head">
            Jobs
          </Typography>
        </Grid>
        <Box className="job_btn_main" sx={{ width: '100%' }}>
          <Box className="tab_top_bar" sx={{ borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={`Job List`} {...a11yProps(1)} />
              <Tab className="job_btn" label={`Accepted List`} {...a11yProps(0)} />
            </Tabs>
          </Box>
 
          <CustomTabPanel className="tab_box_one" value={value} index={1}>
            {loading ? (
              <div className="" >
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
 
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
 
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
                  </Grid>
                </Grid>
              </div>
 
 
            ) : acceptedList?.length > 0 ? (
              acceptedList?.map((item, i) => (
                <>
                  <div className="pilotjoblistbox job_list_box" key={i}>
                    <Grid container spacing={2}>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="job_tittle_box">
                          <h2 className="text-capitalize">{item.jobdata.job_details.name}</h2>
                          {/* <p className='text-capitalize'>{item.jobdata.job_details.task_description}</p> */}
                          <div dangerouslySetInnerHTML={{ __html: item.jobdata.job_details.task_description }} />
                        </div>
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="pilot job_option_main">
                          <div className="job_option">
                            <div className="posted_date">Posted on {timeAgo(item.jobdata.created_at)} </div>
                          </div>
                          <div className="view_btn">
                            <button className="global_btn " onClick={() => viewDetails(item)}>
                              View Details
                            </button>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </>
              ))
            ) : (
              <ThereAreNoData title={<div className='global_no_data'>You don&apos;t have any accepted job<span>Looks like you haven&apos;t been assigned any tasks yet.</span></div>} />
            )}
          </CustomTabPanel>
 
          <CustomTabPanel className="tab_box_two" value={value} index={0}>
            {loading ? (
              <div className="" >
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
 
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
 
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton animation="wave" style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }} />
                    <Skeleton className="mt-2" animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className='d-flex justify-content-between'>
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                      <Skeleton className="mt-2" animation="wave" style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    </div>
 
                  </Grid>
                </Grid>
 
 
 
              </div>
            ) : jobList?.length > 0 ? (
              jobList?.map((item, i) => (
                <>
                  <div className="pilotjoblistbox job_list_box" key={i}>
                    <Grid container spacing={2}>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="job_tittle_box">
                          <h2 className="text-capitalize">{item.jobdata.job_details.name}</h2>
                          {/* <p className='text-capitalize'>{item.jobdata.job_details.task_description}</p> */}
                          <div dangerouslySetInnerHTML={{ __html: item.jobdata.job_details.task_description }} />
                        </div>
                      </Grid>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="pilot job_option_main">
                          <div className=" job_option">
                            <div className="d-flex">
                              <p className="me-3 pb-2">Posted on {timeAgo(item.jobdata.created_at)}</p>
 
 
                            </div>
                          </div>
                          <div className="view_btn">
                            <div className='appliad_tag submit_quote'>
                              {item.bidding_status == "Submitted" && (
                             <p>Quote Submitted</p>
                              )}
                            </div>
                            <button className="global_btn " onClick={() => viewDetails(item)}>
                              View Details
                            </button>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </>
              ))
            ) : (
              <ThereAreNoData title={<div className='global_no_data'>You don&apos;t have any job list near your radius<span>Currently, there are no job opportunities within the radius you&apos;ve set</span></div>} />
            )}
          </CustomTabPanel>
        </Box>  
      </Grid>
    </div>
  );
}