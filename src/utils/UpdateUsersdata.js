// import * as React from 'react';
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "../../node_modules/@mui/material/index";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Textarea from "@mui/material/TextareaAutosize";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Accordion from 'react-bootstrap/Accordion';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import config from "config";
import BackupIcon from "@mui/icons-material/Backup";
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  LoadingBTN,
  defaultUserIMG,
  getCurrentDate,
  toastifyError,
  toastifySuccess,
} from "Utility/Utility";
import {
  Link,
  useLocation,
  useNavigate,
} from "../../node_modules/react-router-dom/dist/index";
import { Country, State } from 'country-state-city';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Porfolio from "../pilot/Portfolio/Porfolio";
import { cameraSpecification, droneUsed, licenceList } from "Utility/ArrayData";
// import PaymentBTN from "../pilot/Paypal/PaymentBTN";
// import Loading from "Utility/Loading";
// uploader

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const names = ["Film / Tv /Documents", "Promotional Events", "Property/ Real Estate", "Survey / Inspection"];
// const addionalFeatures = [
//   "Group Photography",
//   "360* Photography",
//   "Group Videography",
//   "Editing",
//   "Branding",
// ];
const weightLimitData = [
  'Very Small(2Kg)',
  'Small (2-25Kg)',
  'Medium (25-150Kg)',
  'Large (150Kg)',
  'Multi-rotor aircraft'
];
// const dronesused = ["Djl Mini 3pro", "Matrice 210RTX"];

// const cameraSpecification = ["4K", "60Fps"];

const steps = [
  "Pilot Info",
  "Job Request",
  "Qualification",
  "Equipment",
  // "Portfolio",
];
// const libraries = ['drawing'];
export default function UpdateUsersdata() {
  const navigate = useNavigate();
  const location = useLocation();
  const insialtab = location.state;
  const JwtToken = location.state.token;
  // console.log(JwtToken,"JwtToken")
  const [userDatas, setUserdata] = React.useState({});
  const [userQualification, setUserQualification] = React.useState({});
  const [equipment, setEquipment] = React.useState({});
  const [loading, setLoading] = useState(true);

  const [personName, setPersonName] = React.useState([]);
  // const [personNames, setPersonNames] = React.useState([]);
  const [cameraspecification, setCameraspecification] = React.useState([]);
  const [categorylist, setCategorylist] = useState([]);
  // const [category, setCategory] = React.useState([]);
  // const [extraAreaCat, setExtraAreaCat] = React.useState([]);

  const [radius, setRadius] = React.useState(0);
  const [weightLimit, setWeightLimit] = useState([]);
  const [textData, setTextData] = useState({})

  const [website_link, setWebsite_link] = useState("");
  // const [countryName, setCountry] = React.useState('');
  const [qualificationAttachement, setQualificationAttachement] =
    React.useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [previewQualification, setPreviewQualification] = useState([])


  const [valuees, setValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    state: '',
    street: "",
    Suburb: "",
    pincode: "",
    short_description: "",
    location: "",
    location1: "",
    multiCategory: [],
    instagram_link: "",
    facebook_link: "",
    twitter_Link: "",
    weight_limit: "",
    flight_time_limit: "",
    qualification_expiry: "",

    extra_area_category: "",
  });

  const [licence, setlicence] = React.useState("");
  const [optime, setOptime] = React.useState("");
  const [skill, setSkill] = React.useState("");
  const [stateList, setStateList] = useState([]);
  const [category, setCategory] = React.useState([]);

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };
  const inputRef = useRef();
  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        if (validateFile(file)) {
          setPreviewQualification((prevFiles) => [...prevFiles, file?.name]);
          // const reader = new FileReader();
          // reader.readAsDataURL(file);
          // reader.onloadend = () => {
          //   const base64Data = reader.result;
          //   setQualificationAttachement((prevFiles) => [...prevFiles, base64Data]);
          // };
          setQualificationAttachement((prevFiles) => [...prevFiles, file]);

        }
      });
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError1('Invalid file type. Please select a valid image (JPG,JPEG, PNG) or document (PDF).');
      return false;
    }

    if (file.size > maxSize) {
      setError1('File size exceeds 10MB limit. Please select a smaller file.');
      return false;
    }

    setError1('');
    return true;
  };


  const onChooseFile = () => {
    inputRef.current.click();
  };
  const [removedMedia, setRemovedMedia] = useState([])
  const removeFile = (index, file) => {
    setQualificationAttachement((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewQualification((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setRemovedMedia((prevFiles) => [...prevFiles, file]);
  };

  useEffect(() => {
    getcategoryData();
    userData();
    someAsyncFunction();
    getStateFun()
    getText()

  }, []);

  const getStateFun = () => {
    const stateData = State?.getStatesOfCountry('AU').map((state) => ({
      value: state.name,
      displayValue: state.name
    }));
    setStateList(stateData);
  };

  useEffect(() => {
    if (userDatas) {
      setValues({
        ...valuees,
        first_name: userDatas?.first_name,
        last_name: userDatas?.last_name,
        phone: userDatas?.phone,
        email: userDatas?.email,
        company: userDatas?.company,
        street: userDatas?.street,
        Suburb: userDatas?.Suburb,
        pincode: userDatas?.pincode,
        state: userDatas?.state,
        short_description: userDatas?.short_description,
        location1: userDatas?.location,
        location: userDatas.job_request?.location,
        instagram_link: userDatas?.instagram_link,
        facebook_link: userDatas?.facebook_link,
        twitter_Link: userDatas?.twitter_link,
        qualification_expiry: userQualification?.qualification_expiry,
        weight_limit: userQualification?.weight_limit,
        flight_time_limit: userQualification?.flight_time_limit,
        extra_area_category: userDatas?.extra_area_category,
        addition_services: userQualification?.addition_services,
        radio_certificate: userQualification?.radio_certificate,
      });
      // setCountry(userDatas?.country);
      setWebsite_link(userDatas?.website_link);
      // setUploadedImages(userDatas?.image);
      setImagePreview(userDatas?.image == '' ? defaultUserIMG : userDatas?.image);

      setCategory(userDatas.extra_area_category);

      setRadius(userDatas.radius);
      setQualificationAttachement(userQualification?.attachment);
      setPreviewQualification(userQualification?.attachment)
      setlicence(userQualification?.lisencs_type);
      setOptime(userQualification?.pro_drone_oprator_longtime);
      setSkill(userQualification?.rate_skill_level);
      setWindspeed(userQualification?.maximum_wind_speed);
      setPersonName(equipment?.drone);
      setCameraspecification(equipment?.camera_specification);
      setWeightLimit(userQualification?.weight_limit);
    } else {
      setValues({
        ...valuees,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        company: "",
        street: "",
        Suburb: "",
        pincode: "",
        short_description: "",
        location: "",
        facebook_link: "",
        twitter_Link: "",
        specilization: "",
      });
    }
  }, [userDatas]);

  const getText = async () => {
    try {
      const res = await axiosInstance.post('/admin/getExtraPricedata')
      if (res?.data?.status == 200) {
        setTextData(res?.data?.getdatas[0])
      } else {
        setTextData({})
      }
    } catch (error) {
      setTextData({})

    }
  }

  const handlechangeing = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };
  const handlechangeings = (e) => {
    const { name, value } = e.target;

    if (name == "qualification_expiry") {
      const formattedDate = value.split('-').reverse().join('-');
      setValues(prevValues => ({
        ...prevValues,
        qualification_expiry: formattedDate
      }));
    } else if (name == "addition_services") {
      setValues((prevValues) => ({
        ...prevValues,
        'addition_services': e.target.checked
      }));
    }
    else if (name == "radio_certificate") {
      setValues((prevValues) => ({
        ...prevValues,
        'radio_certificate': e.target.checked
      }));
    } else {
      setValues({ ...valuees, [name]: value });
    }
  };
  const userData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/user/getPilotProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtToken}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "get data successfully") {
            if (data?.getacceptedjob) {
              setValues({
                ...valuees,
                multiCategory: data?.getacceptedjob[0]?.specilization,
              });
              setUserdata(data?.getacceptedjob[0]);
              setUserQualification(data?.qualification[0]);
              setEquipment(data?.getacceptedjob[0]?.equipment);
              setCategory(data?.getacceptedjob[0]?.specilization);
              setLoading(false)
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeWeightLimit = (event) => {
    const { target: { value } } = event;
    setWeightLimit(typeof value === 'string' ? value.split(',') : value);
  };

  const getcategoryData = async () => {
    try {
      fetch(`${config.url}/admin/getAllJobCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtToken}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "get category data successfully") {
            setCategorylist(data.getCategory);
          }
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;
    setValues({
      ...valuees,
      multiCategory: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleChangedroneused = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChanged10 = (event) => {
    const {
      target: { value },
    } = event;
    setCameraspecification(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // -------------------------Skilllevel--------------------------
  const [windspeed, setWindspeed] = React.useState("");

  const handleChangeswindspeed = (event) => {
    setWindspeed(event.target.value);
  };

  // -------------------------Skilllevel--------------------------

  const handleChangeskill = (event) => {
    setSkill(event.target.value);
  };

  // -------------------------operatortime--------------------------

  const handleChangeop = (event) => {
    setOptime(event.target.value);
  };

  // -------------------------selectlicence--------------------------

  const handleChangelicence = (event) => {
    setlicence(event.target.value);
  };

  const mapContainerStyle = {
    width: "100%",
    height: "45vh",
  };

  const defaultCenter = {
    lat: 25.32216,
    lng: 74.60369,
  };
  const [locationMarker, setLocationMarker] = useState(defaultCenter);
  const getMarker = async () => {
    const results = await geocodeByAddress(valuees.location1);
    const latLng = await getLatLng(results[0]);
    return latLng;
  };
  const someAsyncFunction = async () => {
    try {
      const latLng = await getMarker();
      console.log("Latitude and Longitude:", latLng);
      setLocationMarker({ lat: latLng.lat, lng: latLng.lng });
    } catch (error) {
      console.error("Error getting marker:", error);
    }
  };
  const handleLocationSelect = async (value) => {
    try {
      setValues((prevValue) => ({
        ...prevValue,
        location1: value,
      }));
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      setLocationMarker({ lat: latLng.lat, lng: latLng.lng });
    } catch (error) {
      console.error("Error selecting address", error);
    }
  };
  const handleLocationChange = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      location1: value,
    }));
  };
  // ---------------selectstate-------------------

  // ---------------selectcountry-------------------
  // const tabLocation = useLocation();
  // Access the query parameter 'tab' from the location object
  //   const tabLocation = useLocation();
  //   const tab = tabLocation.state ? tabLocation.state.data : 0;
  const [activeStep, setActiveStep] = React.useState(insialtab.tab);
  const [skipped, setSkipped] = React.useState(new Set());
  //   console.log("insialtabinsialtab",insialtab)

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleImageChange11 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValues({ ...valuees, image: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    company: "",
    short_description: "",
    instagram_link: "",
    facebook_link: "",
    twitter_Link: "",

    location1: "",
    location: "",
    category: "",
    radius: "",
    extra_area_category: "",

    lisencs_type: "",
    qualification_expiry: "",
    pro_drone_oprator_longtime: "",
    rate_skill_level: "",
    weight_limit: "",
    flight_time_limit: "",
    maximum_wind_speed: "",
    radio_certificate: "",

    drone: "",
    camera_specification: "",
  });

  const checkValidation = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    const { first_name, location1, last_name, company, state, Suburb, phone, flight_time_limit } = valuees;
    const australiaPhoneNumberRegex = /^(?:\+61|0)(?:2|3|4|7|8)(?:\d{8}|\d{9})$/;

    if (activeStep == 0) {
      if (first_name.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['first_name']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['first_name']: true };
        });
      }

      if (last_name.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['last_name']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['last_name']: true };
        });
      }
      if (company.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['company']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['company']: true };
        });
      }

      if (Suburb.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['suburb']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['suburb']: true };
        });
      }
      // if (multiCategory.length == 0) {
      //   setError((prevValues) => {
      //     return { ...prevValues, ['multiCategory']: 'Required *' };
      //   });
      // } else {
      //   setError((prevValues) => {
      //     return { ...prevValues, ['multiCategory']: true };
      //   });
      // }
      if (state.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['state']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['state']: true };
        });
      }



      if (location1.trim() == '') {
        setError((prevValues) => {
          return { ...prevValues, ['location1']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['location1']: true };
        });
      }

      // Phone No Validation
      if (phone == '') {
        setError((prevValues) => {
          return { ...prevValues, ['phone']: 'Required *' };
        });
      } else if (!australiaPhoneNumberRegex.test(phone)) {
        setError((prevValues) => {
          return { ...prevValues, ['phone']: 'Please Enter Valid Mobile No !!' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['phone']: true };
        });
      }
    }

    if (activeStep == 2) {
      if (licence == '') {
        setError((prevValues) => {
          return { ...prevValues, ['lisencs_type']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['lisencs_type']: true };
        });
      }
      if (optime == '') {
        setError((prevValues) => {
          return { ...prevValues, ['pro_drone_oprator_longtime']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['pro_drone_oprator_longtime']: true };
        });
      }

      if (weightLimit.length == 0) {
        setError((prevValues) => {
          return { ...prevValues, ['weight_limit']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['weight_limit']: true };
        });
      }


      if (flight_time_limit == '') {
        setError((prevValues) => {
          return { ...prevValues, ['flight_time_limit']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['flight_time_limit']: true };
        });
      }
      // if (qualification_expiry == '') {
      //   setError((prevValues) => {
      //     return { ...prevValues, ['qualification_expiry']: 'required *' };
      //   });
      // } else {
      //   setError((prevValues) => {
      //     return { ...prevValues, ['qualification_expiry']: true };
      //   });
      // }
      if (windspeed == '') {
        setError((prevValues) => {
          return { ...prevValues, ['maximum_wind_speed']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['maximum_wind_speed']: true };
        });
      }
      if (skill == '') {
        setError((prevValues) => {
          return { ...prevValues, ['rate_skill_level']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['rate_skill_level']: true };
        });
      }
      if (weightLimit.length == 0) {
        setError((prevValues) => {
          return { ...prevValues, ['radio_certificate']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['radio_certificate']: true };
        });
      }
    }

    if (activeStep == 3) {
      if (personName.length == 0) {
        setError((prevValues) => {
          return { ...prevValues, ['drone']: 'required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['drone']: true };
        });
      }
    }

    if (activeStep == 4) {
      navigate('/user/dashboard/default');
    }
  };
  const {
    first_name,
    last_name,
    phone,
    qualification_expiry,
    rate_skill_level,
    weight_limit,
    flight_time_limit,
    maximum_wind_speed,
  } = error;
  useEffect(() => {
    if (activeStep === 0) {
      if (first_name === true && last_name === true && phone === true) {
        handleNext();
      }
    }
    if (activeStep === 1) {
      handleNext();
    }
    if (activeStep === 2) {
      if (
        error.lisencs_type === true &&
        error.pro_drone_oprator_longtime === true &&
        rate_skill_level === true &&
        weight_limit === true &&
        flight_time_limit === true &&
        maximum_wind_speed === true
      ) {
        handleNext();
      }
    }
    if (activeStep === 3) {
      if (error.drone === true) {
        handleNext();
      }
    }
  }, [
    addUpdateApiCallCount,
    first_name,
    last_name,
    phone,
    qualification_expiry,
  ]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleNext = async () => {
    someAsyncFunction();
    setSubmitLoading(true);

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0) {
      const updatedUser = {
        first_name: valuees.first_name,
        last_name: valuees.last_name,
        phone: valuees.phone,
        email: valuees.email,
        company: valuees.company,

        country: 'Australia',
        state: valuees.state,
        suburb: valuees.Suburb,
        location1: valuees.location1,
        specilization: valuees.multiCategory,

        website_link: website_link,
        twitter_link: valuees.twitter_Link,
        tiktok_link: valuees.tiktok_link,
        facebook_link: valuees.facebook_link,
        instagram_link: valuees.instagram_link,
        short_description: valuees.short_description,
        image: valuees.image ? valuees.image : ''
      };

      await fetch(`${config.url}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            toastifySuccess("User Profile Updated Successfully");
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setActiveStep(0);
            userData();
            setSubmitLoading(false);
          } else {
            toastifyError("Something Wen't Wrong !!");
            setActiveStep(0);
            setSubmitLoading(false);
          }
        });
    }

    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setActiveStep(1);
      setSubmitLoading(false);
    }
    if (activeStep === 2) {
      try {
        const fd = new FormData();
        fd.append('userId', userDatas?._id);
        qualificationAttachement.forEach((file) => {
          fd.append("media", file);
        });
        removedMedia.forEach((file) => {
          fd.append("removedMedia", file);
        });
        const res = await fetch(`${config.url}/user/updateMedia`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.jwt}`,
          },
          body: fd,
        });
        const data = await res.json();
        if (res.ok && data?.status === 200) {
          console.log("Success:", data);
        } else {
          console.error("Server error:", data);
        }
      } catch (err) {
        console.error("Network / parsing error:", err);
      }
      const updatedUser = {
        lisencs_type: licence,
        qualification_expiry: valuees.qualification_expiry,
        pro_drone_oprator_longtime: optime,

        rate_skill_level: skill,
        weight_limit: valuees.weight_limit,
        flight_time_limit: valuees.flight_time_limit,
        maximum_wind_speed: windspeed,
        addition_services: valuees.addition_services,
        radio_certificate: valuees.radio_certificate,
        // attachment: qualificationAttachement,
      };

      try {
        await fetch(`${config.url}/user/addUserQualification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JwtToken}`,
          },
          body: JSON.stringify(updatedUser),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.status === 200) {
              toastifySuccess("User Qualification Updated Successfully");
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
              setActiveStep(2);
              setSubmitLoading(false);
            } else {
              toastifyError("User Qualification Not Updated");
              setActiveStep(2);
              setSubmitLoading(false);
            }
          });
      } catch (error) {
        toastifyError("Something went wrong, try again letter");
        setActiveStep(2);
        setSubmitLoading(false);
      }

    }
    if (activeStep === 3) {
      const updatedUser = {
        equipment: {
          drone: personName,
          camera_specification: cameraspecification,
        },
      };

      await fetch(`${config.url}/user/addEquipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify(updatedUser),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            // toastifySuccess("User Equipment Updated successfully");
            navigate("/admin/utils/usermangement");
            setSubmitLoading(false);
            // setActiveStep(3);
          } else {
            toastifyError("User Equipment Not Updated");
            setActiveStep(3);
            setSubmitLoading(false);
          }
        });
    }
    if (activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setActiveStep(4);
      setSubmitLoading(false);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // const licenceListFilter = () => {
  //   if (userDatas.subscription_type == "free") {
  //     const data = licenceList.filter((item) => {
  //       return userDatas.subscription_type == "free" && item.value == "Nothing yet"
  //     })
  //     return data
  //   } else {
  //     return licenceList
  //   }
  // }
  const handleSkip = () => {
    someAsyncFunction();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const [isCategoryChecked, setIsCategoryChecked] = useState(false);
  useEffect(() => {
    if (valuees.multiCategory?.includes("Business Employment Portal")) {
      setIsCategoryChecked(true);
    } else {
      setIsCategoryChecked(false);
    }
  }, [valuees.multiCategory]);
  const handleBusinessEmpPortal = (e) => {
    const categoryName = "Business Employment Portal";
    setValues(prevState => ({
      ...prevState,
      multiCategory: e.target.checked
        ? [...prevState.multiCategory, categoryName]
        : prevState.multiCategory.filter(item => item !== categoryName)
    }));
  }

  const [error1, setError1] = useState('');



  // const onChooseFile = () => {
  //   inputRef.current.click();
  // };


  return (
    <Box sx={{ width: "100%" }}>

      {loading ? (
        <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box>
            <CircularProgress size={60} />
          </Box>
        </div>
      ) : (<>
        <Stepper
          activeStep={activeStep}
          className=" top_bar_profile top_box mt-0"
        >
          {steps.map((label) => (
            <Step className="circle_pro" key={label}>
              <StepLabel className="text_name">{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 4 ? (
          <>
            <Typography className=" " sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished{" "}
              <Link to={"/admin/dashboard/default"}>Back To Dashboard</Link>
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "row", pt: 2 }}
              className=""
            >
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <React.Fragment>
            <Typography
              className="active_steps_data inner_admin"
              sx={{ mt: 2, mb: 1 }}
            >
              {activeStep == 0 ? (
                <Grid container spacing={2}>
                  <Grid xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div className="profile">
                      <div className="pilot_profile_circle  profile">
                        <div className="upload">
                          <img src={imagePreview} style={{ width: '170px', height: '170px', objectFit: 'contain' }} alt="sdf" />
                          <div className="round">
                            {' '}
                            <input type="file" onChange={handleImageChange11} />
                            <ModeEditIcon />
                          </div>
                        </div>
                      </div>

                      <div className='mb-4' style={{ backgroundColor: '#e8f7ff', padding: '10px', borderRadius: '5px' }}>
                        <p className="mb-0">
                          <b>  Save and Continue</b> to save your progress or click <b>Next</b> to finish completing your profile
                        </p>
                      </div>
                    </div>

                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder="Enter your First Name"
                        name="first_name"
                        value={valuees.first_name}
                        onChange={handlechangeing}
                      />
                      <label htmlFor="firstName">First Name</label> <span className="bar"></span>
                      <span className="errmsg">{error.first_name}</span>
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder="Enter your Last Name"
                        name="last_name"
                        value={valuees.last_name}
                        onChange={handlechangeing}
                      />
                      <label htmlFor="firstName">Last Name</label> <span className="bar"></span>
                      <span className="errmsg">{error.last_name}</span>
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial mb-0"
                        type="text"
                        placeholder="Company Name"
                        name="company"
                        value={valuees.company}
                        onChange={handlechangeing}
                      />
                      <label htmlFor="firstName">Company (if applicable)</label> <span className="bar"></span>
                      {/* <span className="errmsg">{error.company}</span> */}

                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group error ">
                      {/* <span className="">Email (All inquiries are sent to this email)*</span> */}
                      <input
                        className="inputMaterial readonly"
                        type="text"
                        placeholder="Enter your Email"
                        label="skdjks"
                        name="email"
                        value={valuees.email}
                      // onChange={handlechangeing}
                      // readOnly
                      />
                      <label htmlFor="firstName">Email (All inquiries are sent to this email)*</label> <span className="bar"></span>
                      <span className="errmsg">{error.email}</span>
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={valuees.phone}
                        onChange={handlechangeing}
                        maxLength={11}
                      />
                      <label htmlFor="firstName">Mobile (won’t be displayed)*</label> <span className="bar"></span>
                      <span className="errmsg">{error.phone}</span>
                    </div>
                  </Grid>

                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="state_select normal_select">
                      <span className="top_text">Choose Country </span>
                      <Select
                        className="normal_select"
                        value={'Australia'}
                        // onChange={handleChange2}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        disabled
                      >
                        <MenuItem value="">Select Country</MenuItem>
                        {Country?.getAllCountries()?.map((item, i) => (
                          <MenuItem value={item} key={i}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                      <span className="top_text">State</span>
                      <Select
                        value={valuees.state}
                        onChange={handlechangeing}
                        displayEmpty
                        name="state"

                        inputProps={{ 'aria-label': 'Without label' }}
                        className=" mb-0 manage_space normal_select"
                      >
                        <MenuItem value="">Choose State</MenuItem>
                        {stateList?.map((item, i) => (

                          <MenuItem value={item.value} key={i}>
                            {item.displayValue}
                          </MenuItem>
                        ))}
                      </Select>

                      <span className="errmsg">{error.state}</span>
                    </FormControl>
                  </Grid>

                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="location_search group  error">
                      <PlacesAutocomplete value={valuees.location1} onChange={handleLocationChange}
                        searchOptions={searchOptions}
                        onSelect={handleLocationSelect}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div className="location_input">
                            <span className="top_text">Address / City </span>
                            <input className='mb-0' {...getInputProps({ placeholder: 'Type address' })} />
                            <div className="autocomplete-dropdown-container">
                              {loading ? <div>Loading...</div> : null}
                              {suggestions?.map((suggestion) => {
                                const style = {
                                  backgroundColor: suggestion.active ? 'whitesmoke' : '#fff',
                                  padding: '10px',
                                  'font-size': '16px'
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
                      <span className="errmsg">{error.location1}</span>
                    </div>
                  </Grid>

                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <div className="group  error">
                      <input
                        className="inputMaterial"
                        type="text"
                        placeholder="Suburb"
                        name="Suburb"
                        value={valuees.Suburb}
                        onChange={handlechangeing}
                      />
                      <label htmlFor="firstName">Suburb</label> <span className="bar"></span>
                      <span className="errmsg">{error.suburb}</span>
                    </div>
                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: 300 }} className="manage_space mb-0 check_select_outer">
                      <InputLabel id="demo-multiple-checkbox-label">Choose job categories you are interested in receiving</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={valuees.multiCategory || []}
                        onChange={handleChange3}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        className="check_select mb-0"
                      >
                        {categorylist?.filter(name => name.category_name !== "Business Employment Portal").map((name) => (
                          <MenuItem key={name} value={name.category_name}>
                            <Checkbox checked={valuees.multiCategory?.indexOf(name.category_name) > -1} />
                            <ListItemText primary={name.category_name} />
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>
                    <span className="errmsg">{error.multiCategory}</span>

                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <FormControl className="check_select_outer">
                      <FormControlLabel
                        control={<Checkbox checked={isCategoryChecked} onChange={handleBusinessEmpPortal} />}
                        label={
                          <Typography style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', color: '#000' }}>
                            Business Employment Portal
                          </Typography>
                        }
                      />
                      {textData?.empOpportunities}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={12} className="pt-0">
                    <div className="dec_text">
                      <h2 className="heding_globe">
                        About me{' '}
                        <span style={{ fontSize: '13px', fontWeight: '300' }}>
                          (Please write up to 300 words to increase your visibility)
                        </span>
                      </h2>
                      <Textarea
                        placeholder="short description"
                        name="short_description"
                        value={valuees.short_description}
                        onChange={handlechangeing}
                        maxLength={1200}
                      />
                    </div>
                  </Grid>

                  <Grid container spacing={2} className="pd">
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <h2 className="heding_globe">Social Links</h2>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Link"
                          value={website_link}
                          onChange={(e) => {
                            setWebsite_link(e.target.value);
                          }}
                        />{' '}
                        <label htmlFor="firstName">Website</label>
                        <span className="bar"></span>
                      </div>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Link"
                          name="instagram_link"
                          value={valuees.instagram_link}
                          onChange={handlechangeing}
                        />{' '}
                        <label htmlFor="firstName">Instagram</label>
                        <span className="bar"></span>
                      </div>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Link"
                          name="facebook_link"
                          value={valuees.facebook_link}
                          onChange={handlechangeing}
                        />{' '}
                        <label htmlFor="facebook_link">Facebook</label>
                        <span className="bar"></span>
                      </div>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Link"
                          name="tiktok_link"
                          value={valuees.tiktok_link}
                          onChange={handlechangeing}
                        />
                        <label htmlFor="firstName">Tiktok</label>
                        <span className="bar"></span>
                      </div>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Link"
                          name="twitter_Link"
                          value={valuees.twitter_Link}
                          onChange={handlechangeing}
                        />
                        <label htmlFor="firstName">Enquieries email</label>
                        <span className="bar"></span>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ) : activeStep == 1 ? (
                <Grid container spacing={2}>
                  <Grid item xl={5} lg={5} md={5} sm={12}>

                    <Grid container spacing={2}>
                      <Grid className="mt-2" item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="group  error">
                          <input className="inputMaterial w-100" type="text" placeholder="Link" value={valuees.location1} />
                          <span className="bar"></span>
                          <label htmlFor="first">Your Location </label>
                        </div>
                      </Grid>

                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className="extra_space group  error">
                          <label htmlFor="first">Current Plan Radius</label>
                          <input className="inputMaterial" type="text" placeholder="Link" value={radius + "Km"} disabled />
                          {/* <span className="bar"></span> */}
                        </div>
                      </Grid>

                      <Grid className="dropdown_design pt-0" item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Job categories you are interested in</Accordion.Header>
                            <Accordion.Body>
                              <ul className='m-0'>
                                {valuees?.multiCategory?.length > 0 ?
                                  valuees?.multiCategory?.map((item, i) => <li key={i}>{item}</li>)
                                  :
                                  <> No Extra catogories purchased yet</>
                                }
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>Extra categories purchased</Accordion.Header>
                            <Accordion.Body>
                              <ul className='m-0'>
                                {category?.length > 0 ? category?.map((item, i) => (
                                  <li key={i}>{item}</li>
                                )) : <li>You haven&apos;t purchased any extra category yet</li>}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Grid>

                      <Grid className="pt-0" item xl={12} lg={12} md={12} sm={12} xs={12}>
                        {/* <div>
                        <p>Purchase extra categories now - this unlocks all relavent matching jobs within unlimited radius from your location. Each category is ${extraCatAmount} AUD/Month </p>
                      </div>

                      <div >
                        <p className='mb-5'><span className='text-danger'><b>Note :</b></span> To buy extra categories you must have either a Silver or Gold Plan</p>
                      </div> */}
                        {/* <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">

                          <InputLabel id="demo-multiple-checkbox-label">Buy Extra Categories Now</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={extraAreaCat || []}
                            onChange={handleChangeExtraArea}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            className="check_select"
                          >
                            {categorylist
                              ?.filter((name) => !valuees?.extra_area_category?.includes(name.category_name) &&
                                name.category_name !== "Business Employment Portal")
                              .map((name) => (
                                <MenuItem key={name} value={name.category_name}>
                                  <Checkbox checked={extraAreaCat?.indexOf(name.category_name) > -1} />
                                  <ListItemText primary={name.category_name} />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>

                        <span className="errmsg">{error.extra_area_category}</span>
                      </FormControl> */}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xl={7} lg={7} md={7} sm={12}>
                    <div style={{ height: "50vh", width: "100%" }}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={locationMarker}
                      >
                        <MarkerF position={locationMarker} />
                      </GoogleMap>
                    </div>
                  </Grid>
                </Grid>
              ) : activeStep == 2 ? (
                <Grid container sx={{ justifyContent: 'center' }}>
                  <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                      <Grid item xs={10} className="mb-2">
                        <input type="file" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} multiple />

                        <button className="file-btn " onClick={onChooseFile}>
                          <span className="material-symbols-rounded">
                            <BackupIcon />
                          </span>{' '}
                          <p className="m-0 p-0">Upload Document</p>
                          <p className="m-0 p-0" style={{ fontSize: '12px' }}>
                            Image (JPG,JPEG, PNG) or document (PDF) and file size less than 10MB.
                          </p>
                        </button>
                        {error1 && <p style={{ color: 'red' }}>{error1}</p>}


                        {previewQualification?.length > 0 ? (
                          <div className="selected-files">
                            {previewQualification?.map((file, index) => (
                              <div key={index} className="select-inner d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <p className="m-0">{file.startsWith('http') ? `attachement ${index + 1}` : file}</p>
                                </div>
                                <button onClick={() => removeFile(index, file)}>
                                  <span className="material-symbols-rounded">
                                    <DeleteOutlineIcon />
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) :
                          <>
                          </>
                        }
                      </Grid>


                    </Grid>
                  </Grid>

                  <Grid item xs={12} className="mb-5">

                    <ul className='important_points '>
                      <li>
                        To be approved as a Drone Pilot on Drone Freelancer, you need to upload certificates for all the licenses you&apos;ve chosen from the &apos;Qualification&apos; menu.
                      </li>
                      <li>
                        If you have selected &apos;No Licence yet&apos;, you can still be an approved Pilot on Drone Freelancer. You need to get your Aviation Reference Number (ARN) <Link to="https://www.casa.gov.au/licences-and-certificates/aviation-reference-numbers/individual-aviation-reference-numbers#ApplyforanindividualARNthroughmyCASA" target="_blank">here</Link> and comply with CASA regulations.
                      </li>
                    </ul>
                  </Grid>

                  <Grid container spacing={2} className="form_Qualification">
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <span className="top_text">Qualification (Which License do you have)</span>
                        <Select
                          value={licence || []}
                          multiple
                          onChange={handleChangelicence}
                          displayEmpty
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                          inputProps={{ 'aria-label': 'Without label' }}
                          className="manage_space normal_select"
                        >
                          {/* {licenceListFilter()?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>{item.displayName}</MenuItem>
                      ))} */}
                          {licenceList?.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              <Checkbox checked={licence && licence?.indexOf(item.value) > -1} />
                              <ListItemText primary={item.value} />
                            </MenuItem>
                          ))}

                        </Select>
                        <span className="errmsg">{error.lisencs_type}</span>
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
                        <label htmlFor="firstName">Licence Expired (If Applicable)</label> <span className="bar"></span>
                        <span style={{ position: 'absolute', top: '10px', background: '#fff', fontSize: '17px', padding: '2px 6px' }}>
                          {valuees.qualification_expiry}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                        <span className="top_text">I&apos;ve been a pilot for</span>
                        <Select
                          value={optime}
                          onChange={handleChangeop}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          className="manage_space normal_select"
                        >
                          <MenuItem value="">Select Time</MenuItem>
                          <MenuItem value={'1'}>1 Year</MenuItem>
                          <MenuItem value={'2'}>2 Year</MenuItem>
                          <MenuItem value={'3'}>3 Year</MenuItem>
                          <MenuItem value={'4'}>4 Year</MenuItem>
                          <MenuItem value={'5'}>5 Year</MenuItem>
                          <MenuItem value={'6'}>6 Year</MenuItem>
                          <MenuItem value={'7'}>7 Year</MenuItem>
                          <MenuItem value={'8'}>8 Year</MenuItem>
                          <MenuItem value={'9'}>9 Year</MenuItem>
                          <MenuItem value={'10+'}>10+ Year</MenuItem>
                        </Select>
                        <span className="errmsg">{error.pro_drone_oprator_longtime}</span>
                      </FormControl>
                    </Grid>
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <FormControl sx={{ m: 1, minWidth: 120 }} className=" normal_select">
                        <span className="top_text">How Would you rate your skill level</span>
                        <Select
                          value={skill}
                          onChange={handleChangeskill}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          className="manage_space normal_select"
                        >
                          <MenuItem value="">Select Skill level</MenuItem>
                          <MenuItem value={'Standard'}>Standard</MenuItem>
                          <MenuItem value={'Advanced'}>Advanced</MenuItem>
                          <MenuItem value={'Expert'}>Expert</MenuItem>
                        </Select>
                        <span className="errmsg">{error.rate_skill_level}</span>
                      </FormControl>
                    </Grid>

                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                        <InputLabel id="demo-multiple-checkbox-label">Weight Limit (in kg)</InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={weightLimit || []}
                          onChange={handleChangeWeightLimit}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                          className="check_select"
                        >
                          {weightLimitData?.map((name) => (
                            <MenuItem key={name} value={name}>
                              <Checkbox checked={weightLimit && weightLimit?.indexOf(name) > -1} />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                        <span className="errmsg">{error.weight_limit}</span>

                      </FormControl>
                    </Grid>

                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                      <div className="group  error">
                        <input
                          className="inputMaterial"
                          type="text"
                          placeholder="Enter Limit"
                          name="flight_time_limit"
                          value={valuees.flight_time_limit}
                          onChange={handlechangeings}
                        />
                        <label htmlFor="firstName">Flight Time Limit (in Minutes)</label> <span className="bar"></span>
                        <span className="errmsg">{error.flight_time_limit}</span>
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
                          className="manage_space normal_select"
                        >
                          <MenuItem value="">Select wind speed</MenuItem>
                          <MenuItem value={'Level 0 (less than 1 mph; 0 m/s)'}>Level 0 (less than 1 mph; 0 m/s)</MenuItem>
                          <MenuItem value={'Level 1 (1 - 3 mph; 0.5-1.5 m/s)'}>Level 1 (1 - 3 mph; 0.5-1.5 m/s)</MenuItem>
                          <MenuItem value={'Level 2 (4 - 7 mph; 2-3 m/s)'}>Level 2 (4 - 7 mph; 2-3 m/s)</MenuItem>
                          <MenuItem value={'Level 3 (8 - 12 mph; 3.5-5 m/s)'}>Level 3 (8 - 12 mph; 3.5-5 m/s)</MenuItem>
                          <MenuItem value={'Level 4 (13 - 18 mph; 5.5-8 m/s)'}>Level 4 (13 - 18 mph; 5.5-8 m/s)</MenuItem>
                          <MenuItem value={'Level 5 (19 - 24 mph; 8.5-10.5 m/s)'}>Level 5 (19 - 24 mph; 8.5-10.5 m/s)</MenuItem>
                        </Select>
                        <span className="errmsg">{error.maximum_wind_speed}</span>
                      </FormControl>
                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <FormControl className="check_select_outer mb-0">
                        <FormControlLabel
                          control={<Checkbox checked={valuees.addition_services} />}
                          name="addition_services"
                          onChange={handlechangeings}
                          label="I have public liability insurance" />
                        <span className="errmsg mb-0">{error.addition_services}</span>
                      </FormControl>
                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className='mt-0 pt-0'>
                      <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer ">
                        <FormControlLabel
                          control={<Checkbox checked={valuees.radio_certificate} />}
                          name="radio_certificate"
                          onChange={handlechangeings}
                          label="I have a AROC (Aviation Radio Operators Certificate,) radio certificate issued by CASA." />
                        <span className="errmsg">{error.radio_certificate}</span>
                        <span>
                          <strong>Note:</strong> CASA issued radio certificates are also sometimes referred to as any one of these terms: Flight Radio Endorsement, Flight Radio Operators Licence or Aviation Radio Operators Certificate of Proficiency.
                        </span>
                      </FormControl>
                    </Grid>


                  </Grid>
                </Grid>
              ) : activeStep == 3 ? (
                <Grid container spacing={2} className="mt-3">
                  <Grid className="mb-3" item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <h5>Please select what type of drone(s) you use for your work  from the menu below</h5>
                  </Grid>
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
                        {droneUsed?.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={personName && personName?.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      <span className="errmsg">{error.drone}</span>
                    </FormControl>
                    <div className='Added_new_cat'>
                      <ul className='p-0'>
                        <span className='pb-1'>Your Drone(s) List:</span>
                        {
                          personName?.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        }
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                    <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer">
                      <InputLabel id="demo-multiple-checkbox-label">Payload</InputLabel>
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
                            <Checkbox checked={cameraspecification && cameraspecification?.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <div className="all_cat_box">
                  <Porfolio />
                </div>
              )}
            </Typography>
            <Box className="bottum_bar" sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button className="global_btn reset_btn" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button className="global_btn reset_btn" color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Next
              </Button>
              {submitLoading ? (
                <LoadingBTN />
              ) : (
                <Button className="global_btn" onClick={checkValidation}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Save & Continue'}
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}

      </>
      )}
    </Box>
  );
}
