import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Textarea from '@mui/material/TextareaAutosize';
import PlacesAutocomplete from 'react-places-autocomplete';
import { LoadingBTN, getAllLocatData } from '../../Utility/Utility';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FormModal from 'Utility/FormModal';
import { useLocation, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import ApplyNow from './ApplyNow';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { State } from 'country-state-city';
import Breacrumb from "staticspage/Header/Breacrumb";
// import { useFrontDataContext } from 'context/FrontContextProvider';

const BusinessForm = () => {
  const navigate = useNavigate()
  const data = useLocation()
  const portalData = data.state ? data.state.portalData : null
  // const {portalData, setPortalData} = useFrontDataContext()


  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);

  const [msg] = useState('');
  const [isApply, setIsApply] = useState(false);
  const [value, setValue] = useState({
    job_title: '',
    company_name: '',
    location: '',
    job_type: '',
    description: '',
    logo: '',

    state: '',
    notify_by: '',
    attachment: []
  });

  useEffect(() => {
    if (portalData) {
      setValue({
        ...value,
        job_title: portalData?.job_title,
        company_name: portalData?.company_name,
        location: portalData?.location,
        job_type: portalData?.job_type,
        description: portalData?.description,
        logo: portalData?.logo,

        state: portalData?.state,
        notify_by: portalData?.notify_by,
        attachment: portalData?.attachment
      })
    } else {
      setValue({
        ...value,
        job_title: '',
        company_name: '',
        location: '',
        job_type: '',
        description: '',
        logo: '',

        state: '',
        notify_by: '',
        attachment: []
      })
    }
  }, [portalData])

  const [error, setError] = useState({
    job_title: '',
    company_name: '',
    location: '',
    job_type: '',
    description: '',
    attachment: '',
    // logo: ''
  });

  const [imagePreviews, setImagePreviews] = useState(portalData?.attachment || []);
  const [logoPreview, setLogoPreview] = useState(value.logo || portalData?.logo);
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', ' image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!allowedTypes.includes(file.type)) {
      setError((prevValues) => {
        return { ...prevValues, ['attachment']: 'Invalid file type. Please select a valid image (JPG, JPEG, PNG).' };
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
    const imgData = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target.result);
          imgData.push(e.target.result);
          if (previews.length === files.length) {
            setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
            setValue((prevValues) => {
              return { ...prevValues, attachment: [...prevValues.attachment, ...imgData] };
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const removeFileItem = (indexToRemove) => {
    setImagePreviews((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    setValue((prevItems) => {
      const updatedItems = prevItems.attachment.filter((_, index) => index !== indexToRemove);
      return { ...prevItems, attachment: updatedItems };
    });
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setValue({
          ...value,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    getStateFun();
  }, []);
  const getStateFun = () => {
    const stateData = State?.getStatesOfCountry('AU').map((state) => ({
      value: state.name,
      displayValue: state.name
    }));
    setStateList(stateData);
  };

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };
  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    if (value.job_title.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['job_title']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['job_title']: true };
      });
    }
    if (value.company_name.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['company_name']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['company_name']: true };
      });
    }
    if (value.location.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['location']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['location']: true };
      });
    }
    if (value.job_type.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['job_type']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['job_type']: true };
      });
    }

    if (value.notify_by.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['notify_by']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['notify_by']: true };
      });
    }


    if (value.state.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['state']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['state']: true };
      });
    }

    if (value.description.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['description']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['description']: true };
      });
    }
    // if (value.logo == '') {
    //   setError((prevValues) => {
    //     return { ...prevValues, ['logo']: 'Required *' };
    //   });
    // } else {
    //   setError((prevValues) => {
    //     return { ...prevValues, ['logo']: true };
    //   });
    // }
    if (value.image == '') {
      setError((prevValues) => {
        return { ...prevValues, ['image']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['image']: true };
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

  const { job_title, location, description, company_name, job_type, image } = error;
  useEffect(() => {
    if (
      job_title === true &&
      location === true &&
      description === true &&
      company_name === true &&
      job_type === true &&
      // logo === true &&
      image === true
    ) {
      handleSubmit();
    }
  }, [addUpdateApiCallCount, job_title, location, description, company_name, job_type, image]);

  const handleSubmit = async () => {
    setLoading(true);
    setIsApply(true);

  };

  // console.log("portalData",portalData)

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };

  const [modal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    btn: '',
    msg: ''
  });

  const modalCall = (msg, btn) => {
    setModalData({
      ...modalData,
      btn: btn,
      msg: msg
    });
    setShowModal(true);
  };

  const goToPage = () => {
    navigate('/register', { state: { data: value } })
  }
  return (
    <>
      <div className="lost_pet">

        {/* <div className="bg_top"></div>
        
        
        */}

        <Breacrumb />
        <section className="form_pilot_find">
          <Container>
            <div className="inner_main_box custom-form">
              {!isApply ? (
                <>
                  <div className="form_heading text-start">
                    <h2>Business Employment Portal</h2>
                    <p>Seeking skilled drone pilots to expand your team? We can help businesses of all sizes. Fill out the form below to add your position details and start receiving applications today.</p>
                    <p><b>To post a job on our platform:</b>
                    </p>

                    <ol className='points_employment'>
                  
                      <li>Businesses must register an account.
                      </li>
                      <li>Fill out the job listing form and choose your preferred reach:<br/> 
- All pilots in the specified State, or <br/> 
- Pilots within a 200km radius of the job location.
</li>

<li>Pay a $150 fee to post the job listing.
</li>
<li>Your job posting will be sent to all eligible pilots who have opted to receive job notifications in the selected area.
</li>
                    </ol>

                    <p>Our efficient process ensures that your project reaches qualified drone professionals quickly, helping you find the right expertise for your specific needs.</p>
                  </div>
                  <Row className="">
                    <Col md="6" className="mb-4">
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          value={value.job_title}
                          onChange={handleChange}
                          name="job_title"
                          placeholder="Title"
                        />
                        <span className="bar"></span>
                        <label htmlFor="first">Job Title</label>
                        <span className="errmsg">{error.job_title}</span>
                      </div>
                    </Col>

                    <Col md="6" className="mb-4">
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          value={value.company_name}
                          onChange={handleChange}
                          name="company_name"
                          placeholder="Company Name"
                        />
                        <span className="bar"></span>
                        <label htmlFor="first">Company Name</label>
                        <span className="errmsg">{error.company_name}</span>
                      </div>
                    </Col>
                    <Col md="6" className="mb-4">
                      <div className="location_search group  error">
                        <PlacesAutocomplete
                          value={value.location}
                          searchOptions={searchOptions}
                          onChange={handleLocationChange}
                          onSelect={handleLocationSelect}
                        >
                          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="location_input">
                              <span className="top_text">Location Of the Job</span>
                              <input className='mb-0' {...getInputProps({ placeholder: 'Type address' })} />
                              <div className="autocomplete-dropdown-container">
                                {loading ? <div className="mt-2">Loading...</div> : null}
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
                    </Col>

                    <Col md="6" className="mb-4">
                      <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <span className="top_text">Job Type</span>
                        <Select
                          className="manage_space normal_select"
                          value={value.job_type}
                          name="job_type"
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="">Select Job Type</MenuItem>
                          <MenuItem value={'part_time'}>Part Time</MenuItem>
                          <MenuItem value={'full_time'}>Full time</MenuItem>
                          <MenuItem value={'Apprenticeship'}>Apprenticeship</MenuItem>
                          <MenuItem value={'Permanent'}>Permanent</MenuItem>
                          <MenuItem value={'Fixed_term'}>Fixed term</MenuItem>
                        </Select>
                        <span className="errmsg">{error.job_type}</span>
                      </FormControl>
                    </Col>

                    <Col md="6" className="mb-0">
                      <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <span className="top_text">
                          Search by <span className="requird_txt">*</span>
                        </span>
                        <Select
                          className="manage_space normal_select"
                          onChange={handleChange}
                          name="notify_by"
                          value={value.notify_by}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value={'state'}>State</MenuItem>
                          <MenuItem value={'radius'}>200 KM Radius</MenuItem>
                        </Select>
                        <span className="errmsg">{error.notify_by}</span>
                      </FormControl>
                    </Col>
                    <Col md="6" className="mb-0">
                      <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <span className="top_text">
                          Choose State <span className="requird_txt">*</span>
                        </span>
                        <Select
                          className="manage_space normal_select"
                          onChange={handleChange}
                          name="state"
                          value={value.state}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="">Select State</MenuItem>
                          {stateList?.map((item, i) => (
                            <MenuItem value={item.value} key={i}>
                              {item.displayValue}
                            </MenuItem>
                          ))}
                        </Select>
                        <span className="errmsg">{error.state}</span>
                      </FormControl>
                    </Col>

                    <Col md="12" className="mb-4">
                      <div className="text_decribe">
                        <Textarea placeholder="Advertising Text" onChange={handleChange} value={value.description} name="description" />
                        <span className="errmsg">{error.description}</span>
                      </div>
                    </Col>

                    <Col md="6" className="mb-2">
                      <FormControl fullWidth>
                        <div className="file-uploader">
                          <label htmlFor="iamgesID" className="global_file_upload_deisgn">
                            <InsertPhotoIcon />
                            Upload Image
                            <input type="file" id="iamgesID" onChange={handleImageChange} />
                          </label>
                        </div>
                      </FormControl>
                      <div className="preview_upload">
                        {imagePreviews?.map((preview, index) => (
                          <>
                            <div className="preview_upload_inner">
                              <img key={index} src={preview} alt={`Preview ${index}`} />
                              <button className="text-danger" onClick={() => removeFileItem(index)}>
                                <DeleteOutlineIcon />
                              </button>
                            </div>
                          </>
                        ))}
                      </div>
                      <span className="errmsg">{error.image}</span>
                    </Col>

                    <Col md="6" className="mb-2">
                      <FormControl fullWidth>
                        <div className="file-uploader">
                          <label htmlFor="logoID" className="global_file_upload_deisgn">
                            <InsertPhotoIcon />
                            Upload Logo
                            <input type="file" id="logoID" onChange={handleLogoChange} />
                          </label>
                        </div>
                      </FormControl>
                      <div className="preview_upload">{logoPreview && <img src={logoPreview} alt="drone" />}</div>
                      {/* <span className="errmsg">{error.logo}</span> */}
                    </Col>


                    {getAllLocatData()?.user_type == 'Pilot' && (
                      <Col md="12" className="mb-2">
                        <Alert severity="error">
                          <AlertTitle>Alert</AlertTitle>
                          The Business Employment portal is for job posters only.
                        </Alert>
                      </Col>
                    )}
                    <Col className="text-end">
                      {loading ? (
                        <LoadingBTN />
                      ) : (
                        <>
                          {getAllLocatData()?.jwt ? (
                            getAllLocatData()?.user_type == 'Pilot' ? (
                              <button className="global_btn" disabled>
                                Submit
                              </button>
                            ) : (
                              <button className="global_btn" onClick={validateFun}>
                                Submit
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                className="global_btn"
                                onClick={() =>
                                  modalCall(
                                    <>The Business Employment portal is for job posters only. </>,
                                    <button onClick={() => goToPage()} style={{ textDecoration: 'none' }} className="chat_btn">
                                      Register
                                    </button>
                                  )
                                }
                              >
                                Submit
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </Col>
                    <Col md="12" className="mt-2">
                      {msg == 'success' ? (
                        <Alert severity="success">
                          <AlertTitle>Success</AlertTitle>
                          Your request submitted successfully !!
                        </Alert>
                      ) : msg == 'failed' ? (
                        <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          Something went wrong, Try again !!
                        </Alert>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  {' '}
                  <ApplyNow jobData={value} />{' '}
                </>
              )}
            </div>
          </Container>
        </section>
      </div>

      <FormModal modal={modal} setShowModal={setShowModal} modalData={modalData} />
    </>
  );
};

export default BusinessForm;
