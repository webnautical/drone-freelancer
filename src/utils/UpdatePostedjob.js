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
import ClearIcon from '@mui/icons-material/Clear';
import illustrationfirst from '../assets/images/locationill.png';
import illustrationsec from '../assets/images/locationill2.png';
import illustrationthird from '../assets/images/clock.png';
import illustrationfour from '../assets/images/doc.png';
import Succespostjob from '../assets/images/success_celebratin.gif';
import config from 'config';
// import { DatePicker, Space } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { PlusOutlined } from '@ant-design/icons';
// import { Modal, Upload } from 'antd';
import { getCurrentDate, getMaxDate, toastifyError, toastifySuccess } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../assets/css/styleposter.css';
import { useNavigate, useLocation } from '../../node_modules/react-router-dom/dist/index';
import UpdateAnimalRescue from './job-update/UpdateAnimalRescue';
import BussinessUpdate from './job-update/BussinesUpdate';
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
export default function UpdatePostedjob() {
  const navigate = useNavigate()
  const location = useLocation();
  const userRecord = location.state.data;
  const [userList, setUserList] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);


  const [subCategoryList, setSubCategoryList] = useState([])
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

  const [error, setError] = useState({
    location: '',
    street: '',
    job_categoery_id: '',
    work_due_date: '',
    attachment: '',

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
    if (e.target.name == 'job_categoery_id') {
      setFormOpen(true);
      setCatValue({
        ...catValue,
        'quate_me_for': [],
        'its_for_a': [],
      })
      if (e.target.value == '65437fd7cc204d4dd20c3293') {
        setExtraFormField('filmTV');
      } else if (e.target.value == '65438236cc204d4dd20c329d') {
        setExtraFormField('Agriculture');
      } else {
        setExtraFormField('')
      }
      subCategoryList.filter((item) => {
        if (item._id == e.target.value) {
          setQuoteMeList(item?.subcategory?.quate_me_for)
          setItsForAList(item?.subcategory?.its_for_a)
          setNeedYouThereForList(item?.subcategory?.need_you_there_for)
          setInspectA(item?.subcategory?.instpect_a)
        }
      })
    }
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setCatValue(prevValue => ({
      ...prevValue,
      task_description: data,
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

  const getSubCat = async () => {
    try {
      const res = await axiosInstance.post('/admin/getAllJobCategory')
      if (res.status == 200) {
        setSubCategoryList(res?.data?.getCategory)
      } else {
        setSubCategoryList([])
      }
    } catch (error) {
      setSubCategoryList([])
      console.log(error)
    }
  }
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
            setCategorylist(data.getCategory);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getcategoryData();
    getSubCat()
  }, []);
  const isStepOptional = (step) => {
    return step === 1;
  };

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
      if (work_due_date == '') {
        setError((prevValues) => {
          return { ...prevValues, ['work_due_date']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['work_due_date']: true };
        });
      }
    }

    if (activeStep == 3) {
      if (attachment == '') {
        setError((prevValues) => {
          return { ...prevValues, ['attachment']: 'Required *' };
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
    error.work_due_date,
    error.attachment
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
        work_due_date: value.work_due_date,
        attachment: fileList,
        job_details: catValue
      };
      try {
        const res = await fetch(`${config.url}/admin/updateJobdataById/${userRecord._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify(data)
        });
        const resultdata = await res.json();
        if (resultdata.status == 200) {
          toastifySuccess('Update Job SuccessFully !!');
          setLoading(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
          setTimeout(() => {
            navigate('/admin/postedjob')
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
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleDeleteFile = (index) => {
    const updatedFileList = [...fileList];
    updatedFileList.splice(index, 1);
    setFileList(updatedFileList);
  };

  const getjobData = async () => {
    try {
      fetch(`${config.url}/admin/getJobdataById/${userRecord._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get Job data successfully') {
            setUserList(data.getjobdata);

          } else {
            setUserList('');
          }

        });
    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    getjobData();
  }, []);

  useEffect(() => {
    if (userList) {
      setValue(prevValue => ({
        ...prevValue,
        location: userList.location,
        street: userList.street,
        job_categoery_id: userList.job_categoery_id,
        work_due_date: userList.work_due_date,
      }));
      setCatValue(prevValue => ({
        ...prevValue,
        name: userList?.job_details?.name,
        quate_me_for: userList?.job_details?.quate_me_for,
        its_for_a: userList?.job_details?.its_for_a,
        inspect_a: userList?.job_details?.inspect_a,
        need_you_there_for: userList?.job_details?.need_you_there_for,
        task_description: userList?.job_details?.task_description,
        application_method_and_rate: userList?.job_details?.application_method_and_rate,
        location_nearest_town: userList?.job_details?.location_nearest_town,
        google_map_link: userList?.job_details?.google_map_link,
        what_kind_country: userList?.job_details?.what_kind_country
      }))

      setFileList(userList.attachment)
      if (userList?.job_categoery_id) {
        setFormOpen(true);
        if (userList?.job_categoery_id == '65437fd7cc204d4dd20c3293') {
          setExtraFormField('filmTV');
        } else if (userList?.job_categoery_id == '65438236cc204d4dd20c329d') {
          setExtraFormField('Agriculture');
        } else {
          setExtraFormField('')
        }
        subCategoryList.filter((item) => {
          if (item._id == userList?.job_categoery_id) {
            setQuoteMeList(item?.subcategory?.quate_me_for)
            setItsForAList(item?.subcategory?.its_for_a)
            setNeedYouThereForList(item?.subcategory?.need_you_there_for)
            setInspectA(item?.subcategory?.instpect_a)
          }
        })
      }

    }
  }, [userList, subCategoryList]);

  console.log("userRecord",userRecord)

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container sx={{ justifyContent: 'center' }}>


        {
          userRecord?.job_type === "animal" ?
            <UpdateAnimalRescue job_id = {userRecord?._id} get_data_type = {userRecord?.get_data_type}/>
            :
            userRecord?.job_type === "business" ?
            <BussinessUpdate job_id = {userRecord?._id} get_data_type = {userRecord?.get_data_type}/>
            :
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
                      <img src={Succespostjob} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                      <h2>Job Update successfully</h2>
                      <p> You Can View and edit Your list</p>
                    </div>
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography className="active_steps_data" sx={{ mt: 2, mb: 1 }}>
                    {activeStep == 0 ? (
                      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                        <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
                          <div className="illustration_img">
                            <img src={illustrationfirst} alt="logo" className="grey_img" />
                          </div>
                          <Grid container sx={{ justifyContent: 'center' }}>
                            <Grid item xl={12} lg={12} md={8} sm={8} xs={12}>
                              <div className="location_search group  error">
                                <PlacesAutocomplete value={value.location} onChange={handleLocationChange} onSelect={handleLocationSelect}>
                                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div className="location_input">
                                      <span className="top_text">Location</span>
                                      <input {...getInputProps({ placeholder: 'Type address' })} />
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
                              <div className="group  error">
                                <input
                                  className="inputMaterial "
                                  type="text"
                                  placeholder="Enter Your Street Name"
                                  value={value.street}
                                  name="street"
                                  onChange={handleInputChange}
                                />
                                <label htmlFor="firstName">Street</label>
                                <span className="bar"></span>
                                <span className="errmsg">{error.street}</span>
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : activeStep == 1 ? (
                      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                        <Grid item xl={6} lg={12}>
                          <Grid item xl={12}>
                            <div className="illustration_img">
                              <img src={illustrationsec} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            </div>

                            <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                              <span className="top_text">Category</span>
                              <Select
                                value={value.job_categoery_id}
                                onChange={handleInputChange}
                                //displayEmpty
                                name="job_categoery_id"
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="normal_select"
                                disabled
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
                            {formOpen && (
                              <>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <div className="group  error">
                                      <input
                                        className="inputMaterial"
                                        type="text"
                                        placeholder="Enter Job Title"
                                        name="name"
                                        value={catValue.name}
                                        onChange={(e) => setCatValue({ ...catValue, name: e.target.value })}
                                      />{' '}
                                      <label htmlFor="firstName">Title</label>
                                      <span className="bar"></span>
                                      <span className="errmsg">{error.name}</span>
                                    </div>
                                  </Grid>
                                  {
                                    extaFormField == "Agriculture" ?
                                      <Grid item xs={6}>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                          <span className="top_text">Need You There For</span>
                                          <Select
                                            value={catValue.need_you_there_for}
                                            // onChange={handleChangespostercat}
                                            onChange={(e) => setCatValue({ ...catValue, need_you_there_for: e.target.value })}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="normal_select"
                                          >
                                            <MenuItem value="">Select</MenuItem>
                                            {
                                              needYouThereForList?.map((item, i) => (
                                                <MenuItem value={item} key={i}>{item}</MenuItem>
                                              ))
                                            }
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      :
                                      <Grid item xs={6}>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                          <span className="top_text">Its For A</span>
                                          <Select
                                            multiple
                                            value={catValue.its_for_a || []}
                                            onChange={handleMultiDrpCheckBox}
                                            displayEmpty
                                            renderValue={(selected) => selected.join(', ')}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="normal_select"
                                            name="its_for_a"
                                          >
                                            {itsForAList?.map((item) => (
                                              <MenuItem key={item} value={item}>
                                                <Checkbox checked={catValue.its_for_a && catValue.its_for_a.indexOf(item) > -1} />
                                                <ListItemText primary={item} />
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                  }
                                  <Grid item xs={6}>
                                    <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer ">
                                      <InputLabel id="demo-multiple-checkbox-label">Quote Me For</InputLabel>
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
                                        <span className="top_text">Inspect A</span>
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
                                  {extaFormField == 'filmTV' && (
                                    <>
                                      <Grid item xs={12}>
                                        <div className="group  error">
                                          <input
                                            className="inputMaterial"
                                            type="text"
                                            onChange={(e) => setCatValue({ ...catValue, application_method_and_rate: e.target.value })}
                                            placeholder="Enter Your Name"
                                          />{' '}
                                          <label htmlFor="firstName">Whats the application method and rate you normally do?</label>
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
                                          <label htmlFor="firstName">Property location or nearest town</label>
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
                                  )}

                                  <Grid item xs={12} className="pt-0">
                                    <p>Description</p>
                                    <CKEditor
                                      editor={ClassicEditor}
                                      data={catValue.task_description}
                                      onChange={handleEditorChange}
                                    />
                                    <span className="errmsg">{error.task_description}</span>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : activeStep == 2 ? (
                      <Grid container sx={{ justifyContent: 'center' }}>
                        <Grid item xl={5} lg={6} md={12} sm={12} xs={12}>
                          <Grid item xl={12}>
                            <div className="illustration_img">
                              <img src={illustrationthird} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            </div>
                            <span className="top_text">due date</span>
                            <input
                              className="inputMaterial w-100"
                              type="date"
                              placeholder="Your Location"
                              value={value.work_due_date}
                              name="work_due_date"
                              min={getCurrentDate()}
                              max={getMaxDate(3)}
                              onChange={handleInputChange}
                            />
                            <span className="errmsg">{error.work_due_date}</span>
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                        <Grid item xl={6}>
                          <Grid item xl={12}>
                            <div className="illustration_img">
                              <img src={illustrationfour} alt="logo" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
                            </div>
                            {fileList.map((file, index) => (
                              <div key={index} className="file-item">
                                {file && (
                                  <a href={file} target="_blank" rel="noopener noreferrer">
                                    {file.includes('.pdf') ? 'PDF File' : <img src={file} alt={`File ${index}`} className="file-image" />}
                                  </a>
                                )}
                                <button onClick={() => handleDeleteFile(index)} className="delete-button">
                                  <ClearIcon />
                                </button>
                              </div>
                            ))}
                            <span className="errmsg">{error.attachment}</span>
                          </Grid>

                        </Grid>
                      </Grid>
                    )}
                  </Typography>
                  <Box className="bottum_bar" sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                      <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                      </Button>
                    )}
                    {loading ? (
                      <Button className="global_btn">
                        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                      </Button>
                    ) : (
                      <Button className="global_btn" onClick={checkValidation}>
                        {activeStep === steps.length - 1 ? 'Update' : 'Next'}
                      </Button>
                    )}
                  </Box>
                </React.Fragment>
              )}
            </Grid>
        }


      </Grid>
    </Box>
  );
}
