
import Button from '@mui/material/Button';

import {
  FormControl,
  // FormGroup, Input, InputLabel,  makeStyles,
  TextField,
  Grid
} from '@mui/material';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import BackupIcon from '@mui/icons-material/Backup';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { useLocation, useNavigate } from 'react-router';
import { useState ,useRef,useEffect } from 'react';
// import axios from 'axios';
import config from 'config';
import {getCurrentDate, toastifyError, toastifySuccess } from 'Utility/Utility';
// const theme = createTheme();
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
const addionalFeatures = ['Group Photography', '360* Photography', 'Group Videography', 'Editing', 'Branding'];
const radiocertficate = [
  'Very Small(2Kg)',
  'X Small (2-25Kg)',
  'X medium (25-150Kg)',
  'X large (150Kg)',
  'Multi-rotor aircraft'

  // 'X small (2-25kg) (where required with 7kg restriction)',
  // 'X medium (25-150kg)',
  // 'X large (150kg)'
];
const dronesused = ['Djl Mini 3pro', 'Matrice 210RTX'];

const cameraSpecification = ['4K', '60Fps'];
export default function UpdateUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRecord = location.state.data;
  const [first_name, setFirst_name] = useState(userRecord.first_name);
  const [last_name, setLast_name] = useState(userRecord.last_name);
  const [email, setEmail] = useState(userRecord.email);
  const [street, setStreet] = useState(userRecord.street);
  const [state, setState] = useState(userRecord.state);
  // const [short_descrtiption, useshort_descrtiption ] = useState(userRecord.short_descrtiption);
  const [locations, setlocation] = useState(userRecord.location);
  const [pincode, setPincode] = useState(userRecord.pincode);  //
  const [website_link, setwebsite_link] = useState(userRecord.website_link); 
  const [instagram_link, setinstagram_link] = useState(userRecord.instagram_link); 
  const [facebook_link, setfacebook_link] = useState(userRecord.facebook_link); 
  const [twitter_link, settwitter_link] = useState(userRecord.twitter_link); 
  const [personName, setPersonName] = useState([]);
  // const [qualification_id, setqualification_id] = useState(userRecord.qualification_id); 
  const [windspeed, setWindspeed] = useState('');
  const [payload, setPayload] = useState('');
  const [skill, setSkill] = useState('');

  const [radio, setRadio] =useState([]);

  const [optime, setOptime] = useState('');
  const [cameraspecification, setCameraspecification] = useState([]);
  const [valuees, setValues] = useState({
    // first_name: '',
    // last_name: '',
    // phone: '',
    // email: '',
    // company: '',
    // street: '',
    // Suburb: '',
    // pincode: '',
    // short_description: '',
    // location: '',
    // location1: '',
    // multiCategory: [],
    // instagram_link: '',
    // facebook_link: '',
    // twitter_Link: '',
    weight_limit: '',
    flight_time_limit: '',
    qualification_expiry: '',

    extra_area_category: ''
  });
  const [
    phone,
     setPhone
  ] = useState(userRecord.phone);
  const [selectedImage, setSelectedImage] = useState(userRecord.image);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(userRecord.image);

  const [qualificationAttachement, setQualificationAttachement] = useState([]);
  const [licence, setlicence] = useState('');
  const [qualification, setQualification] = useState('');
  const [userQualification, setUserQualification] = useState({});
  const [pecification, setSpecification] = useState([]);

console.log(userQualification,"userQualification")
  const inputRef = useRef();

  const handleform = () => {
    const updatedUser = {
      first_name,
      last_name,
      email,
      phone,
      state: state,
      street: street,
      pincode: pincode,
      website_link:website_link,
      instagram_link:instagram_link,
      facebook_link:facebook_link,
      location: locations,
      twitter_link:twitter_link,
      image: base64Stringofsub.split(',').pop(),
      
      qualification: qualification,
      lisencs_type: licence,
      qualification_expiry: valuees.qualification_expiry,
      pro_drone_oprator_longtime: optime,

      rate_skill_level: skill,
      weight_limit: valuees.weight_limit,
      flight_time_limit: valuees.flight_time_limit,
      maximum_wind_speed: windspeed,
      addition_services: radio,
      radio_certificate: pecification,
      attachment: qualificationAttachement
    };

    console.log(updatedUser,"updatedUser")
    alert()
    fetch(`${config.url}/admin/updateUserProfilebyAdmin/${userRecord._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify(updatedUser)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === 'Update UserProfile successfully') {
          toastifySuccess('Update UserProfile successfully')
          navigate(`${config.basename}/utils/usermangement`);
        } else {
          toastifyError('Something want wrong');
        }
      });
  };


  const handleChangespayload = (event) => {
    setPayload(event.target.value);
  };
  const handlechangeings = (e) => {
    const { name, value } = e.target;
    setValues({ ...valuees, [name]: value });
  };

  const handlesubcategoryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Stringofsub = event.target.result;
        setSubcategoryBase64Image(base64Stringofsub);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };
const handleradiocertificate = (event) => {
    const {
      target: { value }
    } = event;
    setSpecification(typeof value === 'string' ? value.split(',') : value);
  };
  const handleChangeop = (event) => {
    setOptime(event.target.value);
  };

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64Data = reader.result;
          setQualificationAttachement((prevFiles) => [...prevFiles, base64Data]);
        };
      });
    }
  };
  const onChooseFile = () => {
    inputRef.current.click();
  };
  const removeFile = (index) => {
    setQualificationAttachement((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleChangelicence = (event) => {
    setlicence(event.target.value);
  };

 

  const handleChangeswindspeed = (event) => {
    setWindspeed(event.target.value);
  };
// if(userRecord.qualification_id !== ""){
// }
  const userData = async () => {
    try {
      fetch(`${config.url}/admin/getQualification/${userRecord.qualification_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get data successfully') {
            console.log(data,"data")
            alert("hshs")
            if (data?.qualification) {
              // setValues({ ...valuees, multiCategory: data?.getacceptedjob[0]?.specilization });
              // setUserdata(data?.getacceptedjob[0]);
              setUserQualification(data?.qualification[0]);
              // setEquipment(data?.getacceptedjob[0]?.equipment);
              // setCategory(data?.getacceptedjob[0]?.specilization);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  

useEffect(()=>{
  userData();
},[])
 
  useEffect(() => {
    // if (userDatas) {
      setValues({
        ...valuees,
        // first_name: userDatas?.first_name,
        // last_name: userDatas?.last_name,
        // phone: userDatas?.phone,
        // email: userDatas?.email,
        // company: userDatas?.company,
        // street: userDatas?.street,
        // Suburb: userDatas?.Suburb,
        // pincode: userDatas?.pincode,
        // short_description: userDatas?.short_description,
        // location1: userDatas?.location,
        // location: userDatas.job_request?.location,
        // instagram_link: userDatas?.instagram_link,
        // facebook_link: userDatas?.facebook_link,
        // twitter_Link: userDatas?.twitter_link,
        qualification_expiry: userQualification?.qualification_expiry,
        weight_limit: userQualification?.weight_limit,
        flight_time_limit: userQualification?.flight_time_limit,

        extra_area_category: userQualification?.extra_area_category
      });
      // setCountry(userDatas?.country);
      // setWebsite_link(userDatas?.website_link);
      // setUploadedImages(userDatas?.image);
      // setCategory(userDatas.specilization);
      // setRadius(userDatas.radius);
      // setextraarea(userDatas.job_request?.extra_area_category);

      setQualificationAttachement(userQualification?.attachment);
      setlicence(userQualification?.lisencs_type);
      setQualification(userQualification?.qualification);
      setOptime(userQualification?.pro_drone_oprator_longtime);
      setSkill(userQualification?.rate_skill_level);
      setWindspeed(userQualification?.maximum_wind_speed);
      setRadio(userQualification?.addition_services);
      setSpecification(userQualification?.radio_certificate);
      // setPersonName(equipment?.drone);
      // setCameraspecification(equipment?.camera_specification);
      // setPayload(equipment?.payload);
    // } else {
    //   setValues({
    //     ...valuees,
    //     first_name: '',
    //     last_name: '',
    //     phone: '',
    //     email: '',
    //     company: '',
    //     street: '',
    //     Suburb: '',
    //     pincode: '',
    //     short_description: '',
    //     location: '',
    //     facebook_link: '',
    //     twitter_Link: '',
    //     specilization: ''
    //   });
    // }
  }, [userQualification]);

  const handleChangequalification = (event) => {
    setQualification(event.target.value);
  };
const handleChangeskill = (event) => {
    setSkill(event.target.value);
  };

  const handleChangeadditional = (event) => {
    const {
      target: { value }
    } = event;
    setRadio(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChangedroneused = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChanged10 = (event) => {
    const {
      target: { value }
    } = event;
    setCameraspecification(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  return (
    <div>
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update User</h2>
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  value={first_name}
                  onChange={(e) => {
                    setFirst_name(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  value={last_name}
                  onChange={(e) => {
                    setLast_name(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="email"
                  label="Email Address"
                  name="email"
                  value={email}
                  disabled
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="phone"
                  label="Phone"
                  name="phone"
                  value={phone}
                  // disabled
                  onChange={(e) => {
                      setPhone(e.target.phone);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="street"
                  label="Street"
                  name="street"
                  value={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="location"
                  label="location"
                  name="location"
                    value={locations}
                    onChange={(e) => {
                      setlocation(e.target.value);
                    }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="state"
                  label="State"
                  name="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="pincode"
                  label="Pincode"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>  
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="website_link"
                  label="website_link"
                  name="website_link"
                  value={website_link}
                  onChange={(e) => {
                    setwebsite_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="instagram_link"
                  label="instagram_link"
                  name="instagram_link"
                  value={instagram_link}
                  onChange={(e) => {
                    setinstagram_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="facebook_link"
                  label="facebook_link"
                  name="facebook_link"
                  value={facebook_link}
                  onChange={(e) => {
                    setfacebook_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="twitter_link"
                  label="twitter_link"
                  name="twitter_link"
                  value={twitter_link}
                  onChange={(e) => {
                    settwitter_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControl fullWidth> 
                <TextField
                  variant="outlined"
                  id="short_descrtiption"
                  label="short_descrtiption"
                  name="short_descrtiption"
                  value={short_descrtiption}
                  onChange={(e) => {
                    useshort_descrtiption(e.target.value);
                  }}
                />
              </FormControl>
            </Grid> */}
            <Grid item xs={12}>  
              <FormControl fullWidth>
                <h4>Upload Profile Image</h4>
                <input type="file" accept="image/*" onChange={handlesubcategoryUpload} />
                {selectedImage && (
                  <div>
                    <h4>Selected Image:</h4>
                    <img src={base64Stringofsub} alt="Selected" style={{ maxWidth: '200px' }} />
                  </div>
                )}
              </FormControl>
            </Grid>
           
          </Grid>

          {/* <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <Button className="global_dashbtn" onClick={handleform}>
                Update
              </Button>
            </Grid>
          </Grid> */}
        </Grid>

        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update User Qualification</h2>
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
           
          <Grid container sx={{ justifyContent: 'center' }}>
                <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid item xs={6}>
                      <input type="file" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} multiple />

                      {/* Button to trigger the file input dialog */}
                      <button className="file-btn" onClick={onChooseFile}>
                        <span className="material-symbols-rounded">
                          <BackupIcon />
                        </span>{' '}
                        Upload Files
                      </button>

                      {qualificationAttachement?.length > 0 && (
                        <div className="selected-files">
                          {qualificationAttachement?.map((file, index) => (
                            <div key={index} className="select-inner d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <InsertDriveFileIcon />
                                <p className="m-0">{file?.name}</p>
                              </div>
                              <button onClick={() => removeFile(index)}>
                                <span className="material-symbols-rounded">
                                  <DeleteIcon />
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={2} className="form_Qualification">
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">Qualification (Which License do you have)</span>
                      <Select
                        value={licence}
                        onChange={handleChangelicence}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="normal_select"
                      >
                        <MenuItem value="">Select Licence</MenuItem>
                        <MenuItem value={'Nothing yet'}>Nothing yet (Hobbyist: You can still join us),</MenuItem>
                        <MenuItem value={'X ARN'}>X ARN (Aviation Reference Number) need to be validated to continue.</MenuItem>
                        <MenuItem value={'X RPA'}>X RPA operator accreditation</MenuItem>
                        <MenuItem value={'X RePL'}>X RePL</MenuItem>
                        <MenuItem value={'CASA ACCOUNT'}>CASA ACCOUNT:</MenuItem>
                        <MenuItem value={'RPA Operator accreditation from CASA'}>
                          X I have registered my drone and got and RPA operator accreditation from CASA
                        </MenuItem>
                        <MenuItem value={'RPA operator accreditation from CASA at a later date'}>
                          X I will register my drone and get and RPA operator accreditation from CASA at a later date
                        </MenuItem>
                      </Select>
                      {/* <span className="errmsg">{error.lisencs_type}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">Qualification</span>
                      <Select
                        value={qualification || []}
                        onChange={handleChangequalification}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="normal_select"
                      >
                        <MenuItem value="">Select Qualification</MenuItem>
                        <MenuItem value={'A2 CoFc'}>A2 CoFc</MenuItem>
                        <MenuItem value={'GVC'}>GVC</MenuItem>
                        <MenuItem value={'Operation Authorisation'}>Operational Authorisation</MenuItem>
                        <MenuItem value={'Osc'}>OSC</MenuItem>
                      </Select>
                      {/* <span className="errmsg">{error.qualification}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="date"
                        name="qualification_expiry"
                        value={valuees.qualification_expiry}
                        min={getCurrentDate()}
                        onChange={handlechangeings}
                      />
                      <label htmlFor="firstName">Licence Expiry</label> <span className="bar"></span>
                      {/* <span className="errmsg">{error.qualification_expiry}</span> */}
                      <span style={{ position: 'absolute', top: '10px', background: '#fff', fontSize: '17px', padding: '2px 6px' }}>
                        {valuees.qualification_expiry}
                      </span>
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">How long you have been a operator?</span>
                      <Select
                        value={optime}
                        onChange={handleChangeop}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="normal_select"
                      >
                        <MenuItem value="">Select Time</MenuItem>
                        <MenuItem value={'1'}>1 Year</MenuItem>
                        <MenuItem value={'2'}>2 Year</MenuItem>
                        <MenuItem value={'3'}>3 Year</MenuItem>
                      </Select>
                      {/* <span className="errmsg">{error.pro_drone_oprator_longtime}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">How Would you rate your skill level</span>
                      <Select
                        value={skill}
                        onChange={handleChangeskill}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="normal_select"
                      >
                        <MenuItem value="">Select Skill level</MenuItem>
                        <MenuItem value={'Standard'}>Standard</MenuItem>
                        <MenuItem value={'Advanced'}>Advanced</MenuItem>
                        <MenuItem value={'Expert'}>Expert</MenuItem>
                      </Select>
                      {/* <span className="errmsg">{error.rate_skill_level}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder=""
                        name="weight_limit"
                        value={valuees.weight_limit}
                        onChange={handlechangeings}
                      />
                      <label htmlFor="firstName">Weight Limit (in kg)</label> <span className="bar"></span>
                      {/* <span className="errmsg">{error.weight_limit}</span> */}
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder=""
                        name="flight_time_limit"
                        value={valuees.flight_time_limit}
                        onChange={handlechangeings}
                      />
                      <label htmlFor="firstName">Flight Time Limit (in Minutes)</label> <span className="bar"></span>
                      {/* <span className="errmsg">{error.flight_time_limit}</span> */}
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">maximum wind speed </span>
                      <Select
                        value={windspeed}
                        onChange={handleChangeswindspeed}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="normal_select"
                      >
                        <MenuItem value="">Select Skill level</MenuItem>
                        <MenuItem value={'Level 0 (LessThen 1 mph 0m/s)'}>Level 0 (Less Then 1 mph 0 m/s)</MenuItem>
                        <MenuItem value={'Level 1 (1-3 mph; 0.5-1.5 m/s)'}>Level 1 (1 - 3 mph; 0.5-1.5 m/s)</MenuItem>
                        <MenuItem value={'Level 2 (4-7 mph; 2-3 m/s)'}>Level 2 (4 - 7 mph; 2-3 m/s)</MenuItem>
                        <MenuItem value={'Level 3 (8-12 mph; 3.5-5 m/s)'}>Level 4 (8 - 12 mph; 3.5-5 m/s)</MenuItem>
                        <MenuItem value={'Level 4 (13-18 mph; 4-8 m/s)'}>Level 5 (19 - 24 mph; 8.5-10.5 m/s)</MenuItem>
                        <MenuItem value={'Level 5 (19-24 mph; 8.5-10.5 m/s)'}>Level 5 (19-24 mph; 8.5-10.5 m/s)</MenuItem>
                      </Select>
                      {/* <span className="errmsg">{error.maximum_wind_speed}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                      <InputLabel id="demo-multiple-checkbox-label" className="fuuu">
                        Addition services
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={radio || []}
                        onChange={handleChangeadditional}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        className="check_select"
                        placeholder="hello"
                      >
                        {addionalFeatures?.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={radio && radio.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      {/* <span className="errmsg">{error.addition_services}</span> */}
                    </FormControl>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                      <InputLabel id="demo-multiple-checkbox-label">Radio Certificate</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={pecification || []}
                        onChange={handleradiocertificate}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        className="check_select"
                        placeholder="hello"
                      >
                        {radiocertficate?.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={pecification && pecification.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      {/* <span className="errmsg">{error.radio_certificate}</span> */}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>        
          </Grid>  
          <h2 className="top_heading_pages_text">Update User Equipment</h2>
          <Grid container spacing={2} className="mt-3">
                <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                  <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                    <InputLabel id="demo-multiple-checkbox-label">Drone used</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={personName || []}
                      onChange={handleChangedroneused}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      className="check_select"
                      placeholder="hello"
                    >
                      {dronesused?.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={personName && personName.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <span className="errmsg">{error.drone}</span> */}
                  </FormControl>
                </Grid>
                <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                  <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                    <InputLabel id="demo-multiple-checkbox-label">Camera Specification</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={cameraspecification || []}
                      onChange={handleChanged10}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      className="check_select"
                      placeholder="hello"
                    >
                      {cameraSpecification?.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={cameraspecification && cameraspecification.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <span className="errmsg">{error.camera_specification}</span> */}
                  </FormControl>
                </Grid>
                <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                    <span className="top_text">Payload</span>
                    <Select
                      value={payload}
                      onChange={handleChangespayload}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      className="normal_select"
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={'Level 0 (Less Then 1 mph 0 m/s)'}>Level 0 (Less Then 1 mph 0 m/s)</MenuItem>
                      <MenuItem value={'Level 1 (1 - 3 mph; 0.5-1.5 m/s)'}>Level 1 (1 - 3 mph; 0.5-1.5 m/s)</MenuItem>
                      <MenuItem value={'Level 2 (4 - 7 mph; 2-3 m/s)'}>Level 2 (4 - 7 mph; 2-3 m/s)</MenuItem>
                      <MenuItem value={'Level 4 (8 - 12 mph; 3.5-5 m/s)'}>Level 4 (8 - 12 mph; 3.5-5 m/s)</MenuItem>
                      <MenuItem value={'Level 5 (19 - 24 mph; 8.5-10.5 m/s)'}>Level 5 (19 - 24 mph; 8.5-10.5 m/s)</MenuItem>
                    </Select>
                    {/* <span className="errmsg">{error.payload}</span> */}
                  </FormControl>
                </Grid>
              </Grid> 
              <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <Button className="global_dashbtn" onClick={handleform}>
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>

      
      </Grid>
    </div>
  );
}
