// import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';

import {
  FormControl,
  // FormGroup, Input, InputLabel,  makeStyles,
  TextField,
  Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
// import {  useNavigate } from 'react-router';
// import { useState } from 'react';
// import axios from 'axios';
import config from 'config';

// const theme = createTheme();
import { toastifyError, toastifySuccess } from 'Utility/Utility';

export default function ApplinkUpdate() {
  // const navigate = useNavigate();
  const [userRecord, setUserRecord] = useState([]);

  const [loading, setloading] = useState(false);
  const [title, setTitle] = useState(userRecord?.title);
  const [content, setContent] = useState(userRecord?.content);
  const [heading, setHeading] = useState(userRecord?.heading);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(userRecord?.image);
  const [app_store_link, setApp_store_link] = useState(userRecord?.app_store_link);
  const [play_store_link, setPlay_store_link] = useState(userRecord?.play_store_link);

  // const [base64Stringoftwo, setTwoSubcategoryBase64Image] = useState(userRecord?.image_two);

  const getData = async () => {
    setloading(true);
    try {
      fetch(`${config.url}/admin/getAppLinkcontent`, {
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
            setUserRecord(data.getApplinkModel);
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
      setContent(userRecord?.content);
      setHeading(userRecord?.heading);
      setSubcategoryBase64Image(userRecord?.image);
      setApp_store_link(userRecord?.app_store_link);
      setPlay_store_link(userRecord?.play_store_link);
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
      content: content,
      heading: heading,
      app_store_link: app_store_link,
      play_store_link: play_store_link,
      location: location,
      image: base64Stringofsub
    };
    console.log(updatedUser, 'updatedUser');
    fetch(`${config.url}/admin/updateAppLinkcontent/${userRecord._id}`, {
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

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update App Link content</h2>
          <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">Tittle</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="mb-4 p-2">
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
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">Content</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  multiline
                  rows={4}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">App Store Link</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="app_store_link"
                  // label="app_store_link"
                  name="app_store_link"
                  value={app_store_link}
                  onChange={(e) => {
                    setApp_store_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">Play Store Link</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="play_store_link"
                  // label="Play_store_link"
                  name="play_store_link"
                  value={play_store_link}
                  onChange={(e) => {
                    setPlay_store_link(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <span className="admin_label mb-2">Right Image</span>
                <div className="file-uploader">
                  <label htmlFor="file6" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Upload Image
                    <input type="file" id="file6" accept="image/*" onChange={handlesubcategoryUpload} />
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
          </Grid>

          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              {/* <Button className="global_dashbtn" onClick={handleform}>
                                Update
                            </Button> */}
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
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
