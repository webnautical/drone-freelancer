// import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import {
  FormControl,
  // FormGroup, Input, InputLabel,  makeStyles,
  TextField,
  Grid
} from '@mui/material';
import { useState, useEffect } from 'react';

import config from 'config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const theme = createTheme();
import { toastifyError, toastifySuccess } from 'Utility/Utility';

export default function AboutUs() {
  // const navigate = useNavigate();
  const [userRecord, setUserRecord] = useState([]);

  console.log(userRecord, 'userRecord');
  const [loading, setloading] = useState(false);
  const [title, setTitle] = useState(userRecord?.title);
  const [heading, setHeading] = useState(userRecord?.heading);
  const [ptag, setPtag] = useState(userRecord?.ptag);

  // const [selectedbanerImage, setSelectedbanerImage] = useState(userRecord?.baner);
  const [base64Stringofbaner, setSubcategoryBasebaner] = useState(userRecord?.baner);

  // const [selectedImage, setSelectedImage] = useState(userRecord?.image_one);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(userRecord?.image_one);

  const [selectedTwoImage, setSelectedTwoImage] = useState(userRecord?.image_two);
  // const [base64Stringoftwo, setTwoSubcategoryBase64Image] = useState(userRecord?.image_two);

  console.log(base64Stringofsub, base64Stringofsub, 'shhsh');
  const getData = async () => {
    setloading(true);
    try {
      fetch(`${config.url}/admin/getaboutdata`, {
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
          console.log(data, 'data');
          if (data.message === 'get data successfully') {
            setUserRecord(data.getaboutus);
          }
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (userRecord) {
      setTitle(userRecord?.title);
      setHeading(userRecord?.heading);
      setPtag(userRecord?.ptag);
      // setSelectedImage(userRecord?.image_one);
      setSubcategoryBase64Image(userRecord?.image_one);
      setSelectedTwoImage(userRecord?.image_two);
      // setTwoSubcategoryBase64Image(userRecord?.image_two);
      // setSelectedbanerImage(userRecord?.baner);
      setSubcategoryBasebaner(userRecord?.baner);
    } else {
      setTitle('');
      setHeading('');
      setPtag('');
      // setSelectedImage("");
      setSelectedTwoImage('');
    }
  }, [userRecord]);

  const handleform = () => {
    setloading(true);
    const updatedUser = {
      title,
      heading,
      ptag,
      image_one: base64Stringofsub,
      image_two: selectedTwoImage,
      baner: base64Stringofbaner
    };
    console.log(updatedUser, 'updatedUser');
    fetch(`${config.url}/admin/updateaboutPageContent/${userRecord._id}`, {
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
        if (data.message === 'aboutus content update successfully') {
          toastifySuccess('aboutus content update successfully!');
          setloading(false);
        } else {
          toastifyError('aboutus content not update successfully!');
          setloading(false);
        }
        setloading(false);
      });
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    // setPtag(ptag => ({
    //   ...ptag,
    //   data,
    // }));
    setPtag(data);
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
      // setSelectedImage(file);
    }
  };
  const handlesubcategoryUpload2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Stringofsub = event.target.result;
        setSubcategoryBasebaner(base64Stringofsub);
      };
      reader.readAsDataURL(file);
      // setSelectedbanerImage(file);
    }
  };
  const handletowUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Stringoftwo = event.target.result;
        setSelectedTwoImage(base64Stringoftwo);
      };
      reader.readAsDataURL(file);
      // setSelectedTwoImage(file);
    }
  };

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update AboutUs content</h2>
          <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file15" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Breadcrumb Image (Recommended size 1920px x 435px)
                    <input type="file" id="file15" accept="image/*" onChange={handlesubcategoryUpload2} />
                  </label>
                </div>
                {base64Stringofbaner && (
                  <div className="preview_upload">
                    <h4>Image Preview</h4>
                    <img src={base64Stringofbaner} alt="Selected" />
                  </div>
                )}
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span className="admin_label">Title</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="title"
                  // label="title"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span className="admin_label">Heading</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="heading"
                  // label="heading"
                  name="heading"
                  value={heading}
                  onChange={(e) => {
                    setHeading(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            {/* <Grid item xs={6}>
                            <span>peragraph</span>
                            <FormControl fullWidth>
                                <TextField
                                    variant="outlined"
                                    id="ptag"
                                    // label="ptag"
                                    name="ptag"
                                    value={ptag}
                                    onChange={(e) => {
                                        setPtag(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid> */}
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <CKEditor editor={ClassicEditor} data={ptag} onChange={handleEditorChange} />
            </Grid>

            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file13" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Frist Image
                    <input type="file" id="file13" accept="image/*" onChange={handlesubcategoryUpload} />
                  </label>
                </div>
                {base64Stringofsub && (
                  <div className="preview_upload">
                    <h4>Image Preview</h4>
                    <img src={base64Stringofsub} alt="Selected" />
                  </div>
                )}
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file14" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Second Image
                    <input type="file" id="file14" accept="image/*" onChange={handletowUpload} />
                  </label>
                </div>
                {selectedTwoImage && (
                  <div className="preview_upload">
                    <h4>Image Preview</h4>
                    <img src={selectedTwoImage} alt="Selected" />
                  </div>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              {/* <Button className="global_dashbtn" onClick={handleform}>
                                Update
                            </Button> */}
              {loading ? (
                <Button className="global_dashbtn">
                  <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                </Button>
              ) : (
                <Button className="global_dashbtn" onClick={() => handleform()}>
                  Update
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
