import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';
import { FormControl, TextField, Grid, } from '@mui/material';

import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import config from 'config';
import '../App.css';
import { LoadingDashBTN, toastifyError, toastifySuccess } from 'Utility/Utility';

export default function SendMessagetouser() {
  const location = useLocation();
  const Userdata = location.state;
  const [values, setValues] = useState({ subject: '', message: '', });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleform = () => {
    setLoading(true)
    fetch(`${config.url}/admin/sendMessage/${Userdata?._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.jwt}` },
      body: JSON.stringify({
        subject: values.subject,
        message: values.message
      })
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.status === 200) {
        toastifySuccess('Message send successfully !!')
        navigate(-1);
        setLoading(false)
      } else {
        setMessage(data.message);
        toastifyError(data.message)
        setLoading(false)
      }
    });
  };

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xl={8} lg={8} md={10} sm={12} className="box">
          <h2 className="top_heading_pages_text text">Send mail to user</h2>
          <Grid className="pages_global_background p-4">
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField label="Mail Subject" variant="outlined" id="subject" name="subject" value={values.subject} onChange={handlechange} />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  required
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={handlechange}
                  label="Mail mesaage Content"
                  variant="outlined"
                  multiline={true}
                  rows={20}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              {
              loading ? <LoadingDashBTN /> : 
              <Button className="global_dashbtn" onClick={handleform}>Send</Button>
              }
            </Grid>
            <h6 className="text-danger text-center">{message}</h6>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
