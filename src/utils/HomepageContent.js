import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Grid, Button } from '@mui/material';
import config from 'config';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function HomepageContent() {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    _id: '',
    tital: '',
    htag: '',
    ptag: '',
    banerImage: '',
    dronImage: '',
    getStartedSection: {
      tital: '',
      quates: [{}]
    },
    howitworksection: {
      tital: '',
      subheading: '',
      content: '',
      option: [{ points: [''] }]
    },
    appsection: {
      appstoreurl: '',
      content: '',
      playstoreurl: '',
      subheading: '',
      tital: '',
    }
  });

  // const handleEditorChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value
  //   }));
  // };
  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      howitworksection: {
        ...prevData.howitworksection,
        [name]: value
      },
    }));
  };

  const handleInputChange22 = (event, editor) => {
    const updatedData = editor.getData();
    setFormData((prevData) => ({
      ...prevData,
      getStartedSection: {
        ...prevData.getStartedSection,
        'tital': updatedData
      }
    }));
  };
  const handleHowItWorksPointChange = (event, optionIndex, pointIndex) => {
    const { value } = event.target;
    setFormData((prevData) => {
      const updatedOptions = [...prevData.howitworksection.option];
      updatedOptions[optionIndex].points[pointIndex] = value;
      return {
        ...prevData,
        howitworksection: {
          ...prevData.howitworksection,
          option: updatedOptions
        }
      };
    });
  };

  const handleGetStartedTitleChange = (event, quoteIndex) => {
    const updatedGetStartedSection = { ...formData.getStartedSection };
    updatedGetStartedSection.quates[quoteIndex].tital = event.target.value;
    setFormData({
      ...formData,
      getStartedSection: updatedGetStartedSection
    });
  };
  const handleGetStartedTitleChange2 = (event, quoteIndex) => {
    const updatedGetStartedSection = { ...formData.getStartedSection };
    updatedGetStartedSection.quates[quoteIndex].subheading = event.target.value;
    setFormData({
      ...formData,
      getStartedSection: updatedGetStartedSection
    });
  };

  const handleImageChange2 = (event, quoteIndex) => {
    const updatedGetStartedSection = { ...formData.howitworksection };

    if (!updatedGetStartedSection.option[quoteIndex]) {
      updatedGetStartedSection.option[quoteIndex] = {};
    }

    const file = event.target.files[0];

    if (file) {
      // Check if the file type is allowed
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        // Display an error message or handle the error accordingly
        setError('Unsupported file type. Please upload a PNG, JPEG, JPG,  or ZIP file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updatedGetStartedSection.option[quoteIndex].image = reader.result;
        setFormData({
          ...formData,
          howitworksection: updatedGetStartedSection
        });
      };

      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageChange = (event, index) => {
    const updatedGetStartedSection = { ...formData.getStartedSection };
    if (!updatedGetStartedSection.quates[index]) {
      updatedGetStartedSection.quates[index] = {};
    }
    const file = event.target.files[0];
    console.log(updatedGetStartedSection)
    console.log(file)
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        // Display an error message or handle the error accordingly
        setError('Unsupported file type. Please upload a PNG, JPEG, JPG,or ZIP file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedGetStartedSection.quates[index].image = reader.result;
        setFormData({
          ...formData,
          getStartedSection: updatedGetStartedSection
        });
      };
      console.log('State after update:', formData);
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange3 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload a PNG, JPEG, JPG, WEBP, or ZIP file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          banerImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageChange4 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          dronImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getData = async () => {
    try {
      const response = await fetch(`${config.url}/admin/getHomePageContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      });

      const data = await response.json();
      if (data.message === 'home content data get successfully') {
        console.log("data", data)


        setFormData({
          _id: data.addHomecontent[0]?._id || '',
          tital: data.addHomecontent[0]?.tital || '',
          htag: data.addHomecontent[0]?.htag || '',
          ptag: data.addHomecontent[0]?.ptag || '',
          banerImage: data.addHomecontent[0]?.banerImage || '',
          dronImage: data.addHomecontent[0]?.dronImage || '',
          getStartedSection: data.addHomecontent[0]?.getstartedsection || { quates: [{}] },
          howitworksection: {
            tital: data.addHomecontent[0]?.howitworksection?.tital || '',
            content: data.addHomecontent[0]?.howitworksection?.content || '',
            subheading: data.addHomecontent[0]?.howitworksection?.subheading || '',
            option: data.addHomecontent[0]?.howitworksection?.option || [{ points: [''] }]
          },
          appsection: {
            tital: data.addHomecontent[0]?.appsection?.tital || '',
            content: data.addHomecontent[0]?.appsection?.content || '',
            subheading: data.addHomecontent[0]?.appsection?.subheading || '',
            appstoreurl: data.addHomecontent[0]?.appsection?.appstoreurl || '',
            playstoreurl: data.addHomecontent[0]?.appsection?.playstoreurl || '',
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUpdate = async () => {
    try {
      setloading(true);
      console.log(formData);
      const response = await fetch(`${config.url}/admin/updateHomePageContent/${formData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.message === 'home content update successfully') {
        toastifySuccess('home content update successfully !!');
        setloading(false);
        getData()
      } else {
        toastifyError("Something Wen't Wrong !!");
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewPoint = (optionIndex) => {
    setFormData((prevData) => {
      const updatedOptions = [...prevData.howitworksection.option];
      updatedOptions[optionIndex].points.push('');
      return {
        ...prevData,
        howitworksection: {
          ...prevData.howitworksection,
          option: updatedOptions
        }
      };
    });
  };

  // Function to delete a point from the How It Works Section
  const handleDeletePoint = (optionIndex, pointIndex) => {
    setFormData((prevData) => {
      const updatedOptions = [...prevData.howitworksection.option];
      updatedOptions[optionIndex].points.splice(pointIndex, 1);
      return {
        ...prevData,
        howitworksection: {
          ...prevData.howitworksection,
          option: updatedOptions
        }
      };
    });
  };

  const handleDeleteOption = (optionIndex) => {
    const updatedFormData = { ...formData };
    updatedFormData.howitworksection.option.splice(optionIndex, 1);
    setFormData(updatedFormData);
  };
  const handleAddNewOption = () => {
    const updatedFormData = { ...formData };
    const newOption = {
      title: '',
      points: [''],
      image: null
    };
    updatedFormData.howitworksection.option.push(newOption);
    setFormData(updatedFormData);
  };

  const handleEditorChange = (event, editor) => {
    const updatedData = editor.getData();
    setFormData((prevData) => ({
      ...prevData,
      ptag: updatedData
    }));
  };

  const removeImg = () => {
    setFormData({
      ...formData,
      dronImage: ''
    });
  }

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h1 className="top_heading_pages_text  ">Home Page Content</h1>
          <Grid className="pages_global_background  p-4" container sx={{ my: 1 }}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              {/* <span></span> */}
              <CKEditor editor={ClassicEditor} name="ptag" data={formData.ptag} onChange={handleEditorChange} />

            </Grid>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file4" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Background Image (Recommended size 1920px x 900px)
                    <input type="file" id="file4" accept="image/*,image/gif" onChange={(event) => handleImageChange3(event)} />
                  </label>
                </div>
              </FormControl>
              <div className="preview_upload">
                <h4>Background Preview</h4>
                {formData.banerImage && <img src={formData.banerImage} alt="Banner" />}
              </div>
            </Grid>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file16" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Drone Images (Recommended size 1080px x 485px)
                    <input type="file" id="file16" accept="image/*,image/gif" onChange={(event) => handleImageChange4(event)} />
                  </label>
                </div>
              </FormControl>
              <div className="preview_upload">
                {formData.dronImage && <img src={formData.dronImage} alt="drone" />}
                {formData.dronImage &&
                  <button onClick={() => removeImg()} style={{ color: 'red', outline: 'none', border: 'none' }}>
                    <DeleteOutlineIcon style={{ width: '20px' }} />
                  </button>}
              </div>
            </Grid>
            {formData.getStartedSection && formData.getStartedSection.quates ? (
              <>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-1 p-2">
                  <h6 className="">
                    <strong>Get Started Section</strong>
                  </h6>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <CKEditor editor={ClassicEditor} name="tital" data={formData?.getStartedSection?.tital} onChange={handleInputChange22} />

                  {/* <FormControl className="mb-2" fullWidth>
                    <TextField
                      variant="outlined"
                      label="Main Heading"
                      name={`tital`}
                      value={formData?.getStartedSection?.tital}
                      onChange={(event) => handleInputChange22(event)}
                    />
                  </FormControl> */}
                </Grid>
                {formData?.getStartedSection?.quates?.map((quote, index) => (
                  <Grid container key={quote._id}>
                    <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          label="Title"
                          name={`tital_${index}`}
                          value={quote.tital || ''}
                          onChange={(event) => handleGetStartedTitleChange(event, index)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          label="Subheading"
                          name={`subheading_${index}`}
                          value={quote.subheading || ''}
                          onChange={(event) => handleGetStartedTitleChange2(event, index)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} className="mb-4 p-2">
                      <FormControl fullWidth>
                        <div className="file-uploader">
                          <label htmlFor={`file25${quote._id}`} className="global_file_upload_deisgn">
                            <InsertPhotoIcon />
                            {index} Image
                            {/* <input type="file" accept="image/*, image/gif" onChange={(event) => handleImageChange(event, optionIndex)} /> */}
                            <input type="file" id={`file25${quote._id}`} accept="image/*,image/gif" onChange={(event) => handleImageChange(event, index)} />
                          </label>
                        </div>
                      </FormControl>
                      {quote.image && (
                        <div className="preview_upload">
                          <h4>Image Preview</h4>
                          <img src={quote.image} alt={`Quote: ${quote.tital}`} />
                        </div>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </>
            ) : (
              <p>Get Started Section is empty</p>
            )}
            <br />
            {formData?.howitworksection && formData?.howitworksection ? (
              <>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <h6 className="">
                    <strong>How It Works Section</strong>
                  </h6>
                </Grid>
                <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <FormControl className="mb-2" fullWidth>
                    <TextField
                      variant="outlined"
                      label="tital"
                      name={`tital`}
                      value={formData?.howitworksection?.tital}
                      onChange={(event) => handleInputChange2(event)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <FormControl className="mb-2" fullWidth>
                    <TextField
                      variant="outlined"
                      label="Subheading"
                      name={`subheading`}
                      value={formData?.howitworksection?.subheading}
                      onChange={(event) => handleInputChange2(event)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <FormControl className="mb-2" fullWidth>
                    <TextField
                      variant="outlined"
                      label="Content"
                      name={`content`}
                      value={formData?.howitworksection?.content}
                      onChange={(event) => handleInputChange2(event)}
                      multiline
                      rows={4}
                    />
                  </FormControl>
                </Grid>

                {formData?.howitworksection?.option &&
                  formData?.howitworksection?.option?.map((option, optionIndex) => (
                    <Grid item xs={12} key={optionIndex}>
                      {/* ... Your existing JSX for option ... */}
                      {option.points.map((point, index) => (
                        <div className="point_keys" key={index}>
                          <FormControl className="mb-4 p-2" fullWidth>
                            <TextField
                              variant="outlined"
                              label={`Point ${index + 1}`}
                              name={`point_${index + 1}`}
                              value={point}
                              onChange={(event) => handleHowItWorksPointChange(event, optionIndex, index)}
                            />
                          </FormControl>
                          {/* Button to delete the point */}
                          <Button className="close_key" onClick={() => handleDeletePoint(optionIndex, index)} style={{ color: 'red' }}>
                            <DeleteOutlineIcon />
                          </Button>
                        </div>
                      ))}
                      {/* Button to add a new point */}
                      <div className="text-end">
                        <Button onClick={() => handleAddNewPoint(optionIndex)}>
                          <AddIcon />
                          Add New
                        </Button>
                      </div>

                      {/* <FormControl className="mb-2" fullWidth>
                        <input type="file" accept="image/*, image/gif" onChange={(event) => handleImageChange2(event, optionIndex)} />
                      </FormControl> */}
                      <div className="file-uploader">
                        <label htmlFor={`file25${option._id}`} className="global_file_upload_deisgn">
                          <InsertPhotoIcon />
                          Image
                          {/* <input type="file" id='file25' accept="image/*,image/gif" onChange={(event) => handleImageChange2(event, optionIndex)} /> */}
                          <input type="file" id={`file25${option._id}`} accept="image/*,image/gif" onChange={(event) => handleImageChange2(event, optionIndex)} />
                        </label>
                      </div>

                      {option.image && (
                        // <img src={option.image} alt={`Option: ${option.title}`} style={{ maxWidth: '200px', height: '200px' }} />
                        <div className="preview_upload">
                          <h4>Image Preview</h4>
                          <img src={option.image} alt={`Quote: ${option.tital}`} />
                        </div>
                      )}
                      <Button onClick={() => handleDeleteOption(optionIndex)} style={{ color: 'red' }}>
                        Delete Option
                      </Button>
                    </Grid>
                  ))}
                <Button onClick={handleAddNewOption}>Add New Option</Button>
                <Grid item xs={12}>
                  {error && <span style={{ color: 'red', fontSize: '14px' }}>{error}</span>}
                </Grid>
              </>
            ) : (
              <p>How It Works Section is empty</p>
            )}

            <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
              <Grid item xs={12}>
                {loading ? (
                  <Button className="global_dashbtn">
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                  </Button>
                ) : (
                  <Button className="global_dashbtn" onClick={() => handleUpdate()}>
                    Update
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
