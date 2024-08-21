import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';
import { FormControl, TextField, Grid, MenuItem, InputLabel, Select } from '@mui/material';

import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import config from 'config';
import '../../App.css';
import { useLocation } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { axiosInstance } from 'Utility/Api';
import { LoadingDashBTN, toastifyError, toastifySuccess } from 'Utility/Utility';
export default function AddQA() {
  const data = useLocation();
  console.log("data",data)
  const updData = data.state ? data.state.data : null;
  const [values, setValues] = useState({ quetion: '', answer: '', suggestions: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (updData?._id) {
      setValues({
        ...values,faq_id : updData?._id, quetion: updData.quetion, answer: updData.answer, suggestions: updData.suggestions
      })
    }else{
      setValues({
        ...values, quetion: '', answer: '', suggestions: ''
      })
    }
  }, [updData])
  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
  const handleform = () => {
    fetch(`${config.url}/admin/addQa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify({
        quetion: values.quetion,
        answer: values.answer,
        suggestions: values.suggestions
      })
    }).then((res) => {
      return res.json();
    })
      .then((data) => {
        if (data.message === 'Question created successfully') {
          navigate(`${config.basename}/utils/questionAnswer`);
        } else {
          setMessage(data.message);
        }
      });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setValues(prevValue => ({
      ...prevValue,
      answer: data,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.post('admin/updatefaq', values)
      if (res.data.status == 200) {
        toastifySuccess("FAQ Updated Successfully !!")
        navigate('/admin/utils/questionAnswer')
        setLoading(false)
      } else {
        setLoading(false)
        toastifyError("Something Wen't Wrong !!")
      }
    } catch (error) {
        setLoading(false)
        toastifyError("Something Wen't Wrong !!")
    }
  }

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={10} sm={12} className="box">
          <h2 className="top_heading_pages_text text">Add Question Answer</h2>
          <Grid className="pages_global_background p-4">
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField label="Question" variant="outlined" id="quetion" name="quetion" value={values.quetion} onChange={handlechange} />
              </FormControl>
              {/* <p className="text-danger">{formerror.quetion}</p> */}
            </Grid>

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <CKEditor
                editor={ClassicEditor}
                data={values.answer}
                onChange={handleEditorChange}
              />
            </Grid>

            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <InputLabel id="suggestions-label">Suggestions</InputLabel>
                <Select
                  labelId="suggestions-label"
                  id="suggestions"
                  name="suggestions"
                  value={values.suggestions}
                  onChange={handlechange}
                  variant="outlined"
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">false</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              {
                loading ? <LoadingDashBTN /> :
                updData?._id ?
                  <Button className="global_dashbtn" onClick={handleUpdate}>Update</Button> :
                  <Button className="global_dashbtn" onClick={handleform}>Add</Button>
              }
            </Grid>
            <h6 className="text-danger text-center">{message}</h6>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
