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

export default function Updatecontect() {
  // const navigate = useNavigate();
  const [userRecord, setUserRecord] = useState([]);

  console.log(userRecord, 'userRecord');
  const [loading, setloading] = useState(false);
  const [title, setTitle] = useState(userRecord?.title);
  const [heading, setHeading] = useState(userRecord?.heading);
  // const [ptag, setPtag] = useState(userRecord?.ptag);
  const [base64Stringofbaner, setSubcategoryBasebaner] = useState(userRecord?.baner);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(userRecord?.image);
  const [email, setEmail] = useState(userRecord?.email);
  const [phone, setPhone] = useState(userRecord?.phone);
  const [location, setLocation] = useState(userRecord?.location);

  // const [base64Stringoftwo, setTwoSubcategoryBase64Image] = useState(userRecord?.image_two);

  const [titlewho, setTitlewho] = useState(userRecord?.who_we_are?.title);
  const [selectedTwoImage, setSelectedTwoImage] = useState(userRecord?.who_we_are?.image); //setHeadingwhosetPtag
  const [headwho, setHeadwho] = useState(userRecord?.who_we_are?.heading);
  const [ptagwho, setPtagwho] = useState(userRecord?.who_we_are?.ptag);

  console.log(base64Stringofsub, base64Stringofsub, 'shhsh');
  const getData = async () => {
    setloading(true);
    try {
      fetch(`${config.url}/admin/getContectUs`, {
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
            setUserRecord(data.getContectUs);
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
      // setPtag(userRecord?.who_we_are?.ptag);
      setSubcategoryBasebaner(userRecord?.baner);
      setSubcategoryBase64Image(userRecord?.image);
      setSelectedTwoImage(userRecord?.who_we_are?.image);
      setTitlewho(userRecord?.who_we_are?.title);
      setHeadwho(userRecord?.who_we_are?.heading);
      setPtagwho(userRecord?.who_we_are?.ptag);
      setLocation(userRecord?.location);
      setPhone(userRecord?.phone);
      setEmail(userRecord?.email);
      // setTwoSubcategoryBase64Image(userRecord?.image_two);setPhonesetEmail
      // setSelectedbanerImage(userRecord?.baner);
    } else {
      setTitle('');
      setHeading('');
      // setPtag("");
      // setSelectedImage("");
      setSelectedTwoImage('');
    }
  }, [userRecord]);

  const handleform = () => {
    setloading(true);
    const updatedUser = {
      title: title,
      heading: heading,
      email: email,
      phone: phone,
      location: location,
      image: base64Stringofsub,
      baner: base64Stringofbaner,
      who_we_are: { image: selectedTwoImage, title: titlewho, heading: headwho, ptag: ptagwho }
    };
    console.log(updatedUser, 'updatedUser');
    fetch(`${config.url}/admin/updateContectus/${userRecord._id}`, {
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
        if (data.message === 'Update contect us detail successfully') {
          toastifySuccess('Update contect us detail successfully!');
          setloading(false);
        } else {
          toastifyError('Not Update contect us detail successfully!');
          setloading(false);
        }
        setloading(false);
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
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    // setPtag(ptag => ({
    //   ...ptag,
    //   data,
    // }));
    setPtagwho(data);
  };

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update Contact Us content</h2>
          <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file7" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Breadcrumb Image (Recommended size 1920px x 435px)
                    <input type="file" id="file7" accept="image/*" onChange={handlesubcategoryUpload2} />
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
              <span>Title</span>
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
              <span>heading</span>
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
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span>Email</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="email"
                  // label="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span>Phone</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="phone"
                  // label="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span>Location</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="location"
                  // label="location"
                  name="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file8" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Form Background
                    <input type="file" id="file8" accept="image/*" onChange={handlesubcategoryUpload} />
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
              <span>title</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="title"
                  // label="title"
                  name="title"
                  value={titlewho}
                  onChange={(e) => {
                    setTitlewho(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12} className="mb-3 p-2">
              <span>heading</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="heading"
                  // label="heading"
                  name="heading"
                  value={headwho}
                  onChange={(e) => {
                    setHeadwho(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            {/* <Grid item xs={12}>
                            <span>peragraph</span>
                            <FormControl fullWidth>
                                <TextField
                                    variant="outlined"
                                    id="ptag"
                                    // label="ptag"
                                    name="ptag"
                                    value={ptagwho}
                                    onChange={(e) => {
                                        setPtagwho(e.target.value);
                                    }}
                                    multiline={true} // Enable multiline
                                    rows={10}
                                />
                            </FormControl>
                        </Grid> */}
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <CKEditor editor={ClassicEditor} data={ptagwho} onChange={handleEditorChange} />
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file9" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    who we are Image
                    <input type="file" id="file9" accept="image/*" onChange={handletowUpload} />
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
