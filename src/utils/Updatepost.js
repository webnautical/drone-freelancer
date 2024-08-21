
import Button from '@mui/material/Button';

import {
  FormControl,
  // FormGroup, Input, InputLabel,  makeStyles,
  TextField,
  Grid
} from '@mui/material';

import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
// import axios from 'axios';
import config from 'config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const theme = createTheme();

export default function Updatepost() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRecord = location.state.data;
  console.log(userRecord, "userRecorduserRecord")
  const [jobname, setjobname] = useState(userRecord?.job_details?.name);
  const [work_due_date, setwork_due_date] = useState(userRecord.work_due_date);
  const [task_description, settask_description] = useState(userRecord?.job_details?.task_description);
  const [street, setStreet] = useState(userRecord.street);
  // const [state, setState] = useState(userRecord.state);
  const [locations, setlocation] = useState(userRecord.location);
  
  const [
    phone
    //  setPhone
  ] = useState(userRecord.phone);

  const handleform = () => {
    const address = {
      street: street,
      //   location: location,

    };
    const updatedUser = {
      first_name,
      work_due_date,
      email,
      phone,
      address: address,

    };
    fetch(`${config.url}/admin/updatejobbyadmin/${userRecord._id}`, {
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
        if (data.message === 'Update UserProfile successfully') {
          navigate(`${config.basename}/utils/usermangement`);
        } else {
          setMessage('error occured');
        }
      });
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    // setPtag(ptag => ({
    //   ...ptag,
    //   data,
    // }));
    settask_description(data)
  };

  return (
    <div>
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update job</h2>
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="jobname"
                  label="Job title"
                  name="jobname"
                  value={jobname}
                  onChange={(e) => {
                    setjobname(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="work_due_date"
                  label="Work due date"
                  name="work_due_date"
                  value={work_due_date}
                  onChange={(e) => {
                    setwork_due_date(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="location"
                  label="location"
                  name="location"
                  value={locations}
                  onChange={(e) => {
                    setlocation(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="street"
                  label="Street"
                  name="street"
                  value={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <CKEditor
                editor={ClassicEditor}
                data={task_description}
                onChange={handleEditorChange}
              />
            </Grid>



          </Grid>

          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <Button className="global_dashbtn" onClick={handleform}>
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
