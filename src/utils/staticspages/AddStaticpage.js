import { useState } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
// import { useEffect } from "react"
import {
  //  Card, CardBody,
  Form,
  Input,
  Button,
  Container
} from 'reactstrap';
// import JoditEditor from 'jodit-react';
// import { useRef } from 'react';
import {
  FormControl,
  // FormGroup, Input, InputLabel,
  //   TextField,
  //  makeStyles,
  Grid
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  // useLocation,
  useNavigate
} from 'react-router';
import config from 'config';
import { TextField } from '../../../node_modules/@mui/material/index';

const AddStaticpage = () => {
  const navigate = useNavigate();
  // const editor = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [message, setMessage] = useState('');

  const [post, setPost] = useState({
    title: '',
    content: '',
    language: '',
    url: '',
    status: ''
  });

  // const [image, setImage] = useState(null)

  const fieldChanged = (event) => {
    console.log(event.target.value);
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const contentFieldChanaged = (data) => {
    setPost({ ...post, content: data });
  };

  const createPost = (e) => {
    e.preventDefault();
    const imagepath = base64Image ? base64Image.split(',').pop() : '';

    fetch(`${config.url}/admin/addStaticdatabyAdmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify({
        title: post.title,
        language: "english",
        url: post.url,
        content: post.content,
        status: post.status,
        image: imagepath
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //   console.log(data, "hdhhdhd");
        //   alert("kdk")
        if (data.message === 'Static data added successfully') {
          // alert("dhdhdh")
          navigate(`${config.basename}/utils/staticpage`);
        } else {
          setMessage(data.message);
        }
      });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setBase64Image(base64String);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  // console.log(post.content,"shshhs")
  return (
    <div>
      <div>
        <Grid container sx={{ justifyContent: 'center' }}>
          <Grid item xl={8} lg={8} md={12} sm={12} xs={12} className=" ">
            <h3 className="top_heading_pages_text">Add New Static content</h3>
          </Grid>
          <Grid item xs={8} className="pages_global_background p-4">
            <Form onSubmit={createPost}>
              <Grid container>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <FormControl fullWidth>
                    <div className="file-uploader">
                      <label htmlFor="file20" className="global_file_upload_deisgn">
                        <InsertPhotoIcon />
                        Breadcrumb Image (Recommended size 1920px x 435px)
                        <input type="file" id="file20" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    {selectedImage && (
                      <div className="preview_upload">
                        <h4>Image Preview</h4>
                        <img src={base64Image} alt="Selected" style={{ maxWidth: '200px' }} />
                      </div>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <div>
                    <span htmlFor="title" className="admin_label">
                      Title
                    </span>
                    <TextField type="text" id="title" placeholder="Enter here" className="w-100" name="title" onChange={fieldChanged} />
                  </div>
                </Grid>
                {/* <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <div>
                    <span htmlFor="language" className="admin_label">
                      Language
                    </span>
                    <TextField
                      type="text"
                      id="language"
                      placeholder="Enter here"
                      className="w-100"
                      name="language"
                      onChange={fieldChanged}
                    />
                  </div>
                </Grid> */}
                <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <div>
                    <span htmlFor="url" className="admin_label">
                      Url
                    </span>
                    <TextField type="text" id="url" placeholder="Enter here" className="w-100" name="url" onChange={fieldChanged} />
                  </div>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <div className="">
                    <span htmlFor="url" className="admin_label">
                      Status
                    </span>
                    <Input
                      type="select"
                      id="status"
                      placeholder="Enter here"
                      className="rounded-0"
                      name="status"
                      onChange={fieldChanged}
                      defaultValue={0}
                    >
                      <option disabled value={0}>
                        Select Status
                      </option>
                      <option value={'active'}>Active</option>
                      <option value={'inactive'} name="language">
                        Inactive
                      </option>
                    </Input>
                  </div>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                  <CKEditor editor={ClassicEditor}
                  //  data={post.content} onChange={(newContent) => contentFieldChanaged(newContent)}
                   data={post.content}
                   onChange={(event, editor) => {
                     const newContent = editor.getData();
                     contentFieldChanaged(newContent);
                   }}
                    />
                </Grid>
              </Grid>

              {/* <div className="my-3">
              <span htmlFor="content">Content</span>

              <JoditEditor
                ref={editor}
                value={post.content}
                style={{ height: '500px' }}
                onChange={(newContent) => contentFieldChanaged(newContent)}
              />
            </div> */}

              <Grid item xl={12} lg={12} md={12} xs={12}></Grid>
              <Container className="text-end">
                <Button type="submit" className="global_dashbtn" color="primary">
                  Create Page
                </Button>
              </Container>
            </Form>
          </Grid>
        </Grid>
        {/* {JSON.stringify(post)} */}

        <h6 className="text-danger text-center">{message}</h6>
      </div>
    </div>
  );
};

export default AddStaticpage;
