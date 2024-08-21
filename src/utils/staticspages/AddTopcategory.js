import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';
import { FormControl, Grid, MenuItem, InputLabel, Select } from '@mui/material';

import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import config from 'config';
import '../../App.css';

export default function AddTopcategory() {
  const [values, setValues] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState([]);

  const handlechange = (item) => {
    console.log(item);
    setValues(item);
  };
  console.log(values, 'values');
  const handleform = () => {
    console.log(values, 'values');
    fetch(`${config.url}/admin/addTopcategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify({
        category_id: values
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data, "hdhhdhd");
        if (data.message === 'Create top category successfully') {
          navigate(`${config.basename}/utils/topcategory`);
        } else {
          setMessage(data.message);
        }
      });
  };

  const getData = async () => {
    // setLoading(true);
    try {
      fetch(`${config.url}/admin/getAllJobCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res, 'jsjsjsjsj');
          if (res.message === 'get category data successfully') {
            setFilteredData(res.getCategory);

            // setLoading(false);
          }
          // setLoading(false);
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={10} sm={12} className="box">
          <h2 className="top_heading_pages_text text">Add new Category</h2>
          <Grid className="pages_global_background p-4" container>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="suggestions-label">category</InputLabel>
                <Select
                  labelId="suggestions-label"
                  id="category"
                  name="category"
                  value={values._id}
                  onChange={(e) => handlechange(e.target.value)} // Fix: pass e.target.value directly
                  variant="outlined"
                >
                  {filteredData.map((item) => (
                    <MenuItem key={item.id} value={item._id}>
                      {item.category_name}
                    </MenuItem>
                  ))}
                </Select>
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
