import { useState } from 'react';
// import { useEffect } from "react"
import { Form, Button } from 'reactstrap';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useLocation, useNavigate } from 'react-router';
// import { toast } from "react-toastify"
import {
  FormControl,
  // FormGroup, Input, InputLabel,
  // ListItemText,
  // Checkbox,
  // MenuItem,
  // Select,
  Grid
} from '@mui/material';
import config from 'config';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import { TextField } from '../../../node_modules/@mui/material/index';
const Editcategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const staticdata = location.state.data;
  console.log(staticdata, 'dhdhh');
  const [selectedImage, setSelectedImage] = useState(staticdata.image);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(staticdata.image);
  const [category, setCategoryname] = useState(staticdata.category_name);
  const [title, setTitle] = useState(staticdata?.subcategory?.name);
  const [category_description, setcategory_description] = useState(staticdata?.category_description);
  const [task_description, setTask_description] = useState(staticdata.subcategory?.task_description);
  const [application_method_and_rate, setApplication_method_and_rate] = useState(staticdata.subcategory?.application_method_and_rate);
  const [location_nearest_town, setLocation_nearest_town] = useState(staticdata.subcategory?.location_nearest_town);
  const [google_map_link, setGoogle_map_link] = useState(staticdata.subcategory?.google_map_link);
  const [what_kind_country, setWhat_kind_country] = useState(staticdata.subcategory?.what_kind_country);
  //   const [language, setLanguage] = useState(staticdata);
  //   const [url, setUrl] = useState(staticdata);

  const [message, setMessage] = useState('');

  const [quate_me_for, setQuateMeFor] = useState(staticdata.subcategory?.quate_me_for);
  const [its_for_a, setIts_for_a] = useState(staticdata.subcategory?.its_for_a);
  const [need_you_there_for, setNeed_you_there_for] = useState(staticdata.subcategory?.need_you_there_for);
  const [instpect_a, setInstpect_a] = useState(staticdata.subcategory?.instpect_a);

  // console.log(quate_me_for,"quate_me_for")
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Convert the comma-separated string into an array
    const arrayValue = inputValue.split(',').map((item) => item.trim());
    // Use 'arrayValue' as needed in your application
    setQuateMeFor(arrayValue);
    //   console.log(arrayValue);
  };
  const handleInputChange2 = (e) => {
    const inputValue = e.target.value;

    // Convert the comma-separated string into an array
    const arrayValue = inputValue.split(',').map((item) => item.trim());
    // Use 'arrayValue' as needed in your application
    setIts_for_a(arrayValue);
    // console.log(arrayValue);
  };
  const handleInputChange3 = (e) => {
    const inputValue = e.target.value;

    // Convert the comma-separated string into an array
    const arrayValue = inputValue.split(',').map((item) => item.trim());
    // Use 'arrayValue' as needed in your application
    setNeed_you_there_for(arrayValue);
    // console.log(arrayValue);
  };
  const handleInputChange4 = (e) => {
    const inputValue = e.target.value;

    // Convert the comma-separated string into an array
    const arrayValue = inputValue.split(',').map((item) => item.trim());
    // Use 'arrayValue' as needed in your application
    setInstpect_a(arrayValue);
    // console.log(arrayValue);
  };

  const handleform = (e) => {
    e.preventDefault();
    const updatedUser = {
      category_id: staticdata._id,
      category_name: category,
      category_description: category_description,
      image: base64Stringofsub.split(',').pop(),
      subcategory: {
        name: title,
        quate_me_for: quate_me_for,
        its_for_a: its_for_a,
        instpect_a: instpect_a,
        need_you_there_for: need_you_there_for,
        task_description: task_description,
        application_method_and_rate: application_method_and_rate,
        location_nearest_town: location_nearest_town,
        google_map_link: google_map_link,
        what_kind_country
      }
    };
    console.log(updatedUser);
    fetch(`${config.url}/admin/updateJobCategoryByAdmin`, {
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
        if (data.message == 'update Category successfully') {
          toastifySuccess('home content update successfully !!');
          navigate(`${config.basename}/utils/allcategory`);
        } else {
          toastifyError("Something Wen't Wrong !!");
          setMessage('error occured');
        }
      });
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

  return (
    <div>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={12} md={12} sm={12} xs={12}>
          <h3 className="top_heading_pages_text"> Edit category</h3>
        </Grid>
        <Grid className="pages_global_background p-4" item xs={8}>
          <h6 className="text-danger text-center">{message}</h6>
          <Form onSubmit={handleform}>
            <Grid container spacing={2} className="p-4">
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-1 p-2">
                <FormControl fullWidth>
                  <div className="file-uploader">
                    <label htmlFor="file10" className="global_file_upload_deisgn">
                      <InsertPhotoIcon />
                      Categoery Image
                      <input type="file" id="file10" accept="image/*" onChange={handlesubcategoryUpload} />
                    </label>
                  </div>
                  {selectedImage && (
                    <div className="preview_upload">
                      <h4>Image Preview</h4>
                      <img src={base64Stringofsub} alt="Selected" style={{ maxWidth: '200px' }} />
                    </div>
                  )}
                </FormControl>
              </Grid>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
                <span htmlFor="name" className="admin_label">
                  Category Name
                </span>
                <TextField
                  className="w-100"
                  type="text"
                  id="category"
                  placeholder="Enter here"
                  name="category"
                  value={category}
                  onChange={(e) => {
                    setCategoryname(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div className="">
                  <span htmlFor="category_description" className="admin_label">
                    category description
                  </span>
                  <TextField
                    type="text"
                    id="category_description"
                    placeholder="Enter description"
                    className="w-100"
                    name="category_description"
                    value={category_description}
                    onChange={(e) => {
                      setcategory_description(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-1 p-2">
                <h3> Subcategory data</h3>
              </Grid>
          
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div className="">
                  <span htmlFor="name" className="admin_label">
                    Name
                  </span>
                  <TextField
                    type="text"
                    id="name"
                    placeholder="Enter here"
                    className="w-100"
                    name="name"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div className="">
                  <span htmlFor="quate_me_for" className="admin_label">
                    Quate me for
                  </span>
                  <TextField
                    type="text"
                    id="quate_me_for"
                    placeholder="Enter here"
                    className="w-100"
                    name="quate_me_for"
                    value={quate_me_for}
                    onChange={handleInputChange}
                  />
                  <span htmlFor="instpect_a" className="admin_label">
                    Please separate items with commas
                  </span>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div className="">
                  <span htmlFor="its_for_a" className="admin_label">
                    Its for a
                  </span>
                  <TextField
                    type="text"
                    id="its_for_a"
                    placeholder="Enter here"
                    className="w-100"
                    name="its_for_a"
                    value={its_for_a}
                    onChange={handleInputChange2}
                  />
                  <span htmlFor="instpect_a" className="admin_label">
                    Please separate items with commas
                  </span>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div className="">
                  <span htmlFor="need_you_there_for" className="admin_label">
                    Need you there for
                  </span>
                  <TextField
                    type="text"
                    id="need_you_there_for"
                    placeholder="Enter here"
                    className="w-100"
                    name="need_you_there_for"
                    value={need_you_there_for}
                    onChange={handleInputChange3}
                  />
                  <span htmlFor="instpect_a" className="admin_label">
                    Please separate items with commas
                  </span>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="instpect_a" className="admin_label">
                    Instpect a
                  </span>
                  <TextField
                    type="text"
                    id="instpect_a"
                    placeholder="Enter here"
                    className="w-100"
                    name="instpect_a"
                    value={instpect_a}
                    onChange={handleInputChange4}
                  />
                  <span htmlFor="instpect_a" className="admin_label">
                    Please separate items with commas
                  </span>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="task_description" className="admin_label">
                    Task description
                  </span>
                  <TextField
                    type="text"
                    id="task_description"
                    placeholder="Enter here"
                    className="w-100"
                    name="task_description"
                    value={task_description}
                    onChange={(e) => {
                      setTask_description(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="application_method_and_rate" className="admin_label">
                    Application Method And Rate
                  </span>
                  <TextField
                    type="text"
                    id="application_method_and_rate"
                    placeholder="Enter here"
                    className="w-100"
                    name="application_method_and_rate"
                    value={application_method_and_rate}
                    onChange={(e) => {
                      setApplication_method_and_rate(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="location_nearest_town" className="admin_label">
                    Location Nearest Town
                  </span>
                  <TextField
                    type="text"
                    id="location_nearest_town"
                    placeholder="Enter here"
                    className="w-100"
                    name="location_nearest_town"
                    value={location_nearest_town}
                    onChange={(e) => {
                      setLocation_nearest_town(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="google_map_link" className="admin_label">
                    Google map link
                  </span>
                  <TextField
                    type="text"
                    id="google_map_link"
                    placeholder="Enter here"
                    className="w-100"
                    name="google_map_link"
                    value={google_map_link}
                    onChange={(e) => {
                      setGoogle_map_link(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
                <div>
                  <span htmlFor="what_kind_country" className="admin_label">
                    Type of Terrain (E.g. Flat, Forest, Hill, Mountains, Powerlines...)
                  </span>
                  <TextField
                    type="text"
                    id="what_kind_country"
                    placeholder="Enter here"
                    className="w-100"
                    name="what_kind_country"
                    value={what_kind_country}
                    onChange={(e) => {
                      setWhat_kind_country(e.target.value);
                    }}
                  />
                </div>
              </Grid>
            </Grid>

            <div className="text-end">
              <Button type="submit" className="global_dashbtn" color="primary">
                Update
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>

      {/* </Card> */}
    </div>
  );
};

export default Editcategory;
