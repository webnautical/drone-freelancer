import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';
import { FormControl, TextField, Grid, MenuItem, InputLabel, Select } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import config from 'config';
import '../../App.css';

export default function SiteReviews() {
  const [values, setValues] = useState({ name: '', reviews: '', ratting: 0, role: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [selectedTwoImage, setSelectedTwoImage] = useState('');
  const [base64Stringoftwo, setTwoSubcategoryBase64Image] = useState('');
  //   console.log(base64Stringoftwo,"kk",selectedTwoImage)
  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleform = () => {
    console.log(base64Stringoftwo?.split(',').pop());
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
        image: base64Stringoftwo?.split(',').pop()
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
  const handletowUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Stringoftwo = event.target.result;
        setTwoSubcategoryBase64Image(base64Stringoftwo);
      };
      reader.readAsDataURL(file);
      setSelectedTwoImage(file);
    }
  };
  return (
    <div>
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={10} sm={12} className="box">
          <h2 className="top_heading_pages_text text">Add Reviews</h2>
          <Grid className="pages_global_background p-4" container>
            <Grid item xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <div className="file-uploader">
                  <label htmlFor="file12" className="global_file_upload_deisgn">
                    <InsertPhotoIcon />
                    Add User Image
                    <input type="file" id="file12" accept="image/*" onChange={handletowUpload} />
                  </label>
                </div>
                {selectedTwoImage && (
                  <div className="preview_upload">
                    <h4>Image Preview</h4>
                    <img src={base64Stringoftwo} alt="Selected" />
                  </div>
                )}
              </FormControl>
            </Grid>
            <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <TextField label="name" variant="outlined" id="name" name="name" value={values.name} onChange={handlechange} />
              </FormControl>
              {/* <p className="text-danger">{formerror.name}</p> */}
            </Grid>
            <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className="mb-3 p-2">
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
            <Grid item xl={4} lg={4} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <InputLabel id="suggestions-label">Role</InputLabel>
                <Select labelId="suggestions-label" id="role" name="role" value={values.role} onChange={handlechange} variant="outlined">
                  <MenuItem value="Pilot">Pilot</MenuItem>
                  <MenuItem value="Poster">Poster</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
              <FormControl fullWidth>
                <TextField
                  required
                  id="reviews"
                  name="reviews"
                  value={values.reviews}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Split the input value into words
                    const words = inputValue.trim().split(/\s+/);

                    // Set the maximum word count (change this value as needed)
                    const maxWordCount = 100;

                    // Check if the current word count is within the maximum limit
                    if (words.length <= maxWordCount) {
                      handlechange(e); // Call the original handlechange function
                    } else {
                      // If the word count exceeds the maximum, truncate the input or handle it accordingly
                      const truncatedInput = words.slice(0, maxWordCount).join(' ');
                      const eventWithTruncatedInput = { ...e, target: { ...e.target, value: truncatedInput } };
                      handlechange(eventWithTruncatedInput); // Call the original handlechange function with truncated input
                    }
                  }}
                  label="reviews"
                  variant="outlined"
                  multiline={true} // Enable multiline
                  rows={5} // Specify the number of rows (minimum 50)
                />
              </FormControl>
            </Grid>

            {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <TextField
                  required
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handlechange}
                  label="role"
                  variant="outlined"
                  multiline={true} // Enable multiline
                  rows={20} // Specify the number of rows (minimum 50)
                />
              </FormControl>
            </Grid> */}
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
