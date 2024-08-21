import React, { useEffect, useState } from 'react'
import { Grid, FormControl, Button } from '@mui/material';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { Col, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Textarea from '@mui/material/TextareaAutosize';
import PlacesAutocomplete from 'react-places-autocomplete';
import { State } from 'country-state-city';
import { axiosInstance } from 'Utility/Api';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AdminLoading, toastifyError, toastifySuccess } from 'Utility/Utility';

const BussinessUpdate = ({ job_id, get_data_type }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [stateList, setStateList] = useState([]);
    const [businessData, setBusinessData] = useState({})
    const [imagePreviews, setImagePreviews] = useState([]);
    const [logoPreview, setLogoPreview] = useState();
    const [value, setValue] = useState({
        id: '',
        job_title: '',
        company_name: '',
        location: '',
        job_type: '',
        description: '',
        state: '',
        notify_by: '',
        logo: '',
        attachment: []
    });

    useEffect(() => {
        if (job_id) {
            getBusinessData(job_id)
        }
        if (businessData?._id) {
            setValue({
                ...value,
                id: businessData?._id,
                job_title: businessData?.job_title,
                company_name: businessData?.company_name,
                location: businessData?.location,
                job_type: businessData?.job_type,
                description: businessData?.description,
                state: businessData?.state,
                notify_by: businessData?.notify_by,
                logo: businessData?.logo,
                attachment: businessData?.images,
            })
            setLogoPreview(businessData?.logo)
            setImagePreviews(businessData?.images)
        }
    }, [job_id, businessData?._id])
    const getBusinessData = async (id) => {
        setLoading(true)
        const params = { id: id, get_data_type }
        const res = await axiosInstance.post('/user/get_business_details', params)
        if (res?.data?.status == 200) {
            setBusinessData(res?.data?.getdata);
            setLoading(false)
        } else {
            setBusinessData({})
            setLoading(false)
        }
    }

    const [error, setError] = useState({
        job_title: '',
        company_name: '',
        location: '',
        job_type: '',
        description: '',
    });
    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    const removeFileItem = (indexToRemove) => {
        setImagePreviews((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
        setValue((prevItems) => {
            const updatedItems = prevItems.attachment.filter((_, index) => index !== indexToRemove);
            return { ...prevItems, attachment: updatedItems };
        });
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
        if (value.description.trim() == '') {
            setError((prevValues) => {
                return { ...prevValues, ['description']: 'Required *' };
            });
        } else {
            setError((prevValues) => {
                return { ...prevValues, ['description']: true };
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

    const { job_title, location, description, company_name, job_type } = error;
    useEffect(() => {
        if (
            job_title === true &&
            location === true &&
            description === true &&
            company_name === true &&
            job_type === true
        ) {
            handleUpdate();
        }
    }, [addUpdateApiCallCount, job_title, location, description, company_name, job_type]);

    const handleUpdate = async () => {
        setSubmitLoading(true);
        const res = await axiosInstance.post('admin/updateBusinessEmployement', value)
        if (res?.data?.status == 200) {
            toastifySuccess("Updated successfully")
            setSubmitLoading(false)
        } else {
            toastifyError("Something went wrong")
            setSubmitLoading(false)
        }
    };
    const searchOptions = {
        componentRestrictions: { country: 'AU' }
    };

    return (
        <>
            <Grid container spacing={3} className='mt-3'>
                <Grid item xs={12} lg={12} spacing={3}>

                    {
                        loading ? (
                            <AdminLoading />
                        ) : (
                            <Grid className="pages_global_background p-4" sx={{ my: 1 }}>

                                <Col md="6" className="mb-4">
                                    <h4>Update Business employement portal</h4>
                                </Col>

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
                                    <Col md="6" className="mb-2">
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
                                                        <input {...getInputProps({ placeholder: 'Type address' })} />
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

                                    <Col md="6" className="mb-2">
                                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                            <span className="top_text">Job Type</span>
                                            <Select
                                                className="normal_select"
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

                                    <Col md="6" className="">
                                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                            <span className="top_text">
                                                Search by <span className="requird_txt">*</span>
                                            </span>
                                            <Select
                                                className="normal_select"
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

                                    <Col md="6" className="">
                                        <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                                            <span className="top_text">
                                                Choose State <span className="requird_txt">*</span>
                                            </span>
                                            <Select
                                                className="normal_select"
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
                                    </Col>

                                    <Col md="6" className="mb-2">
                                        <div className="preview_upload">

                                            <div className="preview_upload_inner">
                                                {logoPreview && <> <img src={logoPreview} alt="drone" style={{ width: '100%' }} />
                                                    <button className="text-danger" onClick={() => { setValue({ ...value, 'logo': '' }); setLogoPreview(null) }}>
                                                        <DeleteOutlineIcon />
                                                    </button>
                                                </>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Grid item xs={12} className='text-end mx-2'>
                                    <Button className="global_dashbtn mx-2" onClick={() => navigate('/admin/postedjob')}>
                                        Cancel
                                    </Button>
                                    {submitLoading ? (
                                        <Button className="global_dashbtn">
                                            <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                        </Button>
                                    ) : (
                                        <Button className="global_dashbtn" onClick={validateFun}>
                                            Update
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        )
                    }

                </Grid>
            </Grid>
        </>
    )
}

export default BussinessUpdate