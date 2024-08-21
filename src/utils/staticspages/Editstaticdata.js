import { useState } from 'react';
// import { useEffect } from "react"
import { Form, Input, Button } from 'reactstrap';
// import JoditEditor from 'jodit-react';
// import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
// import { toast } from "react-toastify"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import {
  FormControl,
  // FormGroup, Input, InputLabel,
  // TextField,
  //  makeStyles,
  Grid
} from '@mui/material';
import config from 'config';

const Editstaticdata = () => {
  // const editor = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const staticdata = location.state.data;
  const [selectedImage, setSelectedImage] = useState(staticdata?.image);
  const [base64Stringofsub, setSubcategoryBase64Image] = useState(staticdata?.image);
  const [title, setTitle] = useState(staticdata?.title);
  // const [language, setLanguage] = useState(staticdata?.language);
  const [url, setUrl] = useState(staticdata?.url);
  const [status] = useState(staticdata?.status);
  const [content, setContent] = useState(staticdata?.content);
  const [content2, setContent2] = useState(staticdata?.content2);
  const [message, setMessage] = useState('');

  // console.log(content,"djjdj")

  // const fieldChanged = (event) => {
  //     console.log(event.target.value)
  //     setPost({ ...post, [event.target.name]: event.target.value })
  // }

  const contentFieldChanaged = (newContent) => {
    setContent(newContent);
  };
  const contentFieldChanaged2 = (newContent) => {
    setContent2(newContent);
  };

  const handleform = (e) => {
    e.preventDefault();
    const updatedUser = {
      title,
      language: staticdata?.language,
      status,
      url: url,
      content: content,
      content2: content2,
      image: base64Stringofsub.split(',').pop()
    };
    console.log(updatedUser);
    fetch(`${config.url}/admin/updateStaticdataById/${staticdata._id}`, {
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
        if (data.message === 'Data Updated successfully') {
          navigate(`${config.basename}/utils/staticpage`);
        } else {
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
    <Grid container sx={{ justifyContent: 'center' }}>
      <Grid item xs={8}>
        <h3 className="top_heading_pages_text">Edit {title} content</h3>
        <Grid container className="pages_global_background p-4">
          <h6 className="text-danger text-center">{message}</h6>
          <Form onSubmit={handleform}>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {
                staticdata?._id != "664ddc5f754a53bdeae80297" &&
                <Grid container sx={{ justifyContent: 'center' }}>
                  {url === 'splash_screen_one' || url === 'splash_screen_two' || url === 'splash_screen_three' ? null : (
                    <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                      <FormControl fullWidth>
                        <div className="file-uploader" style={{ backgroundImage: `url(${base64Stringofsub})` }}>
                          <label htmlFor="file" className="global_file_upload_deisgn">
                            <InsertPhotoIcon />
                            Choose Image
                            <input type="file" id="file" accept="image/*" onChange={handlesubcategoryUpload} />
                          </label>
                        </div>
                        {selectedImage && (
                          <div className="preview_upload">
                            <h4>Image Preview</h4>
                            <img src={base64Stringofsub} alt="Selected" />
                          </div>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              }

              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                <div className="">
                  <span htmlFor="title">Title</span>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter here"
                    className="rounded-0"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

              </Grid>

              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                <div className="">
                  <span htmlFor="title">Url</span>
                  <Input
                    type="text"
                    id="url"
                    placeholder="Enter here"
                    className="rounded-0"
                    name="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                    }}
                  />
                </div>

              </Grid>

              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event, editor) => {
                    const newContent = editor.getData();
                    contentFieldChanaged(newContent);
                  }}
                />
              </Grid>

              {
                staticdata?.url == 'how-it-works' ||  staticdata?.url == 'why-drone-freelancer' &&
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <CKEditor
                    editor={ClassicEditor}
                    data={content2}
                    onChange={(event, editor) => {
                      const newContent = editor.getData();
                      contentFieldChanaged2(newContent);
                    }}
                  />
                </Grid>
              }
            </Grid>
            <div className="text-end mt-3">
              <Button type="submit" className="global_dashbtn">
                Update
              </Button>
            </div>
          </Form>
        </Grid>

      </Grid>
    </Grid>
  );
};

export default Editstaticdata;
