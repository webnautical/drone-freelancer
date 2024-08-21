import { useState } from 'react';
// import { useEffect } from "react"
import { Form, Button } from 'reactstrap';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import {  useNavigate } from 'react-router';
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
const Addnewcategory = () => {

  const navigate = useNavigate();

  const [selectedImage, setSubcategoryBase64Image] = useState('');
  const [category, setCategoryname] = useState('');
  // const [message, setMessage] = useState('');

  const handleform = (e) => {
    e.preventDefault();
    const updatedUser = {
      category_name: category,
      image: selectedImage.split(',').pop()
    };
    console.log(updatedUser);
    fetch(`${config.url}/admin/addJobCategoryByAdmin`, {
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
        if (data.message == 'Category added successfully') {
          toastifySuccess('Category added successfully !!');
          navigate(`${config.basename}/utils/allcategory`);
        } else {
          toastifyError("Something Wen't Wrong !!");
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
      setSubcategoryBase64Image(file);
    }
  };

  return (
    // <div className="wrapper">
    //     {/* <Card className="shadow-sm  border-0 mt-2"> */}

    //     <h3> Add New category</h3>
    //     <h6 className="text-danger text-center">{message}</h6>
    //     <Form onSubmit={handleform}>
    //         <div className="my-3">
    //             <span htmlFor="name">Category Name</span>
    //             <input
    //                 type="text"
    //                 id="category"
    //                 placeholder="Enter here"
    //                 className="rounded-0 form-control"
    //                 name="category"
    //                 value={category}

    //                 onChange={(e) => {
    //                     setCategoryname(e.target.value);
    //                 }}
    //             />
    //         </div>

    //         <Grid item xs={12}>
    //             <FormControl fullWidth>
    //                 <h4>Upload Image</h4>
    //                 <input type="file" accept="image/*" onChange={handlesubcategoryUpload} />
    //                 {selectedImage && (
    //                     <div>
    //                         <h4>Selected Image:</h4>
    //                         <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px' }} />
    //                     </div>
    //                 )}
    //             </FormControl>
    //         </Grid>
    //         <Container className="text-center">
    //             <Button type="submit" className="rounded-0" color="primary">
    //                 Add New
    //             </Button>
    //         </Container>
    //     </Form>

    //     {/* </Card> */}
    // </div>

    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={12} md={12} sm={12} xs={12}>
          <h3 className="top_heading_pages_text"> Add New Categoery</h3>
        </Grid>
        <Grid item xs={8} className="pages_global_background p-4">
          <Grid>
            <Form onSubmit={handleform}>
              <Grid container>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
                  <FormControl fullWidth>
                    <div className="file-uploader">
                      <label htmlFor="file11" className="global_file_upload_deisgn">
                        <InsertPhotoIcon />
                        Categoery Image
                        <input type="file" id="file11" accept="image/*" onChange={handlesubcategoryUpload} />
                      </label>
                    </div>
                    {selectedImage && (
                      <div className="preview_upload">
                        <h4>Image Preview</h4>
                        <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px' }} />
                      </div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
                  <div>
                    <span htmlFor="name" className="admin_label">
                      Category Name
                    </span>
                    <TextField
                      type="text"
                      id="category"
                      placeholder="Enter here"
                      className="w-100"
                      name="category"
                      value={category}
                      onChange={(e) => {
                        setCategoryname(e.target.value);
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <div className="text-end">
                <Button type="submit" className="global_dashbtn" color="primary">
                  Add New
                </Button>
              </div>
            </Form>

            {/* <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
                            <Grid item xs={12}>
                               
                                {loading ? (
                                    <Button className="global_btn">
                                        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                    </Button>
                                ) : (
                                    <Button className="global_btn" onClick={() => handleform()}>
                                        Update
                                    </Button>
                                )}
                            </Grid>
                        </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Addnewcategory;
