import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '../../node_modules/@mui/material/index';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import illustrationfirst from '../assets/images/locationill.png';
import illustrationsec from '../assets/images/locationill2.png';
import illustrationthird from '../assets/images/clock.png';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import illustrationfour from '../assets/images/doc.png';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Succespostjob from '../assets/images/success_celebratin.gif';
import config from 'config';
// import { DatePicker, Space } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAllLocatData, getCurrentDate, getMaxDate, toastifyError } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../assets/css/styleposter.css';
import { Link, useLocation, useNavigate } from '../../node_modules/react-router-dom/dist/index';
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

const steps = ['Location', 'Choose Category', 'Timeframe', 'Attachements'];
export default function PostJob() {
  const details = useLocation();
  const catDetails = details.state ? details.state.details : null;
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  // -------------------------catgory--------------------------
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);
  const [quoteMeList, setQuoteMeList] = useState([]);
  const [itsForAList, setItsForAList] = useState([]);
  const [needYouThereForList, setNeedYouThereForList] = useState([]);
  const [InspectA, setInspectA] = useState([]);
  const [value, setValue] = useState({
    location: '',
    street: '',
    job_categoery_id: '',
    work_due_date: '',
    attachment: '',

    next_days: '',
    days_to_date: ''
  });
  const [catValue, setCatValue] = useState({
    name: '',
    quate_me_for: [],
    its_for_a: [],
    inspect_a: [],
    need_you_there_for: '',
    task_description: '',
    application_method_and_rate: '',
    location_nearest_town: '',
    google_map_link: '',
    what_kind_country: ''
  });
  useEffect(() => {
    if (catDetails) {
      setValue({
        ...value,
        job_categoery_id: catDetails?.category_id
      });
      setFormOpen(true);
      if (catDetails?.category_id == '65437fd7cc204d4dd20c3293') {
        setExtraFormField('filmTV');
      } else if (catDetails?.category_id == '65438236cc204d4dd20c329d') {
        setExtraFormField('Agriculture');
      } else {
        setExtraFormField('');
      }
    }
  }, [catDetails]);

  const [error, setError] = useState({
    location: '',
    street: '',
    job_categoery_id: '',
    work_due_date: '',
    attachment: '',
    its_for_a: '',


    name: '',
    quate_me_for: '',
    task_description: ''
  });
  const [formOpen, setFormOpen] = useState(false);
  const [extaFormField, setExtraFormField] = useState('');

  const handleInputChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

    if (e.target.value == 'Flexible') {
      setValue({
        ...value,
        next_days: '',
        days_to_date: '',
        radio: e.target.value,
        work_due_date: e.target.value
      });
    }

    if (e.target.name == 'next_days') {
      if (e.target.value !== '') {
        const currentDate = new Date();
        const modifiedDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(e.target.value)));
        const formattedDate = modifiedDate.toISOString().split('T')[0];
        setValue({
          ...value,
          next_days: e.target.value,
          days_to_date: formattedDate,
          work_due_date: ''
        });
      } else {
        setValue({ ...value, days_to_date: '', next_days: '' });
      }
    }

    if (e.target.name == 'work_due_date') {
      setValue({
        ...value,
        next_days: '',
        days_to_date: '',
        work_due_date: e.target.value
      });
    }

    if (e.target.name == 'job_categoery_id') {
      setFormOpen(true);
      setCatValue({
        ...catValue,
        quate_me_for: [],
        its_for_a: []
      });
      if (e.target.value == '65437fd7cc204d4dd20c3293') {
        setExtraFormField('filmTV');
      } else if (e.target.value == '65438236cc204d4dd20c329d') {
        setExtraFormField('Agriculture');
      } else {
        setExtraFormField('');
      }
      subCategoryList.filter((item) => {
        if (item._id == e.target.value) {
          setQuoteMeList(item?.subcategory?.quate_me_for);
          setItsForAList(item?.subcategory?.its_for_a);
          setNeedYouThereForList(item?.subcategory?.need_you_there_for);
          setInspectA(item?.subcategory?.instpect_a);
        }
      });
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setCatValue((prevValue) => ({
      ...prevValue,
      task_description: data
    }));
  };
  const handleMultiDrpCheckBox = (event) => {
    const {
      target: { value, name }
    } = event;
    if (name == 'quoteMeFor') {
      setCatValue({
        ...catValue,
        quate_me_for: typeof value === 'string' ? value.split(',') : value
      });
    }
    if (name == 'its_for_a') {
      setCatValue({
        ...catValue,
        its_for_a: typeof value === 'string' ? value.split(',') : value
      });
    }
    if (name == 'inspect_a') {
      setCatValue({
        ...catValue,
        inspect_a: typeof value === 'string' ? value.split(',') : value
      });
    }
  };

  const handleLocationSelect = async (value) => {
    try {
      setValue((prevValue) => ({
        ...prevValue,
        location: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };
  const handleLocationChange = (value) => {
    setValue((prevValue) => ({
      ...prevValue,
      location: value
    }));
  };

  const handleLocationChange1 = (value) => {
    setValue((prevValue) => ({
      ...prevValue,
      street: value
    }));
  };
  const handleLocationSelect1 = async (value) => {
    try {
      setValue((prevValue) => ({
        ...prevValue,
        street: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };

  const getSubCat = async () => {
    try {
      const res = await axiosInstance.post('/admin/getAllJobCategory');
      if (res.status == 200) {
        setSubCategoryList(res?.data?.getCategory);
      } else {
        setSubCategoryList([]);
      }
    } catch (error) {
      setSubCategoryList([]);
      console.log(error);
    }
  };
  const getcategoryData = async () => {
    try {
      fetch(`${config.url}/admin/getAllJobCategory`, {
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
          if (data.message === 'get category data successfully') {
            const list = data.getCategory.filter((item) => item._id !== '65cc8c9757bfa396e6687a13');
            setCategorylist(list);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getcategoryData();
    getSubCat();
  }, []);
  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
  const checkValidation = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    const { location, street, job_categoery_id, work_due_date, attachment } = value;
    if (activeStep == 0) {
      if (location == '') {
        setError((prevValues) => {
          return { ...prevValues, ['location']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['location']: true };
        });
      }
      if (street == '') {
        setError((prevValues) => {
          return { ...prevValues, ['street']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['street']: true };
        });
      }
    }

    if (activeStep == 1) {
      if (job_categoery_id == '') {
        setError((prevValues) => {
          return { ...prevValues, ['job_categoery_id']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['job_categoery_id']: true };
        });
      }

      if (catValue.name == '') {
        setError((prevValues) => {
          return { ...prevValues, ['name']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['name']: true };
        });
      }
      if (catValue.its_for_a == '') {
        setError((prevValues) => {
          return { ...prevValues, ['its_for_a']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['its_for_a']: true };
        });
      }
      if (catValue.quate_me_for == '') {
        setError((prevValues) => {
          return { ...prevValues, ['quate_me_for']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['quate_me_for']: true };
        });
      }
      if (catValue.task_description == '') {
        setError((prevValues) => {
          return { ...prevValues, ['task_description']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['task_description']: true };
        });
      }
    }

    if (activeStep == 2) {
      if (work_due_date !== '' || value.days_to_date != '') {
        setError((prevValues) => {
          return { ...prevValues, ['work_due_date']: true };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['work_due_date']: 'Required *' };
        });
      }
    }

    if (activeStep == 3) {
      if (attachment == '') {
        setError((prevValues) => {
          return { ...prevValues, ['attachment']: true };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['attachment']: true };
        });
      }
    }
  };

  useEffect(() => {
    if (activeStep === 0) {
      if (error.location === true && error.street === true) {
        handleNext();
      }
    }
    if (activeStep === 1) {
      if (error.job_categoery_id === true && error.name === true && error.quate_me_for === true && error.task_description === true) {
        handleNext();
      }
    }
    if (activeStep === 2) {
      if (error.work_due_date === true) {
        handleNext();
      }
    }
    if (activeStep === 3) {
      if (error.attachment === true) {
        handleNext();
      }
    }
  }, [
    addUpdateApiCallCount,
    error.location,
    error.street,
    error.job_categoery_id,
    error.name,
    error.quate_me_for,
    error.task_description,
    error.work_due_date
  ]);

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    if (activeStep === 3) {
      setLoading(true);
      const data = {
        location: value.location,
        street: value.street,
        job_categoery_id: value.job_categoery_id,
        work_due_date: value.days_to_date !== '' ? value.days_to_date : value.work_due_date,
        job_details: {
          name: catValue.name,
          quate_me_for: catValue.quate_me_for,
          its_for_a: catValue.its_for_a,
          inspect_a: catValue.inspect_a,
          need_you_there_for: catValue.need_you_there_for,
          task_description: catValue.task_description,
          application_method_and_rate: catValue.application_method_and_rate,
          location_nearest_town: catValue.location_nearest_town,
          google_map_link: catValue.google_map_link,
          what_kind_country: catValue.what_kind_country
        },
        attachment: value.attachment
      };
      try {
        const res = await fetch(`${config.url}/user/createJobByClient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
          body: JSON.stringify(data)
        });
        const resultdata = await res.json();
        if (resultdata.status == 200) {
          // toastifySuccess('Post Created SuccessFully !!');
          setLoading(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
          setTimeout(() => {
            navigate('/user/dashboard/default');
          }, 5000);
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toastifyError("Something Wen't Wrong !!");
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', ' image/jpg', 'application/pdf'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!allowedTypes.includes(file.type)) {
      setError((prevValues) => {
        return { ...prevValues, ['attachment']: 'Invalid file type. Please select a valid image (JPG, JPEG, PNG) or Doccument (PDF).' };
      });
      return false;
    }
    if (file.size > maxSize) {
      setError((prevValues) => {
        return { ...prevValues, ['attachment']: 'File size exceeds 2MB limit. Please select a smaller file.' };
      });
      return false;
    }
    setError((prevValues) => {
      return { ...prevValues, ['attachment']: true };
    });
    return true;
  };
  const handleImageChange = (event) => {
    const files = event.target.files;
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);
          if (previews.length === files.length) {
            setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
            setValue((prevValue) => ({
              ...prevValue,
              attachment: [...prevValue.attachment, ...previews]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeFileItem = (indexToRemove) => {
    setImagePreviews((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    setValue((prevValue) => ({
      ...prevValue,
      attachment: prevValue.attachment.filter((_, index) => index !== indexToRemove)
    }));
  };

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ mt: 3.25 }}>
          <Typography variant="h5" className="global_top_head">
            Post A Job
          </Typography>
        </Grid>
        <Grid className="mt-0 pt-4" item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Stepper activeStep={activeStep} className="mt-0 top_bar_profile top_box ">
            {steps.map((label) => (
              <Step className="circle_pro" key={label}>
                <StepLabel className="text_name">{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography className=" " sx={{ mt: 2, mb: 1 }}>
                <div className="succes_post_job">
                  <img src={Succespostjob} alt="" style={{ maxWidth: '', maxHeight: '' }} className="" />
                  <h2>Your Job is posted successfully</h2>
                  <p> You Can View and edit Your Listing In posted job or Dashboard</p>
                  <Link to={'/user/dashboard/default'} className="chat_btn" style={{ textDecoration: 'none' }}>
                    Back to Dashboard
                  </Link>
                </div>
              </Typography>
              {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }} className="">
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Back To Dashboard</Button>
              </Box> */}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography className="active_steps_data" sx={{ mt: 2, mb: 1 }}>
                {activeStep == 0 ? (
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid item xl={7} lg={12} md={12} sm={12} xs={12}>
                      <div className="illustration_img">
                        <img src={illustrationfirst} alt="logo" className="" />
                        <div className="tittle_ullustration">Location</div>
                      </div>
                      <Grid container sx={{ justifyContent: 'center' }}>
                        <Grid item xl={12} lg={12} md={8} sm={8} xs={12}>
                          <p className="heading_txt mb-5">
                            Set your job location now to start sending it to matching drone pilots in your desired area, or click{' '}
                            <strong>Skip</strong> to save progress and return later
                          </p>
                        </Grid>
                        <Grid item xl={12} lg={12} md={8} sm={8} xs={12}>
                          <div className="location_search group  error">
                            <PlacesAutocomplete
                              value={value.location}
                              onChange={handleLocationChange}
                              searchOptions={searchOptions}
                              onSelect={handleLocationSelect}
                            >
                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="location_input">
                                  <span className="top_text">Location (City / Town)</span>
                                  <input {...getInputProps({ placeholder: 'Start Typing...' })} />
                                  <div className="autocomplete-dropdown-container">
                                    {loading ? <div>Loading...</div> : null}
                                    {suggestions?.map((suggestion) => {
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
                            <span className="bar"></span>
                            <span className="errmsg">{error.location}</span>
                          </div>
                        </Grid>
                        <Grid item xl={12} lg={12} md={8} sm={8} xs={12}>
                          <div className="location_search group  error">
                            <PlacesAutocomplete
                              value={value.street}
                              onChange={handleLocationChange1}
                              searchOptions={searchOptions}
                              onSelect={handleLocationSelect1}
                            >
                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="location_input">
                                  <span className="top_text">Address</span>
                                  <input {...getInputProps({ placeholder: 'Start Typing...' })} />
                                  <div className="autocomplete-dropdown-container">
                                    {loading ? <div>Loading...</div> : null}
                                    {suggestions?.map((suggestion) => {
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
                            <span className="bar"></span>
                            <span className="errmsg">{error.street}</span>
                          </div>
                          {/* <div className="group  error">
                            <input
                              className="inputMaterial "
                              type="text"
                              placeholder="Start Typing..."
                              value={value.street}
                              name="street"
                              onChange={handleInputChange}
                            />
                            <label htmlFor="firstName">Address</label>
                            <span className="bar"></span>
                            <span className="errmsg mt-4 d-block">{error.street}</span>
                          </div> */}
                        </Grid>

                        {/* <Grid item xl={12} lg={12} md={8} sm={8} xs={12}>

                          <p className='alert_text'><b>Skip </b>to save progress or click <b>(Next)</b> to finish Posting Your Job!</p>
                        </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                ) : activeStep == 1 ? (
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid item xl={7} lg={12}>
                      <Grid item xl={12}>
                        <div className="illustration_img">
                          <img src={illustrationsec} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="" />
                        </div>

                        <div className="tittle_ullustration text-center">Choose Category</div>
                        <p className="heading_txt mb-5">
                          Use this form below to provide details about your job
                        </p>


                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select ">
                          <span className="top_text">
                            Category<span className="dot_alert">*</span>
                          </span>
                          <Select
                            value={value.job_categoery_id}
                            onChange={handleInputChange}
                            displayEmpty
                            name="job_categoery_id"
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="choosecat mb-0 normal_select"
                          >
                            <MenuItem value="">Select</MenuItem>
                            {categorylist.map((row) => (
                              <MenuItem key={row._id} value={row._id}>
                                {row.category_name}
                              </MenuItem>
                            ))}
                          </Select>
                          <span className="errmsg">{error.job_categoery_id}</span>
                        </FormControl>
                      </Grid>
                      <Grid>
                        {/* <CategoryForm formOpen={formOpen} cateDetails={cateDetails} error={error} /> */}
                        {formOpen && (
                          <>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <div className="group  error">
                                  <input
                                    className="inputMaterial"
                                    type="text"
                                    placeholder="Enter Job Title"
                                    value={catValue?.name}
                                    name="name"
                                    onChange={(e) => setCatValue({ ...catValue, name: e.target.value })}
                                  />{' '}
                                  <label htmlFor="firstName">
                                    Title <span className="dot_alert">*</span>
                                  </label>
                                  <span className="bar"></span>
                                  <span className="errmsg">{error.name}</span>
                                </div>
                              </Grid>
                              {extaFormField == 'Agriculture' ? (
                                <Grid item xs={6}>
                                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                    <span className="top_text">
                                      Need You There For <span className="dot_alert">*</span>
                                    </span>
                                    <Select
                                      value={catValue.need_you_there_for}
                                      // onChange={handleChangespostercat}
                                      onChange={(e) => setCatValue({ ...catValue, need_you_there_for: e.target.value })}
                                      displayEmpty
                                      inputProps={{ 'aria-label': 'Without label' }}
                                      className="normal_select"
                                    >
                                      <MenuItem value="">Select</MenuItem>
                                      {needYouThereForList?.map((item, i) => (
                                        <MenuItem value={item} key={i}>
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              ) : (
                                <Grid item xs={6}>
                                  <FormControl sx={{ m: 1, minWidth: 120 }} className="check_select_outer">
                                    <InputLabel id="demo-multiple-checkbox-label">
                                      Its For A <span className="dot_alert">*</span>
                                    </InputLabel>
                                    <Select
                                      multiple
                                      value={catValue.its_for_a || []}
                                      onChange={handleMultiDrpCheckBox}
                                      displayEmpty
                                      renderValue={(selected) => selected.join(', ')}
                                      inputProps={{ 'aria-label': 'Without label' }}
                                      className="check_select"
                                      name="its_for_a"
                                    >
                                      {itsForAList?.map((item) => (
                                        <MenuItem key={item} value={item}>
                                          <Checkbox checked={catValue.its_for_a && catValue.its_for_a.indexOf(item) > -1} />
                                          <ListItemText primary={item} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    <span className="errmsg">{error.its_for_a}</span>

                                  </FormControl>
                                </Grid>
                              )}
                              <Grid item xs={6}>
                                <FormControl sx={{ width: 300 }} className="check_select_outer mb-0">
                                  <InputLabel id="demo-multiple-checkbox-label">
                                    Quote Me For <span className="dot_alert">*</span>
                                  </InputLabel>
                                  <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={catValue.quate_me_for || []}
                                    onChange={handleMultiDrpCheckBox}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    className="check_select"
                                    name="quoteMeFor"
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {quoteMeList?.map((item) => (
                                      <MenuItem key={item} value={item}>
                                        <Checkbox checked={catValue.quate_me_for && catValue.quate_me_for.indexOf(item) > -1} />
                                        <ListItemText primary={item} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                                <span className="errmsg">{error.quate_me_for}</span>
                              </Grid>

                              {extaFormField == 'inspection' && (
                                <Grid item xs={12}>
                                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                    <span className="top_text">
                                      Inspect A <span className="dot_alert">*</span>
                                    </span>
                                    <Select
                                      multiple
                                      value={catValue.inspect_a || []}
                                      onChange={handleMultiDrpCheckBox}
                                      displayEmpty
                                      renderValue={(selected) => selected.join(', ')}
                                      inputProps={{ 'aria-label': 'Without label' }}
                                      className="normal_select"
                                      name="inspect_a"
                                    >
                                      <MenuItem value="">Select</MenuItem>
                                      {InspectA?.map((item) => (
                                        <MenuItem key={item} value={item}>
                                          <Checkbox checked={catValue.inspect_a && catValue.inspect_a.indexOf(item) > -1} />
                                          <ListItemText primary={item} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              )}
                              {/* {extaFormField == 'filmTV' && (
                                <>
                                  <Grid item xs={12}>
                                    <div className="group  error">
                                      <input
                                        className="inputMaterial"
                                        type="text"
                                        onChange={(e) => setCatValue({ ...catValue, application_method_and_rate: e.target.value })}
                                        placeholder="Enter Your Name"
                                      />{' '}
                                      <label htmlFor="firstName">
                                        Whats the application method and rate you normally do? <span className="dot_alert">*</span>
                                      </label>
                                      <span className="bar"></span>
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div className="group  error">
                                      <input
                                        className="inputMaterial"
                                        type="text"
                                        onChange={(e) => setCatValue({ ...catValue, location_nearest_town: e.target.value })}
                                        placeholder="Enter Your Name"
                                      />{' '}
                                      <label htmlFor="firstName">
                                        Property location or nearest town <span className="dot_alert">*</span>
                                      </label>
                                      <span className="bar"></span>
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div className="group  error">
                                      <input
                                        className="inputMaterial"
                                        type="text"
                                        onChange={(e) => setCatValue({ ...catValue, google_map_link: e.target.value })}
                                        placeholder="Enter Your Name"
                                      />{' '}
                                      <label htmlFor="firstName">Google Map Link</label>
                                      <span className="bar"></span>
                                    </div>
                                  </Grid>
                                </>
                              )} */}

                              <Grid item xs={12} className="pt-0">
                                <p className='mb-1' style={{ fontSize: '12px', color: '#747474' }}>

                                  Description <span className="dot_alert">*</span>   <span className="errmsg mx-2">{error.task_description}</span>
                                </p>
                                {/* <div className="dec_text">
                                  <textarea
                                    placeholder="Describe The Task"
                                    name="task_description"
                                    onChange={(e) => {
                                      setCatValue({ ...catValue, task_description: e.target.value });
                                    }}
                                  />
                                </div> */}

                                <CKEditor editor={ClassicEditor} data={catValue.task_description} onChange={handleEditorChange} />

                              </Grid>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ) : activeStep == 2 ? (
                  <Grid container sx={{ justifyContent: 'center' }}>
                    <Grid item xl={7} lg={8} md={12} sm={12} xs={12}>
                      <Grid item xl={12}>
                        <div className="illustration_img">
                          <img src={illustrationthird} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="" />
                          <div className="tittle_ullustration">Job Timeframe</div>
                        </div>
                      </Grid>

                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <FormControl style={{ width: '100%' }}>
                          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue={value.radio} name="radio">
                            <div className="d-flex post_job_input_date">
                              <FormControlLabel
                                value="work_due_date"
                                onChange={handleInputChange}
                                control={<Radio />}
                                label={
                                  <>
                                    <Grid item xl={12}>
                                      <input
                                        className="inputMaterial"
                                        type="date"
                                        value={value.work_due_date}
                                        name="work_due_date"
                                        min={getCurrentDate()}
                                        max={getMaxDate(3)}
                                        onChange={handleInputChange}
                                      />
                                    </Grid>
                                  </>
                                }
                              />
                            </div>

                            <div className="d-flex post_job_date">
                              <FormControlLabel
                                value="next_days"
                                onChange={handleInputChange}
                                control={<Radio />}
                                label={
                                  <>
                                    <div className="d-flex justify-content-left align-items-center" style={{ width: '100%' }}>
                                      <p>In the next</p>
                                      <input
                                        className="inputMaterial days"
                                        type="text"
                                        value={value.next_days}
                                        name="next_days"
                                        maxLength={2}
                                        onChange={handleInputChange}
                                      />
                                      <p>days</p>
                                    </div>
                                  </>
                                }
                              />
                            </div>

                            <div className="d-flex post_job_date">
                              <FormControlLabel
                                value="Flexible"
                                onChange={handleInputChange}
                                control={<Radio />}
                                label={
                                  <>
                                    <div>
                                      <p>My date are flexible</p>
                                    </div>
                                  </>
                                }
                              />
                            </div>
                          </RadioGroup>
                          <span className="errmsg">{error.work_due_date}</span>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid item xl={7}>
                      <Grid item xl={12}>
                        <div className="illustration_img">
                          <img src={illustrationfour} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="" />
                        </div>
                        <FormControl fullWidth>
                          <div className="file-uploader">
                            <label htmlFor="iamgesID" className="post_job global_file_upload_deisgn">
                              <InsertPhotoIcon />
                              <p>Upload Document</p>
                              <p className="mx-4 my-0 py-0">Image (JPG, JPEG, PNG) or Document (PDF).</p>
                              <div className='mb-3 mt-2 d-block' style={{ backgroundColor: '#e8f7ff', padding: '10px', borderRadius: '5px' }}>
                                <p className="mb-0">
                                  Use this space to upload relevant files (pictures, plans, reports) to give the pilot a clearer picture of your
                                  project.
                                </p>
                              </div>

                              <input type="file" id="iamgesID" multiple onChange={handleImageChange} />
                            </label>
                          </div>
                        </FormControl>
                        <div className="preview_upload">
                          {/* {
                              imagePreviews.length > 0 &&
                              <p>{imagePreviews.length} Files Selected.</p>
                            } */}
                        </div>
                        {imagePreviews.map((file, i) => (
                          <p className="post_job_design" key={file}>
                            {' '}
                            Attachement {i + 1}{' '}
                            <button onClick={() => removeFileItem(i)}>
                              <DeleteOutlineIcon />
                            </button>
                          </p>
                        ))}
                        {error.attachment && <p style={{ color: 'red' }}>{error.attachment}</p>}
                      </Grid>

                    </Grid>
                  </Grid>
                )}
              </Typography>
              <Box className="bottum_bar" sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button className="reset_btn" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {/* {isStepOptional(activeStep) && ( */}
                <Button className="reset_btn" color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
                {/* )} */}
                {loading ? (
                  <Button className="global_btn">
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                  </Button>
                ) : (
                  <Button className="global_btn" onClick={checkValidation}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
