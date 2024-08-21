import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Textarea from '@mui/material/TextareaAutosize';
import PlacesAutocomplete from 'react-places-autocomplete';
import { State } from 'country-state-city';
import { LoadingBTN, toastifyError, toastifySuccess } from 'Utility/Utility';
import { axiosInstance } from 'Utility/Api';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Breacrumb from "staticspage/Header/Breacrumb";
const Lostpet = () => {
  const [stateList, setStateList] = useState([]);
  const [loading, setLaoding] = useState(false);
  const [msg, setMsg] = useState('');

  const [values, setValues] = useState({
    email: '',
    name: '',
    phone: '',
    location: '',
    city: '',
    state: '',
    natural_disaster: '',
    disaster_name: '',
    evacuated: '',
    animal_type: '',
    my_animal: '',
    whos_animal: '',
    missing_details: '',
    last_seen_details: '',
    help_type: '',
    microchip: '',
    chip_number: '',
    wearing_collar: '',
    collar_describe: '',
    assert_volunteers: '',
    notify_by: '',
  });

  const [error, setError] = useState({
    email: '',
    name: '',
    phone: '',
    location: '',
    city: '',
    state: '',
    natural_disaster: '',
    evacuated: '',
    animal_type: '',
    my_animal: '',
    missing_details: '',
    last_seen_details: '',
    help_type: '',
    microchip: '',
    wearing_collar: '',
    notify_by: '',
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({
      ...values,
      [name]: value
    });
  };
  const handleLocationSelect = async (value) => {
    try {
      setValues((prevValue) => ({
        ...prevValue,
        location: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };

  const handleLocationChange = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      location: value
    }));
  };
  useEffect(() => {
    getStateFun();
    getAnimalFromContent()
  }, []);
  const getStateFun = () => {
    const stateData = State?.getStatesOfCountry('AU').map((state) => ({
      value: state.name,
      displayValue: state.name
    }));
    setStateList(stateData);
  };

  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    if (values.name.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['name']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['name']: true };
      });
    }
    if (values.phone == '') {
      setError((prevValues) => {
        return { ...prevValues, ['phone']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['phone']: true };
      });
    }
    if (values.email.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['email']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['email']: true };
      });
    }
    if (values.location.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['location']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['location']: true };
      });
    }
    if (values.natural_disaster.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['natural_disaster']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['natural_disaster']: true };
      });
    }
    if (values.state.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['state']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['state']: true };
      });
    }
    if (values.animal_type == '') {
      setError((prevValues) => {
        return { ...prevValues, ['animal_type']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['animal_type']: true };
      });
    }
    if (values.microchip == '') {
      setError((prevValues) => {
        return { ...prevValues, ['microchip']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['microchip']: true };
      });
    }
    if (values.wearing_collar == '') {
      setError((prevValues) => {
        return { ...prevValues, ['wearing_collar']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['wearing_collar']: true };
      });
    }
    if (values.evacuated == '') {
      setError((prevValues) => {
        return { ...prevValues, ['evacuated']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['evacuated']: true };
      });
    }
    if (values.notify_by == '') {
      setError((prevValues) => {
        return { ...prevValues, ['notify_by']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['notify_by']: true };
      });
    }
    if (values.help_type == '') {
      setError((prevValues) => {
        return { ...prevValues, ['help_type']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['help_type']: true };
      });
    }
    if (values.missing_details == '') {
      setError((prevValues) => {
        return { ...prevValues, ['missing_details']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['missing_details']: true };
      });
    }
    if (values.last_seen_details == '') {
      setError((prevValues) => {
        return { ...prevValues, ['last_seen_details']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['last_seen_details']: true };
      });
    }
    if (values.my_animal == '') {
      setError((prevValues) => {
        return { ...prevValues, ['my_animal']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['my_animal']: true };
      });
    }
    if (values.city == '') {
      setError((prevValues) => {
        return { ...prevValues, ['city']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['city']: true };
      });
    }
  };
  const {
    name,
    location,
    email,
    phone,
    animal_type,
    city,
    evacuated,
    notify_by,
    help_type,
    last_seen_details,
    microchip,
    missing_details,
    my_animal,
    natural_disaster,
    state,
    wearing_collar,
  } = error;
  useEffect(() => {
    if (
      name === true &&
      location === true &&
      email === true &&
      phone === true &&
      animal_type === true &&
      city === true &&
      evacuated === true &&
      notify_by === true &&
      help_type === true &&
      last_seen_details === true &&
      microchip === true &&
      missing_details === true &&
      my_animal === true &&
      natural_disaster === true &&
      state === true &&
      wearing_collar === true
    ) {
      handleSubmit();
    }
  }, [
    addUpdateApiCallCount,
    name,
    location,
    email,
    animal_type,
    city,
    evacuated,
    notify_by,
    help_type,
    last_seen_details,
    microchip,
    missing_details,
    my_animal,
    natural_disaster,
    state,
    wearing_collar,
  ]);
  const handleSubmit = async () => {
    setLaoding(true);
    try {
      const res = await axiosInstance.post('/user/createAnimalRescue', values);
      if (res.data.status == 200) {
        setLaoding(false);
        setMsg('success');
        setValues({
          ...values,
          email: '',
          name: '',
          phone: '',
          location: '',
          city: '',
          state: '',
          natural_disaster: '',
          disaster_name: '',
          evacuated: '',
          notify_by: '',
          animal_type: '',
          my_animal: '',
          whos_animal: '',
          missing_details: '',
          last_seen_details: '',
          help_type: '',
          microchip: '',
          chip_number: '',
          wearing_collar: '',
          collar_describe: '',
          assert_volunteers: ''
        });
        toastifySuccess('Your animal rescue request has been submitted.');
      } else {
        setLaoding(false);
        toastifyError("Something Wen't Wrong !!");
        setMsg('failed');
      }
    } catch (error) {
      toastifyError("Something Wen't Wrong !!");
      setMsg('failed');
      setLaoding(false);
    }
  };

  const [animalFields, setAnimalFields] = useState({})
  const getAnimalFromContent = async () => {
    const res = await axiosInstance.post('user/get_animal_fields')
    if (res?.status === 200) {
      setAnimalFields(res?.data?.animalFields)
    } else {
      setAnimalFields({})
    }
  }
  return (
    <>
      <div className="lost_pet">
        {/* <section className="breacrumb"></section> */}
        {/* <div className="bg_top"></div>
         */}

<Breacrumb />
        <section className="form_pilot_find">
          <Container>
            <div className="inner_main_box custom-form">
              <div className="form_heading">
                <div>
                  <h2>{animalFields?.title1}</h2>
                  <div dangerouslySetInnerHTML={{ __html: animalFields?.content1 }} />
                </div>
                {/* <div>
                  <h2>{animalFields?.title2}</h2>
                  <p>{animalFields?.content2}</p>
                </div> */}
              </div>
              <Row className="">
                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="name"
                      value={values.name}
                      placeholder="Enter your Name"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      Name <span className="requird_txt">*</span>
                    </label>
                    <span className="errmsg">{error.name}</span>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="email"
                      value={values.email}
                      placeholder="Enter your Email Address"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      Email <span className="requird_txt">*</span>
                    </label>
                    <span className="errmsg">{error.email}</span>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="phone"
                      value={values.phone}
                      maxLength={10}
                      placeholder="Enter your Contact Number"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      Phone Number <span className="requird_txt">*</span>
                    </label>
                    <span className="errmsg">{error.phone}</span>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="location_search group  error">
                    <PlacesAutocomplete value={values.location} onChange={handleLocationChange} onSelect={handleLocationSelect}>
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="location_input">
                          <span className="top_text">
                            Animal location <span className="requird_txt">*</span>
                          </span>
                          <input className='mb-0' {...getInputProps({ placeholder: 'Approx location of lost animal' })} />
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
                  <div className="group  error">
                    <input className="inputMaterial" type="text" value={'Australia'} placeholder="Enter your Name" />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      Country <span className="requird_txt">*</span>
                    </label>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="manage_space normal_select">
                    <span className="top_text">
                      Search by <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select m-0"
                      onChange={handleChange}
                      name="notify_by"
                      value={values.notify_by}
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

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      Choose State <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="state"
                      value={values.state}
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

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="city"
                      value={values.city}
                      placeholder="Enter your City"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      City <span className="requird_txt">*</span>
                    </label>
                    <span className="errmsg">{error.city}</span>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      I am currently being affected by a natural disaster. <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      value={values.natural_disaster}
                      onChange={handleChange}
                      name="natural_disaster"
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'YES'}>Yes</MenuItem>
                      <MenuItem value={'NO'}>No</MenuItem>
                    </Select>

                    <span className="errmsg">{error.natural_disaster}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="disaster_name"
                      value={values.disaster_name}
                      placeholder="Type Disaster Name "
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">If you choose yes affected by a natural disaster type name (optional) </label>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      I have been evacuated. <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="evacuated"
                      value={values.evacuated}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'YES'}>Yes</MenuItem>
                      <MenuItem value={'NO'}>No</MenuItem>
                      <MenuItem value={'OTHER'}>Other</MenuItem>
                    </Select>
                    <span className="errmsg">{error.evacuated}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      I am reporting the following animal missing (please submit one report per animal).{' '}
                      <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="animal_type"
                      value={values.animal_type}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'Cat'}>Cat</MenuItem>
                      <MenuItem value={'Dog'}>Dog</MenuItem>
                      <MenuItem value={'Bird'}>Bird</MenuItem>
                      <MenuItem value={'Rodent'}>Rodent</MenuItem>
                      <MenuItem value={'Reptile'}>Reptile</MenuItem>
                      <MenuItem value={'Horse'}>Horse</MenuItem>
                      <MenuItem value={'Cow'}>Cow</MenuItem>
                      <MenuItem value={'Other'}>Other</MenuItem>
                    </Select>
                    <span className="errmsg">{error.animal_type}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      This is your animal ? <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="my_animal"
                      value={values.my_animal}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'YES'}>Yes</MenuItem>
                      <MenuItem value={'NO'}>No</MenuItem>
                    </Select>
                    <span className="errmsg">{error.my_animal}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="whos_animal"
                      value={values.whos_animal}
                      placeholder="Type..."
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">
                      If this is not your animal, please explain who s animal it is and why you are reporting it.
                    </label>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      What kind of help do your animals need? <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="help_type"
                      value={values.help_type}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'Locate and rescue, I have somewhere safe to keep the animal'}>
                        Locate and rescue, I have somewhere safe to keep the animal
                      </MenuItem>
                      <MenuItem value={'Locate and rescue, I do NOT have somewhere safe to keep the animal'}>
                        Locate and rescue, I do NOT have somewhere safe to keep the animal
                      </MenuItem>
                      <MenuItem value={'Locate and care for onsite'}>Locate and care for onsite</MenuItem>
                      <MenuItem value={'Locate and report back'}>Locate and report back</MenuItem>
                      <MenuItem value={'Other'}>Other</MenuItem>
                    </Select>
                    <span className="errmsg">{error.help_type}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      Does the animal have a microchip? <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="microchip"
                      value={values.microchip}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'YES'}>Yes</MenuItem>
                      <MenuItem value={'NO'}>No</MenuItem>
                      <MenuItem value={'OTHER'}>Other</MenuItem>
                    </Select>
                    <span className="errmsg">{error.microchip}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      onChange={handleChange}
                      name="chip_number"
                      value={values.chip_number}
                      placeholder="Type Number Here"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">If yes, what is the chip number?</label>
                  </div>
                </Col>

                <Col md="6" className="mb-4">
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">
                      Was the animal wearing a collar <span className="requird_txt">*</span>
                    </span>
                    <Select
                      className="manage_space normal_select"
                      onChange={handleChange}
                      name="wearing_collar"
                      value={values.wearing_collar}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'YES'}>Yes</MenuItem>
                      <MenuItem value={'NO'}>No</MenuItem>
                    </Select>
                    <span className="errmsg">{error.wearing_collar}</span>
                  </FormControl>
                </Col>

                <Col md="6" className="mb-4">
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      onChange={handleChange}
                      name="collar_describe"
                      value={values.collar_describe}
                      type="text"
                      placeholder="Color, Material, etc…"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">If animal wearing a collar describe (optional)</label>
                  </div>
                </Col>

                <Col md="12" className="mb-4">
                  <div className="text_decribe">
                    <label htmlFor="first">What else do you want ASSERT volunteers to know?</label>
                    <Textarea
                      placeholder="Type anything…"
                      onChange={handleChange}
                      name="assert_volunteers"
                      value={values.assert_volunteers}
                    />
                  </div>
                </Col>

                <Col md="12" className="mb-4">
                  <div className="text_decribe">
                    <label htmlFor="first">
                      Please provide all details of when and where the animal was last seen. Include the address, direction of travel, and
                      all other important details. <span className="requird_txt">*</span>
                    </label>
                    <Textarea
                      placeholder="Type anything…"
                      onChange={handleChange}
                      name="last_seen_details"
                      value={values.last_seen_details}
                    />
                    <span className="errmsg">{error.last_seen_details}</span>
                  </div>
                </Col>

                <Col md="12" className="mb-4">
                  <div className="text_decribe">
                    <label htmlFor="first">
                      Please describe in detail the animal you are reporting missing. Include all markings, details, characteristics, etc.
                      <span className="requird_txt">*</span>
                    </label>
                    <Textarea placeholder="Type anything…" onChange={handleChange} name="missing_details" value={values.missing_details} />
                    <span className="errmsg">{error.missing_details}</span>
                  </div>
                </Col>

                <Col className="">
                  {loading ? (
                    <LoadingBTN />
                  ) : (
                    <button className="global_btn" onClick={validateFun}>
                      Submit
                    </button>
                  )}
                </Col>
                <Col md="12" className="mt-2">
                  {msg == 'success' ? (
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      Your animal rescue request has been submitted.
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
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Lostpet;
