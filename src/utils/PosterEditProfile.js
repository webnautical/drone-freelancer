import React, { useEffect, useState } from 'react';
 
import { Grid, Typography } from '@mui/material';
 
// import EditIcon from '@mui/icons-material/Edit';
 
import { useLocation, useNavigate } from '../../node_modules/react-router-dom/dist/index';
 
import { defaultUserIMG, toastifyError, toastifySuccess } from 'Utility/Utility';
 
import MenuItem from '@mui/material/MenuItem';
 
import FormControl from '@mui/material/FormControl';
 
import Select from '@mui/material/Select';
 
import { State } from 'country-state-city';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import config from 'config';
// import ShareIcon from '@mui/icons-material/Share';
 
 
const PosterEditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const posterInfo = location?.state?.data
  console.log("posterInfo", posterInfo)
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
 
  // const countryChnage = (e) => {
  //   const countryCode = e.target.value.isoCode;
  //   setCountryShow(e.target.value.name)
  //   setValue((prevValue) => ({
  //     ...prevValue,
  //     country: e.target.value.name,
  //   }));
  //   const stateData = State?.getStatesOfCountry(countryCode).map((state) => ({
  //     value: state.name,
  //     displayValue: state.name
  //   }));
  //   setStateList(stateData);
  // }
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
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // const res = await axiosInstance.post('/user/updatePosterProfile', value);
      const res = await fetch(`${config.url}/admin/updatePosterProfileByadmin/${posterInfo?._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        //  Authorization: `Bearer ${getAllLocatData()?.jwt}`
         },
        body: JSON.stringify(value)
      });
      const resultdata = await res.json();
      if (resultdata.status == 200) {
        navigate('/admin/utils/posterlist');
        toastifySuccess('Profile Updated Succesfully !!');

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
 
  return (
    <div>
      <Grid className="profile_edit_poster" container spacing={2}>
        <Grid item xs={12} sx={{ mt: 7.25 }}>
          <Typography variant="h5" className="global_top_head">
            Edit Profile
          </Typography>
        </Grid>
 
        <Grid item xl={12}>
          <Grid className="task_details top_box" item xl={12} lg={12} md={12} sm={12} xs={12}>
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
                    placeholder="Enter Your Phone"
                  />{' '}
                  <label htmlFor="firstName">Phone</label>
                  <span className="bar"></span>
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
                  <span className="top_text">State</span>
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
                <div className="group  error">
                  <input
                    className="inputMaterial"
                    type="text"
                    value={value.street}
                    onChange={handleChange}
                    name="street"
                    placeholder="Enter Your street"
                  />{' '}
                  <label htmlFor="firstName">Street</label>
                  <span className="bar"></span>
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