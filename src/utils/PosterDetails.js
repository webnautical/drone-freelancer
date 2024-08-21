import { FormControl, Grid } from '@mui/material';

import { useLocation } from 'react-router';

export default function PosterDetails() {
  const location = useLocation();
  const Userdata = location.state;
  console.log("Userdata", Userdata)
  return (
    <div>
      <Grid className="details_temp" container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <div className="page_heading d-flex justify-content-between align-items-center">
                <h5>Poster Information</h5>

              </div>

            </Grid>
          </Grid>
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={12} className="p-0">
              <h1 className="top_heading_pages_text">User Info</h1>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Name</h3>
                <p>{Userdata.first_name} {Userdata.last_name}</p>
                {/* <TextField variant="outlined" id="name" label="Name" name="name" value= /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Email</h3>
                <p>{Userdata.email}</p>
                {/* <TextField variant="outlined" id="email" label="Email" name="email" value={Userdata.email} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Phone Number</h3>
                <p>{Userdata.phone}</p>
                {/* <TextField variant="outlined" id="phone" label="Phone" name="phone" value={Userdata.phone} /> */}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <h3>Street</h3>
              <FormControl fullWidth>
                <p>{Userdata.street}</p>
                {/* <TextField variant="outlined" id="street" label="Street" name="street" value={Userdata.street} /> */}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <h3>State</h3>
              <FormControl fullWidth>
                <p>{Userdata.state}</p>
                {/* <TextField variant="outlined" id="pincode" label="Pincode" name="pincode" value={Userdata.pincode} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <h3>Country</h3>
              <FormControl fullWidth>
                <p> Australia</p>
                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={Userdata.country} /> */}
              </FormControl>
            </Grid>

            {
              Userdata.image !== '' &&
              <Grid item xs={12}>
                <img src={Userdata.image} alt="user images" style={{ maxWidth: '200px' }} />
              </Grid>
            }

          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
