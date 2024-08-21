import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';
import { FormControl, TextField, Grid, MenuItem, InputLabel, Select } from '@mui/material';

import { useNavigate } from 'react-router';
import { useState } from 'react';
import config from 'config';
import '../../App.css';

export default function PrivacyPolicy() {
  const [values, setValues] = useState({ title: '', content: '', });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleform = () => {
    console.log(base64Stringoftwo?.split(',').pop())
    fetch(`${config.url}/admin/addReviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify({
        name: values.name,
        reviews: values.reviews,
        ratting: values.ratting,
        role: values.role,
        image: base64Stringoftwo?.split(',').pop(),
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data, "hdhhdhd");
        if (data.message === 'Create reviews successfully') {
          navigate(`${config.basename}/utils/sitereview`);
        } else {
          setMessage(data.message);
        }
      });
  };

  return (
    <div>
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={10} sm={12} className="box">
          <h2 className="top_heading_pages_text text">Privacy And Policy</h2>
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField label="title" variant="outlined" id="title" name="title" value={values.title} onChange={handlechange} />
              </FormControl>
              {/* <p className="text-danger">{formerror.name}</p> */}
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  required
                  id="reviews"
                  name="reviews"
                  value={values.reviews}
                  onChange={handlechange}
                  label="reviews"
                  variant="outlined"
                  multiline={true} // Enable multiline
                  rows={20} // Specify the number of rows (minimum 50)
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  required
                  id="ratting"
                  name="ratting"
                  value={values.ratting}
                  onChange={handlechange}
                  label="ratting"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="suggestions-label">Role</InputLabel>
                <Select
                  labelId="suggestions-label"
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handlechange}
                  variant="outlined"
                >
                  <MenuItem value="Pilot">Pilot</MenuItem>
                  <MenuItem value="Poster">Poster</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <h4>Image </h4>
                <input type="file" accept="image/*" onChange={handletowUpload} />
                {selectedTwoImage && (
                  <div>
                    <h4>Selected Image:</h4>
                    <img src={base64Stringoftwo} alt="Selected" style={{ maxWidth: '200px' }} />
                  </div>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <Button className="global_dashbtn" onClick={handleform}>
                Add
              </Button>
            </Grid>
            <h6 className="text-danger text-center">{message}</h6>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
