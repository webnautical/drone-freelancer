import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { Grid, Typography } from '@mui/material';
// import Textarea from '@mui/material/TextareaAutosize';
import { useNavigate ,useLocation } from '../../node_modules/react-router-dom/dist/index';
import { axiosInstance } from 'Utility/Api';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import PlacesAutocomplete from 'react-places-autocomplete';
import config from 'config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const UpdateProduct = () => {
  const [loadingPage, setLoadingPage] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imgList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const navigate = useNavigate(); 
  const locations = useLocation();
  const userRecord = locations.state;
  console.log(userRecord,"userRecord")
 
  const [updData, setUpdData] = useState();
  const [base64Img, setBase64Img] = useState([]);
  console.log("updData",updData)
  console.log("imgList",imgList)
  console.log("base64Img",base64Img)
  const [value, setValue] = useState({
    title: '',
    location: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    if (userRecord?._id != 1) {
      getDataByID();
    }
  }, [userRecord?._id]);
  useEffect(() => {
    if (updData?.title) {
      setValue({
        ...value,
        title: updData.title,
        location: updData.location,
        description: updData.description,
        price: updData.price
      });
    //   setFileList(updData?.images)
    //   setBase64Img(updData?.images)
    } else {
      setValue({
        ...value,
        title: '',
        location: '',
        description: '',
        price: 0,
      });
    }
  }, [updData]);

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

    // Check if the file is an image
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
    setTimeout(() => {
        if (imgList.length > 0) {
          const newArray = imgList.map((item) => {
            if (item?.thumbUrl && typeof item.thumbUrl === 'string') {
              return item.thumbUrl.split(',')[1];
            } else {
              console.error('Invalid thumbUrl:', item?.thumbUrl);
              return undefined; // or handle the case where thumbUrl is not valid
            }
          });
          setBase64Img(newArray.filter((item) => item !== undefined));
        }
      }, 1000);
      
  }, [imgList]);
  useEffect(() => {
    if (updData) {
      const initialImgList = updData?.images?.map(async (imageUrl, index) => {
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
  }, [updData]);
 
  const getBase64Image = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload img</div>
    </div>
  );
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
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setValue(prevValue => ({
      ...prevValue,
      description: data,
    }));
  };
  const [error, setError] = useState({
    title: '',
    location: '',
    description: '',
    price: '',
    img: ''
  });
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
    if (base64Img.length == 0) {
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
      if (userRecord?._id != 1) {
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
        toastifySuccess('Product Created SuccessFully !!');
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
    console.log('paramas', params);
  
    try {
      const res = await axiosInstance.post(`/user/updateProduct/${userRecord?._id}`, params,
      {
        headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.jwt}`
            }
      }
      );
      if (res.status == 200) {
        toastifySuccess('Product Updated SuccessFully !!');
        navigate('/product');
        navigate(`${config.basename}/product`)
        setLoadingPage(false)
      } else {
        toastifyError("Something Wen't Wrong !!");
        setLoadingPage(false)
      }
      // fetch(`${config.url}/user/updateProduct/${userRecord?._id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.jwt}`
      //   }
      // })
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((data) => {
      //     if (data.status == 200) {
      //         toastifySuccess('Product Updated SuccessFully !!');
      //         navigate('/product');
      //         navigate(`${config.basename}/product`)
      //         setLoadingPage(false)
      //       } else {
      //         toastifyError("Something Wen't Wrong !!");
      //         setLoadingPage(false)
      //       }
      //   });
    } catch (error) {
      console.log(error);
      setLoadingPage(false)
      toastifyError("Something Wen't Wrong !!")
    }
  };
  const getDataByID = async () => {
    try {
      // const res = await axiosInstance.post(`/user/getProductById/${userRecord?._id}`,
      // {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.jwt}`
      //   },
      // }
      // );
      // if (res.status == 200) {
      //   setUpdData(res?.data?.getProduct);
      // } else {
      //   toastifyError("Something Wen't Wrong !!");
      // }
      fetch(`${config.url}/user/getProductById/${userRecord?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status == 200) {
            setUpdData(data?.getProduct);
          }else{
            toastifyError("Something Wen't Wrong !!");
          }
        
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 7.25 }}>
          <Typography variant="h5" className="global_top_head">
            <h2 className="top_heading_pages_text">Update Market Place</h2>
          </Typography>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xl={12} lg={12} md={12}>
            <div className="product_upload_img top_box">
              <Grid container sx={{ justifyContent: 'center' }}>
                <Grid xs={6}>
                  <div className="upload_images text-center">
                    <Upload
                      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                      listType="picture-circle"
                    //   fileList={imgList}
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
                  <span className="errmsg">{error.img}</span>
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
                      placeholder="Enter your Product Tittle"
                      value={value.title}
                    />
                    <span className="bar"></span>
                    <label htmlFor="first">Tittle</label>
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
                    >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="location_input">
                          <span className="top_text">Location</span>
                          <input {...getInputProps({ placeholder: 'Type address' })} />
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
                    <label htmlFor="first">Price</label>
                    <span className="errmsg">{error.price}</span>
                  </div>
                </Grid>
                {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <div className="dec_text">
                    <h2>Enter Description </h2>
                    <Textarea placeholder="Type Here" name="description" onChange={handleInputChange} value={value.description} />
                    <span className="errmsg">{error.description}</span>
                  </div>
                </Grid> */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={value.description}
                    onChange={handleEditorChange}
                  />
                </Grid>

                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="text-end">
                  {
                    loadingPage ? <>
                      <button className="global_btn">
                        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                      </button>
                    </> :
                      <button className="global_btn" onClick={validateFun}>
                        {userRecord?._id != 1 ? 'Update Product' : 'Publish'}
                      </button>
                  }
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateProduct;
