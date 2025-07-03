import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Textarea from '@mui/material/TextareaAutosize';
import { useLocation, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
// import { useNavigate, useParams } from '../../node_modules/react-router-dom/dist/index';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { axiosInstance } from 'Utility/Api';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const Porfolio = ({ portfolioMethod, setPortfolioLoading, setPortfolioMethod }) => {
  const location = useLocation();
  const portfolioData = location?.state ? location?.state?.portfolioData : null;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [base64Img, setBase64Img] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  console.log(loading)
  const [value, setValue] = useState({
    title: portfolioData?.title ? portfolioData?.title : '',
    type: 'image',
    description: portfolioData?.description,
    content: ''
  });

  const [error, setError] = useState({
    title: '',
    description: '',
    content: '',
    img: []
  });

  useEffect(() => {
    if (portfolioData) {
      if (portfolioData.videos) {
        setUrlList(portfolioData.videos);
        setValue({ ...value, type: 'video' });
      }

      if (portfolioData.three_d_images) {
        setUrlList(portfolioData.three_d_images);
        setValue({ ...value, type: 'three_d_image' });
      }

      if (portfolioData?.images) {
        setBase64Img(portfolioData?.images)
        setImagePreviews(portfolioData?.images)
      }
    } else {
      setValue({ ...value, 'title': '', 'description': '' });
    }
  }, [portfolioData]);

  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

  const handleInputChange = (e) => {
    if (e.target.name == 'content') {
      // const youtubeUrl = e.target.value;
      // const videoId = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([\w-]{11})/);
      // if (videoId && videoId[1]) {
      //   const youtubeURL = `https://www.youtube.com/watch?v=${videoId[1]}`
      //   setValue({ ...value, content: youtubeURL });
      // }
      setValue({ ...value, content: [e.target.value] });
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      });
    }
  };

  const addMoreLink = () => {
    if (value.content == '') {
      setError({ content: 'Please enter a valid link.' });
      return;
    }
    setError({ content: '' });
    setUrlList((prevUrlList) => {
      const updatedList = prevUrlList.concat(value.content);
      console.log("updatedList", updatedList)
      return updatedList;
    });
    setValue({ ...value, content: '' });
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addMoreLink();
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    const newArray = urlList.filter((_, index) => index !== indexToRemove);
    setUrlList(newArray);
  };

  const validateFun = () => {
    setAddUpdateApiCallCount(addUpdateApiCallCount + 1);

    if (value && typeof value.title === 'string' && value.title.trim() === '') {
      setError((prevValues) => {
        return { ...prevValues, ['title']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['title']: true };
      });
    }

    if (value.description == '') {
      setError((prevValues) => {
        return { ...prevValues, ['description']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['description']: true };
      });
    }

    if (value.type == 'image') {
      if (imagePreviews?.length == 0) {
        setError((prevValues) => {
          return { ...prevValues, ['img']: 'Required *' };
        });
        setPortfolioMethod({
          ...portfolioMethod,
          page: false,
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['img']: true };
        });
        setPortfolioLoading(false)
      }
    }
    if (value.type == 'video' || value.type == 'three_d_image') {
      if (value?.content == 0) {
        setError((prevValues) => {
          return { ...prevValues, ['content']: 'Required *' };
        });
      } else {
        setError((prevValues) => {
          return { ...prevValues, ['content']: true };
        });
      }
    }
  };
  const { title, description, img } = error;
  useEffect(() => {
    if (value.type === 'image') {
      if (title === true && description === true && img === true && portfolioMethod.page === true) {
        handleSubmit();
      }
    } else {
      if (title === true && description === true) {
        handleSubmit();
      }
    }
  }, [addUpdateApiCallCount, title, description, img]);

  const handleSubmit = async () => {
    setLoading(true);
    setPortfolioLoading(true)
    if (value.type == 'image') {
      const filteredImagesArray = base64Img.filter((image) => image !== undefined);
      var params = { ...value, ...{ content: filteredImagesArray } };
    } else {
      params = { ...value, ...{ content: urlList.length > 0 ? [...urlList, ...value.content] : value.content } };
    }
    try {
      if (portfolioData?._id) {
        const filteredImagesArray = base64Img.filter((image) => image !== undefined);
        params = {
          ...value,
          ...{ id: portfolioData._id, content: filteredImagesArray.length > 0 ? filteredImagesArray : [...urlList, ...value.content] }
        };
        const res = await axiosInstance.post('/user/updatePortfolioImage', params);
        if (res?.data?.status == 200) {
          toastifySuccess('Portfolio Updated SuccessFully !!');
          setLoading(false);
          setPortfolioLoading(false)
          setValue({
            ...value,
            title: '',
            type: 'image',
            description: '',
            content: '',
            img: []
          })
          navigate('/user/dashboard/default');
        } else {
          toastifyError("Something Wen't Wrong !!");
          setPortfolioLoading(false)
          setLoading(false);
        }
      } else {
        const res = await axiosInstance.post('/user/addportFolio', params);
        if (res?.data?.status == 200) {
          toastifySuccess('Portfolio Created SuccessFully !!');
          setPortfolioLoading(false)
          setValue({
            ...value,
            title: '',
            type: 'image',
            description: '',
            content: '',
            img: []
          })
          setLoading(false);
          navigate('/user/dashboard/default');
        } else {
          toastifyError("Something Wen't Wrong !!");
          setPortfolioLoading(false)
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toastifyError("Something Wen't Wrong !!");
      setPortfolioLoading(false)
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', ' image/jpg'];
    const maxSize = 20 * 1024 * 1024;
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

  const removeFileItem = (indexToRemove) => {
    setImagePreviews((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    setBase64Img((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    if (portfolioMethod != undefined && portfolioMethod.page == true && portfolioMethod.count > 0) {
      validateFun()
    }
  }, [portfolioMethod, portfolioMethod.count])

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      <Grid item xl={6} lg={12} md={12}>
        <div className=" ">
          <Grid container spacing={2} className="mt-2">
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="px-0 mb-0">
              <div className='mb-5' style={{ backgroundColor: '#e8f7ff', padding: '10px', borderRadius: '5px' }}>
                <p className="mb-0">
                  Show off your skills and land your dream project! Use the form below to build your portfolio. Or click <b>&apos;Next&apos;</b> to save progress and come back anytime.
                </p>
              </div>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="manage_space normal_select mb-0">

                <span className="top_text">Type of Project</span>
                <Select
                  value={value.type}
                  onChange={handleInputChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="normal_select"
                  name="type"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value={'image'}>Image</MenuItem>
                  <MenuItem value={'three_d_image'}>3D-Model</MenuItem>
                  <MenuItem value={'video'}>Youtube Video</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="px-0 mb-0">
              <div className="group  error">
                <input
                  className="inputMaterial"
                  type="text"
                  name="title"
                  onChange={handleInputChange}
                  placeholder="Write a caption or headline for this project"
                  value={value.title}
                />
                <span className="bar"></span>
                <label htmlFor="first">Project Name</label>
                <span className="errmsg">{error.title}</span>
              </div>
            </Grid>

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="px-0 mb-0">
              <div className="dec_text">
                <h2 style={{ fontSize: '12px', color: '#747474' }}>Project Description </h2>
                <Textarea placeholder="Type Here" name="description" onChange={handleInputChange} value={value.description} />
                <span className="errmsg">{error.description}</span>
              </div>
            </Grid>
            {value.type == 'video' || value.type == 'three_d_image' ? (
              <>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="px-0">
                  <div className="group  error mb-2">
                    <input
                      className="inputMaterial"
                      type="text"
                      name="content"
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Paste Your Link Here ..."
                      value={value.content}
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">Link</label>
                    <span className="errmsg">{error.content}</span>
                  </div>
                  <div className="add_more_btn text-end">
                    {' '}
                    <button className="global_fade_btn" onClick={addMoreLink}>
                      Add more
                    </button>
                  </div>
                </Grid>
                <Grid item xs={12} className="mt-0 pt-0 px-0">
                  {urlList?.map((item, i) => (
                    <div key={i} className="group  error">
                      <input className="inputMaterial" type="text" name="content" value={item} readOnly />
                      <span className="bar"></span>

                      <div className="dlt_btn_inner">
                        <button className="close_dlt_input" onClick={() => handleRemoveItem(i)}>
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </Grid>
              </>
            ) : (
              <></>
            )}
            {value.type == 'image' && (
              <>
                <Grid container sx={{ justifyContent: 'center' }}>
                  <Grid xs="12" className="mb-4">
                    <FormControl fullWidth>
                      <div className="file-uploader">
                        <label htmlFor="iamgesID" className="global_file_upload_deisgn">
                          <InsertPhotoIcon />
                          <p className='m-0 p-0'>Upload Document</p>
                          <p className='m-0 p-0' style={{ fontSize: '12px' }}>Image (JPG,JPEG, PNG) and file size less than 20MB.</p>
                          <input type="file" id="iamgesID" multiple onChange={handleImageChange} />
                        </label>
                      </div>
                    </FormControl>
                    <div className="main_global_upload preview_upload">
                      {imagePreviews.map((preview, index) => (
                        <>
                          <div className='pre_upload_remove'>
                            <img key={index} src={preview} alt={`Preview ${index}`} />
                            <button onClick={() => removeFileItem(index)}>
                              <DeleteOutlineIcon />
                            </button>
                          </div>
                        </>
                      ))}
                    </div>
                    {error.img && <p style={{ color: 'red' }}>{error.img}</p>}
                  </Grid>
                </Grid>
              </>
            )}

            {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="text-end mt-3 pt-0">
              {loading ? (
                <>
                  <button className="global_btn">
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                  </button>
                </>
              ) : (
                <button className="global_btn" onClick={validateFun}>
                  {'Upload'}
                </button>
              )}
            </Grid> */}
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Porfolio;
