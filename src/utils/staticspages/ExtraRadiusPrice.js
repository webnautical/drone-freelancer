import React, { useState, useEffect } from 'react';
import { Grid, Button, FormControl, TextField } from '@mui/material';
import config from 'config';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import Textarea from '@mui/material/TextareaAutosize';
export default function ExtraRadiusPrice() {
  const [formData, setFormData] = useState({
    price: '',
    agreeCheckbox: '',
    empOpportunities: '',
    contactByEmail: ''
  });
  const { price, agreeCheckbox, empOpportunities, contactByEmail } = formData;
  const getData = async () => {
    try {
      const response = await fetch(`${config.url}/admin/getExtraPricedata`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      });
      const data = await response.json();
      if (data.message === 'get data successfully') {
        const userRecord = data.getdatas[0];
        setFormData({
          price: userRecord.price || '',
          agreeCheckbox: userRecord.agreeCheckbox || '',
          empOpportunities: userRecord.empOpportunities || '',
          contactByEmail: userRecord.contactByEmail || ''
        });
      }
    } catch (error) {
      console.log(error);
      toastifyError('Failed to fetch data');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrUpdateGeneralOption = async () => {
    try {
      const updatedUser = { price, agreeCheckbox, empOpportunities, contactByEmail };
      const response = await fetch(`${config.url}/admin/createOrUpdateGeneralOption`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedUser)
      });
      const data = await response.json();
      if (data.message === 'Data updated successfully') {
        toastifySuccess('Data Updated successfully!');
      } else {
        toastifyError('Failed to update data');
      }
    } catch (error) {
      console.log(error);
      toastifyError('Failed to update data');
    }

  };


  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={12} sm={12} xs={12} className="box">
          <h2 className="top_heading_pages_text">General Options</h2>
          <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
            <Grid item xs={12} className=" p-2">
              <div className="d-flex align-itmes-center ">
                <strong>Set Price per category for unlimited radius would be: $___</strong>
              </div>
            </Grid>
            <Grid item xs={6} className="mb-4 p-2">
              <span className="admin_label">Set price</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="price"
                  name="price"
                  value={price}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
           
           
            <Grid item xs={6} className="mb-4 p-2">
              <span className="admin_label">Contact by Email</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="contactByEmail"
                  name="contactByEmail"
                  value={contactByEmail}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">Agree Check Box</span>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="agreeCheckbox"
                  name="agreeCheckbox"
                  value={agreeCheckbox}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="mb-4 p-2">
              <span className="admin_label">Employee Opportunities</span>
              <FormControl fullWidth>
                <Textarea
                  variant="outlined"
                  name="empOpportunities"
                  id="empOpportunities"
                  value={empOpportunities}
                  onChange={handleChange}
                  maxLength={1200}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <Button className="global_dashbtn" onClick={createOrUpdateGeneralOption}>
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}