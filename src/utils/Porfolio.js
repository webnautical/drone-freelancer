import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { Grid } from '@mui/material';
import Textarea from '@mui/material/TextareaAutosize';
import { useLocation, useNavigate } from '../../../node_modules/react-router-dom/dist/index';
// import { useNavigate, useParams } from '../../node_modules/react-router-dom/dist/index';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { axiosInstance } from 'Utility/Api';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
const Porfolio = () => {
  const location = useLocation();
  const portfolioData = location?.state ? location?.state?.portfolioData : null;

  console.log("portfolioData", portfolioData)

  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imgList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const navigate = useNavigate();
  const [base64Img, setBase64Img] = useState([]);
  const [urlList, setUrlList] = useState([])
  const [value, setValue] = useState({
    title: portfolioData?.title,
    type: 'image',
    description: portfolioData?.description,
    content: '',
  });
  const [error, setError] = useState({
    title: '',
    description: '',
    content: '',
  });
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const beforeUpload = (file) => {
    const isLt500K = file.size / 1024 <= MAX_FILE_SIZE;
    if (!isLt500K) {
      Modal.error({
        title: 'File must be smaller than 500KB!'
      });
      return false;
    }

    if (file.type && file.type.startsWith('image/')) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          if (img.width <= MAX_IMAGE_WIDTH && img.height <= MAX_IMAGE_HEIGHT) {
            resolve(true);
          } else {
            Modal.error({
              title: `Image dimensions must be less than ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT} pixels!`
            });
            reject(false);
          }
        };

        img.onerror = () => {
          reject(false);
        };
      });
    }

    return isLt500K;
  };
  const handleChange = (e) => {
    setFileList(e.fileList);
  };
  useEffect(() => {
    if (portfolioData) {

      if (portfolioData.videos) {
        setUrlList(portfolioData.videos)
        setValue({ ...value, 'type': 'video' })
      }

      if (portfolioData.three_d_images) {
        setUrlList(portfolioData.three_d_images)
        setValue({ ...value, 'type': 'three_d_image' })
      }

      if (portfolioData?.images) {
        const initialImgList = portfolioData?.images?.map(async (imageUrl, index) => {
          const base64Image = await getBase64Image(imageUrl);
          return {
            uid: `-1-${index}`,
            name: `image${index + 1}.png`,
            status: 'done',
            url: base64Image,
            thumbUrl: base64Image,
          };
        });
        Promise.all(initialImgList).then((result) => setFileList(result));
      }

    }
  }, [portfolioData]);

  const getBase64Image = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (imgList.length > 0) {
        const newArray = imgList.map((item) => {
          return item?.thumbUrl?.split(',')[1];
        });
        setBase64Img(newArray);
      }
    }, 1000);
  }, [imgList]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload img</div>
    </div>
  );
  const [addUpdateApiCallCount, setAddUpdateApiCallCount] = useState(0);

  const handleInputChange = (e) => {
    if (e.target.name == 'content') {
      setValue({ ...value, 'content': [e.target.value] });
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
    // if (value.type == 'image') {
    if (value.title.trim() == '') {
      setError((prevValues) => {
        return { ...prevValues, ['title']: 'Required *' };
      });
    } else {
      setError((prevValues) => {
        return { ...prevValues, ['title']: true };
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
    // } else {
    //   setError((prevValues) => {
    //     return { ...prevValues, ['title']: true, ['description']: true };
    //   });
    // }
  };
  const { title, description } = error;
  useEffect(() => {
    if (title === true && description === true) {
      handleSubmit();
    }
  }, [addUpdateApiCallCount, title, description]);

  const handleSubmit = async () => {
    setLoading(true)
    if (value.type == 'image') {
      const filteredImagesArray = base64Img.filter((image) => image !== undefined);
      var params = { ...value, ...{ content: filteredImagesArray } };
    } else {
      params = { ...value, ...{ content: urlList.length > 0 ? [...urlList, ...value.content] : value.content } };
    }
    try {
      if (portfolioData?._id) {
        const filteredImagesArray = base64Img.filter((image) => image !== undefined);
        params = { ...value, ...{ id: portfolioData._id, content: filteredImagesArray.length > 0 ? filteredImagesArray : [...urlList, ...value.content] } }
        const res = await axiosInstance.post('/user/updatePortfolioImage', params);
        if (res?.data?.status == 200) {
          toastifySuccess('Portfolio Updated SuccessFully !!');
          setLoading(false)
          navigate('/user/dashboard/default');
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false)
        }
      } else {
        const res = await axiosInstance.post('/user/addportFolio', params);
        if (res?.data?.status == 200) {
          toastifySuccess('Portfolio Created SuccessFully !!');
          setLoading(false)
          navigate('/user/dashboard/default');
        } else {
          toastifyError("Something Wen't Wrong !!");
          setLoading(false)
        }
      }

    } catch (error) {
      console.log(error);
      toastifyError("Something Wen't Wrong !!");
      setLoading(false)
    }
  };

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      <Grid item xl={6} lg={12} md={12}>
        <div className=" ">


          <Grid container spacing={2} className="mt-2">
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                <span className="top_text">Type</span>
                <Select
                  value={value.type}
                  onChange={handleInputChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="normal_select"
                  name='type'
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value={'image'}>Image</MenuItem>
                  <MenuItem value={'three_d_image'}>3D Image</MenuItem>
                  <MenuItem value={'video'}>Youtube Video</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} >
              <div className="group  error">
                <input
                  className="inputMaterial"
                  type="text"
                  name="title"
                  onChange={handleInputChange}
                  placeholder="Enter your Product Tittle"
                  value={value.title}
                />
                <span className="bar"></span>
                <label htmlFor="first">Tittle</label>
                <span className="errmsg">{error.title}</span>
              </div>
            </Grid>

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <div className="dec_text">
                <h2>Enter Description </h2>
                <Textarea placeholder="Type Here" name="description" onChange={handleInputChange} value={value.description} />
                <span className="errmsg">{error.description}</span>
              </div>
            </Grid>
            {
              value.type == 'video' || value.type == 'three_d_image' ?
                <>

                  <Grid item xs={12} className='mt-0 pt-0'>
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
                    <div className='add_more_btn text-end'>  <button className='btn btn-md btn-primary' onClick={addMoreLink}>Add more</button></div>
                  </Grid>
                  <Grid item xs={12} className='mt-0 pt-0'>
                    {
                      urlList?.map((item, i) => (
                        <div key={i} className="group  error">
                          <input
                            className="inputMaterial"
                            type="text"
                            name="content"
                            value={item} readOnly />
                          <span className="bar"></span>

                          <button className='close_dlt_input' onClick={() => handleRemoveItem(i)}>X</button>
                        </div>
                      ))
                    }
                  </Grid>
                </>
                :
                <></>
            }
            {
              value.type == 'image' &&
              <>
                <Grid container sx={{ justifyContent: 'center' }}>
                  <Grid xs={6}>
                    <div className="upload_images text-center">
                      <Upload
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        listType="picture-circle"
                        fileList={imgList}
                        onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                      >
                        {imgList.length >= 8 ? null : uploadButton}
                      </Upload>
                      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                          alt="example"
                          style={{
                            width: '100%'
                          }}
                          src={previewImage}
                        />
                      </Modal>
                    </div>
                  </Grid>
                </Grid>
              </>
            }

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="text-end mt-0 pt-0">
              {
                loading ? <>
                  <button className="global_btn">
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                  </button>
                </> :
                  <button className="global_btn" onClick={validateFun}>
                    {'Update'}
                  </button>
              }
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Porfolio;
