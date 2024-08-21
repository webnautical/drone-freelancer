
import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { useLocation, useNavigate } from '../../node_modules/react-router-dom/dist/index';

import { defaultUserIMG, getAllLocatData, toastifyError, toastifySuccess } from 'Utility/Utility';
import PlacesAutocomplete from 'react-places-autocomplete';

import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';

import Select from '@mui/material/Select';

import { State } from 'country-state-city';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import config from 'config';

const PosterEditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const posterInfo = location?.state?.posterInfo;
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([])
  // const [showCountry, setCountryShow] = useState('')
  const [value, setValue] = useState({
    first_name: posterInfo.first_name,
    last_name: posterInfo.last_name,
    phone: posterInfo.phone,
    image: posterInfo.image ? posterInfo.image : defaultUserIMG,
    street: posterInfo.street,
    state: posterInfo.state ? posterInfo.state : 'Australia',
    country: posterInfo.country
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };
  const [imagePreview, setImagePreview] = useState(value.image);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue({
          ...value, 'image': reader.result.split(',')[1]
        })
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    getStateFun()
  }, [])
  const getStateFun = () => {
    const stateData = State?.getStatesOfCountry('AU').map((state) => ({
      value: state.name,
      displayValue: state.name
    }));
    setStateList(stateData);
  }

  const [error, setError] = useState({
    'phone': ''
  })
  const handleUpdate = async () => {
    setLoading(true);
    const australiaPhoneNumberRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

    // Phone No Validation
    if (value.phone == '') {
      setError((prevValues) => {
        return { ...prevValues, ['phone']: true };
      });
    } else if (!australiaPhoneNumberRegex.test(value.phone)) {
      setError((prevValues) => {
        return { ...prevValues, ['phone']: 'Please enter valid mobile no !!' };
      });
      setLoading(false);
      return false
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['phone']: true };
      });
    }

    try {
      const res = await fetch(`${config.url}/user/updatePosterProfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
        body: JSON.stringify(value)
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        navigate('/user/dashboard/default');
        toastifySuccess('Profile Successfully Updated');
        localStorage.setItem('loginname', value.first_name);
        localStorage.setItem('img', resultdata?.getUserdata?.image);
        setLoading(false);
      } else {
        toastifyError('Something Went Wrong !!');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toastifyError('Something Went Wrong !!');
      setLoading(false);
    }
  };

  const handleLocationSelect = async (value) => {
    try {
      setValue((prevValue) => ({
        ...prevValue,
        street: value
      }));
    } catch (error) {
      console.error('Error selecting address', error);
    }
  };
  const handleLocationChange = (value) => {
    setValue((prevValue) => ({
      ...prevValue,
      street: value
    }));
  };

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };

  return (
    <div>
      <Grid className="profile_edit_poster" container spacing={2}>
        <Grid item xs={12} sx={{ mt: 3.25 }}>
          <Typography variant="h5" className="global_top_head">
            Edit Profile
          </Typography>
        </Grid>

        <Grid item xl={12}>
          <Grid className="profile_edit_poster task_details top_box" item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid xl={12} lg={12} md={12} sm={12} xs={12}>
              <div className="profile">
                <div className="upload">
                  <img src={imagePreview} style={{ width: '120px', height: '120px' }} alt='sdf' />
                  <div className="round"> <input type="file" onChange={handleImageChange} />
                    <ModeEditIcon />
                  </div>
                </div>
              </div>
            </Grid>

            <Grid className="mt-5" container spacing={2}>
              <Grid item xs={4}>
                <div className="group  error">
                  <input
                    className="inputMaterial"
                    value={value.first_name}
                    onChange={handleChange}
                    type="text"
                    name="first_name"
                    placeholder="Enter Your First Name"
                  />{' '}
                  <label htmlFor="firstName">First Name</label>
                  <span className="bar"></span>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div className="group  error">
                  <input
                    className="inputMaterial"
                    type="text"
                    value={value.last_name}
                    onChange={handleChange}
                    name="last_name"
                    placeholder="Enter Your Last Name"
                  />{' '}
                  <label htmlFor="firstName">Last Name</label>
                  <span className="bar"></span>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div className="group  error">
                  <input
                    className="inputMaterial"
                    type="text"
                    value={value.phone}
                    onChange={handleChange}
                    name="phone"
                    maxLength={10}
                    placeholder="Enter Your Phone"
                  />{' '}
                  <label htmlFor="firstName">Phone</label>
                  <span className="bar"></span>
                  <span className='text-danger'>{error.phone}</span>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div className="group  error">
                  <input
                    className="inputMaterial"
                    type="text"
                    value={'Australia'}
                    readOnly
                  />{' '}
                  {/* <label htmlFor="firstName">Country</label> */}
                  <span className="bar"></span>
                </div>
              </Grid>
              <Grid item xs={4}>
                <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                  <span className="top_text">States</span>
                  <Select
                    value={value.state}
                    onChange={handleChange}
                    displayEmpty
                    name="state"
                    inputProps={{ 'aria-label': 'Without label' }}
                    className="normal_select"

                  >
                    {stateList?.map((item, i) => (
                      <MenuItem value={item.value} key={i}>
                        {item.displayValue}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <span style={{ position: 'absolute', top: '10px', fontWeight: '600' }}>{value.state}</span> */}
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                {/* <div className="group  error">
                  <input
                    className="inputMaterial"
                    type="text"
                    value={value.street}
                    onChange={handleChange}
                    name="street"
                    placeholder="Enter Your street"
                  />{' '}
                  <label htmlFor="firstName"> Location (City/Town)</label>
                  <span className="bar"></span>
                </div> */}

                <div className=" group error">
                  <PlacesAutocomplete
                    value={value.street}
                    name="street"
                    onChange={handleLocationChange}
                    onSelect={handleLocationSelect}
                    searchOptions={searchOptions}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div className="location_input mb-0">
                        <span className="top_text mb-0">Location (City/Town) <span className='dot_alert'></span></span>
                        <input className='mb-0' {...getInputProps({ placeholder: 'Start Typing' })} />
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
                  <span className="errmsg">{error.location}</span>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="text-end">
                  {loading ? (
                    <button className="global_btn">
                      <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                    </button>
                  ) : (
                    <button className="global_btn" onClick={() => handleUpdate()}>
                      Update
                    </button>
                  )}
                </div>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default PosterEditProfile;