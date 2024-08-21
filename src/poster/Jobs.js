import React, { useEffect, useState } from 'react';
// material-ui
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import config from 'config';
import { timeAgo } from 'Utility/Date';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import Dropdown from 'react-bootstrap/Dropdown';
import '../assets/css/styleposter.css';
import ThereAreNoData from 'Utility/ThereAreNoData';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
import CustomeModal from 'Utility/CustomeModal';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import Skeleton from '@mui/material/Skeleton';
// import { Link } from '../../node_modules/react-router-dom/dist/index';
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
  const [jobID, setJobID] = useState();
  const [loading, setLoading] = useState(false);
  const [categorylist, setCategorylist] = useState([]);

  const [awardedJob, setAwardedJob] = useState([]);
  const [filterAwaredData, setFilterAwaredData] = useState([]);

  const [postedJob, setPostedJob] = useState([]);
  const [filterPostedData, setFilterPostedData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getcategoryData = async () => {
    try {
      const res = await fetch(`${config.url}/admin/getAllJobCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      });
      const result = await res.json();
      if (result.status == 200) {
        setCategorylist(result.getCategory);
      } else {
        setCategorylist([]);
      }
    } catch (error) {
      console.log(error);
      setCategorylist([]);
    }
  };

  const getJobFun = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.url}/user/getAllPostedJobsByposter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        const list = resultdata?.getpostedjob;
        const postJob = list.filter((item) => {
          return item.status == 'accepted';
        });
        setAwardedJob(postJob);
        setFilterAwaredData(postJob);
        const awardJob = list.filter((item) => {
          return item.status == 'pendding';
        });
        setPostedJob(awardJob);
        setFilterPostedData(awardJob);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobFun();
    getcategoryData();
  }, []);

  const goToViewDetails = (data) => {
    navigate('/user/jobs-details', { state: { data } });
  };

  const [searchVal, setSearchVal] = useState({
    category: ''
  });
  const handlePostedSearch = (cat, val) => {
    if (cat == 'title' && val != '') {
      const filterPostedData = postedJob.filter((item) => {
        return item.job_details.name.toLowerCase().includes(val.toLowerCase());
      });
      setFilterPostedData(filterPostedData);
    } else {
      setFilterPostedData(postedJob);
    }
    if (cat == 'category' && val != '') {
      setSearchVal({ ...searchVal, category: val });
      const filterPostedData = postedJob.filter((item) => {
        return item.job_categoery_id == val;
      });
      setFilterPostedData(filterPostedData);
    } else {
      setSearchVal({ ...searchVal, category: '' });
      setFilterPostedData(postedJob);
    }
  };
  const handleAwaredSearch = (val) => {
    if (val != '') {
      const filterPostedData = awardedJob.filter((item) => {
        return item.job_details.name.toLowerCase().includes(val.toLowerCase());
      });
      setFilterAwaredData(filterPostedData);
    } else {
      setFilterAwaredData(awardedJob);
    }
  };

  const handleDelete = async () => {
    setSubmitLoading(true);
    try {
      const res = await fetch(`${config.url}/user/deleteJobById/${jobID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` }
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        toastifySuccess('Job Delete Succesfully !!');
        getJobFun();
        setSubmitLoading(false);
        setShowModal(false);
      } else {
        toastifyError("Something Wen't Wrong !!");
        setSubmitLoading(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <Grid Container>
        <Grid item xs={12} sx={{ mt: 7.25 }}>
          <Typography variant="h5" className="global_top_head">
            Jobs
          </Typography>
        </Grid>
        <Box className="job_btn_main" sx={{ width: '100%' }}>
          <Box className="tab_top_bar" sx={{ borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab className="job_btn" label={`Posted Jobs ${postedJob.length}`} {...a11yProps(0)} />
              <Tab label={`Awarded Jobs ${awardedJob.length}`} {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel className="tab_box_one" value={value} index={0}>
            <div className="search-container mb-3">
              <div className="box">
              <Grid container spacing={2} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span><button className='chat_btn' onClick={()=>navigate('/user/postjob')}>Post a job</button></span>
                  <Grid item xl={2} lg={2} md={2} xs={12} className="pt-0">
                    <TextField
                      id="outlined-search"
                      label="Search Job..."
                      type="search"
                      onChange={(e) => handlePostedSearch('title', e.target.value)}
                      className="w-100"
                    />
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} xs={12} className="pt-0">
                    <Select
                      value={searchVal.category}
                      onChange={(e) => handlePostedSearch('category', e.target.value)}
                      displayEmpty
                      name="job_categoery_id"
                      inputProps={{ 'aria-label': 'Without label' }}
                      className="w-100"
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {categorylist?.map((row) => (
                        <MenuItem key={row._id} value={row._id}>
                          {row.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
           
              </div>
            </div>
            {loading ? (
              <div>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            ) : filterPostedData?.length > 0 ? (
              filterPostedData?.map((item, i) => (
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

                        <div className="drop_down_menu">
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                              <MoreVertIcon />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  setShowModal(true);
                                  setJobID(item._id);
                                }}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        {/* <button
                          className="delte_job_btn"
                          onClick={() => {
                            setShowModal(true);
                            setJobID(item._id);
                          }}
                        >
                          <DeleteIcon />
                        </button> */}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              ))
            ) : (
              <>
                <ThereAreNoData
                  title={
                    <div className="global_no_data">
                       No jobs posted yet.<span>Looks like you haven&apos;t posted any jobs yet.</span>
                    </div>
                  }
                />
              </>
            )}
          </CustomTabPanel>

          <CustomTabPanel className="tab_box_two" value={value} index={1}>
            <div className="search-container text-end mb-3">
              <div className="box">
                <TextField id="outlined-search" label="Search Job..." type="search" onChange={(e) => handleAwaredSearch(e.target.value)} />
              </div>
            </div>
            {loading ? (
              <div>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="pilotjoblistbox job_list_box mb-4 mt-2 ">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3">
                    <Skeleton
                      animation="wave"
                      style={{ width: '40%', height: '40px', backgroundColor: 'lightgray', borderRadius: '4px' }}
                    />
                    <Skeleton
                      className="mt-2"
                      animation="wave"
                      style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                    />
                    <Skeleton animation="wave" style={{ width: '70%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }} />
                    <div className="d-flex justify-content-between">
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                      <Skeleton
                        className="mt-2"
                        animation="wave"
                        style={{ width: '20%', height: '20px', backgroundColor: '#e3e3e3', borderRadius: '4px' }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            ) : filterAwaredData?.length > 0 ? (
              filterAwaredData?.map((item, i) => (
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
            ) : (
              <>
                <ThereAreNoData
                  title={
                    <div className="global_no_data">
                     No awarded jobs yet.<span>Looks like you haven&apos;t awarded any jobs yet.</span>
                    </div>
                  }
                />
              </>
            )}
          </CustomTabPanel>
        </Box>
      </Grid>

      <CustomeModal
        {...{ showModal, setShowModal, submitLoading }}
        handleFunc={handleDelete}
        modalMsg={'Are You Sure ?, You want to delete it.'}
      />
    </div>
  );
}
