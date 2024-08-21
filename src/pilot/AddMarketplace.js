import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
// import Textarea from '@mui/material/TextareaAutosize';
import { useNavigate, useParams } from '../../node_modules/react-router-dom/dist/index';
import { axiosInstance } from 'Utility/Api';
import { getAllLocatData, toastifyError, toastifySuccess } from 'Utility/Utility';
import PlacesAutocomplete from 'react-places-autocomplete';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FormControl from '@mui/material/FormControl';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import config from 'config';
// import { Label } from '../../node_modules/@mui/icons-material/index';
// import FreePlanModal from 'Utility/FreePlanModal';

const AddMarketplace = () => {
  const [loadingPage, setLoadingPage] = useState(false)
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const { updID } = useParams();
  const [updData, setUpdData] = useState();
  const [base64Img, setBase64Img] = useState([]);
  // const [freePlanModal, setFreePlanModal] = useState(false)

  const [value, setValue] = useState({
    title: updData?.title,
    location: '',
    description: '',
    price: 0
  });
  useEffect(() => {
    if (updID != 1) {
      getDataByID();
    }
  }, [updID]);
  useEffect(() => {
    if (updData?.title) {
      setValue({
        ...value,
        title: updData.title,
        location: updData.location,
        description: updData.description,
        price: updData.price,
      });
      setImagePreviews(updData.images)
      setBase64Img(updData.images)
    } else {
      setValue({
        ...value,
        title: '',
        location: '',
        description: '',
        price: '',
      });
    }
  }, [updData]);

  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);
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
  const handleInputChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };
  const [error, setError] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    img: ''
  });

  console.log("error",error)
  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);
    if (value.title.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['title']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['title']: true };
      });
    }
    if (imagePreviews.length == 0) {
      setError((prevValues) => {
        return { ...prevValues, ['img']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['img']: true };
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
    if (value.description.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['description']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['description']: true };
      });
    }
    if (value.price == '') {
      setError((prevValues) => {
        return { ...prevValues, ['price']: 'Required *' };
      });
    } else if (!/^[0-9]*$/.test(value.price)) {
      setError((prevValues) => {
        return { ...prevValues, ['price']: 'Enter Valid Price ' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['price']: true };
      });
    }
  };
  const { title, location, description, price, img } = error;
  useEffect(() => {
    if (title === true && location === true && description === true && price === true && img === true) {
      if (updID != 1) {
        handleUpdate();
      } else {
        handleSubmit();
      }
    }
  }, [addUpdateApiCallCount, title, location, description, price]);

  const handleSubmit = async () => {
    setLoadingPage(true)
    const filteredImagesArray = base64Img.filter((image) => image !== undefined);
    const params = { ...value, ...{ images: filteredImagesArray } };
    try {
      const res = await axiosInstance.post('/user/createProduct', params);
      if (res.status == 200) {
        toastifySuccess('Item Successfully Listed');
        setLoadingPage(false)
        navigate('/user/market-place-list');
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoadingPage(false)
      }
    } catch (error) {
      console.log(error);
      setLoadingPage(false)
      toastifyError("Something Wen't Wrong !!")
    }
  };
  const handleUpdate = async () => {
    setLoadingPage(true)
    const filteredImagesArray = base64Img.filter((image) => image !== undefined);
    const params = { ...value, ...{ images: filteredImagesArray } };
    try {
      const response = await fetch(`${config.url}/user/updateProduct/${updID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
        body: JSON.stringify(params)
      });
      const res = await response.json();
      if (res.status == 200) {
        toastifySuccess(' Item Successfully Updated ');
        navigate('/user/market-place-list');
        setLoadingPage(false)
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoadingPage(false)
      }
    } catch (error) {
      console.log(error);
      setLoadingPage(false)
      toastifyError("Something Wen't Wrong !!")
    }
  };

  const getDataByID = async () => {
    try {
      const res = await fetch(`${config.url}/user/getProductById/${updID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
      const response = await res.json()
      if (response.status == 200) {
        setUpdData(response?.getProduct);
      }
    } catch (error) {
      setUpdData()
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setValue(prevValue => ({
      ...prevValue,
      description: data,
    }));
  };
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', ' image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!allowedTypes.includes(file.type)) {
      setError((prevValues) => {
        return { ...prevValues, ['img']: 'Invalid file type. Please select a valid image (JPG, JPEG, PNG).' };
      });
      return false;
    }
    if (file.size > maxSize) {
      setError((prevValues) => {
        return { ...prevValues, ['img']: 'File size exceeds 2MB limit. Please select a smaller file.' };
      });
      return false;
    }
    setError((prevValues) => {
      return { ...prevValues, ['img']: true };
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
          imgData.push(e.target.result?.split(',')[1]);
          if (previews.length === files.length) {
            setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
            setBase64Img(prevImgData => [...prevImgData, ...imgData]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const searchOptions = {
    componentRestrictions: { country: 'AU' }
  };

  const removeFileItem = (indexToRemove) => {
    setImagePreviews((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    setBase64Img((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 3.25 }}>
          <Typography variant="h5" className="global_top_head">
            Add Market Place
          </Typography>
        </Grid>

        <Grid className="pt-4" container spacing={2}>
          <Grid item xl={12} lg={12} md={12}>
            <div className="product_upload_img top_box">
              <Grid container sx={{ justifyContent: 'center' }}>
                <Grid xl={6} lg={6} md={6} xs={12}>
                  <FormControl fullWidth>
                    <div className="file-uploader">
                      <label htmlFor="iamgesID" className="global_file_upload_deisgn">
                        <InsertPhotoIcon />
                        Upload Document

                        <p className='m-0'>Image (JPG, JPEG, PNG) or Document (PDF).</p>
                        <input type="file" id="iamgesID" multiple onChange={handleImageChange} className='d-none' />
                      </label>
                    </div>
                  </FormControl>
                  <div className="market_place preview_upload">
                    {imagePreviews.map((preview, index) => (
                      <>
                      <div className='preview_upload_inner'>
                      <img key={index} src={preview} alt={`Preview ${index}`} />
                        <button className='text-danger' onClick={() => removeFileItem(index)}>
                      <DeleteOutlineIcon/>
                        </button>
                      </div>
                      </>
                    ))}
                  </div>
                  {error.img && <p style={{ color: 'red' }}>{error.img}</p>}
                </Grid>
              </Grid>
              <Grid container spacing={2} className="mt-5">
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      type="text"
                      name="title"
                      onChange={handleInputChange}
                      placeholder="Enter your Product Title"
                      value={value.title}
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">Title <span className='dot_alert'>*</span></label>
                    <span className="errmsg">{error.title}</span>
                  </div>
                </Grid>

                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className="location_search group error">
                    <PlacesAutocomplete
                      value={value.location}
                      name="location"
                      onChange={handleLocationChange}
                      onSelect={handleLocationSelect}
                      searchOptions={searchOptions}
                    >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="location_input mb-0">
                          <span className="top_text mb-0">Location <span className='dot_alert'>*</span></span>
                          <input className='mb-0' {...getInputProps({ placeholder: 'Type address' })} />
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

                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className="group  error">
                    <input
                      className="inputMaterial"
                      value={value.price}
                      name="price"
                      type="text"
                      maxLength={5}
                      onChange={handleInputChange}
                      placeholder="Enter Price"
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">Price <span className='dot_alert'>*</span></label>
                    <span className="errmsg">{error.price}</span>
                  </div>
                </Grid>

                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <p>Description <span className='dot_alert'>*</span></p>
                  <CKEditor
                    editor={ClassicEditor}
                    data={value.description}
                    onChange={handleEditorChange}
                  />
                  <span className="errmsg">{error.description}</span>

                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="text-end">
                  {
                    loadingPage ? <>
                      <button className="global_btn">
                        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                      </button>
                    </> :
                      <button className="global_btn" onClick={validateFun}>
                        {updID != 1 ? 'Update Product' : 'Publish'}
                      </button>
                  }
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>

     {/* <FreePlanModal msg={'You do`nt have any plan to access this page !!'} freePlanModal={freePlanModal} setFreePlanModal={setFreePlanModal}/> */}

    </div>
  );
};

export default AddMarketplace;
