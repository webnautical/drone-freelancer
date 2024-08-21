import {
  FormControl,
  //  FormGroup, Input, InputLabel,
  Button,
  TextField,
  Grid,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router";
import { toastifyError, toastifySuccess } from "Utility/Utility";

import config from "config";

export default function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const Userdata = location.state;
  const handleform = () => {
    if (Userdata.qualification_id !== "") {
      toastifySuccess("get Qualification data successfully!");
      navigate(`${config.basename}/viewqualification`, {
        state: Userdata?.qualification_id,
      });
    } else {
      toastifyError("Qualifiction data not updated by User!");
    }
  };

  console.log("Userdata", Userdata)

  return (
    <div>
      <Grid
        className="details_temp"
        container
        spacing={2}
        style={{ justifyContent: "center" }}
      >
        <Grid item xs={8} className="box p-0">
          <Grid container sx={{ my: 2 }} style={{ textAlign: "end" }}>
            <Grid item xs={12}>
              <div className="page_heading d-flex justify-content-between align-items-center">
                <h5>Pilot Information</h5>
                <Button className="global_dashbtn" onClick={handleform}>
                  View Qualification
                </Button>
              </div>
              {/* <Button className="global_dashbtn" onClick={handleform}>
                View Portfolio
              </Button> */}
            </Grid>
          </Grid>
          <Grid
            className="pages_global_background pe-3 px-3"
            container
            spacing={2}
            sx={{ my: 1 }}
          >
            <Grid item xs={12} className="p-0">
              <h1 className="top_heading_pages_text">User Info</h1>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Name</h3>
                <p>{Userdata.first_name} {Userdata.last_name}</p>
                {/* <TextField variant="outlined" id="name" label="Name" name="name" value= /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Email</h3>
                <p>{Userdata.email}</p>
                {/* <TextField variant="outlined" id="email" label="Email" name="email" value={Userdata.email} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Phone Number</h3>
                <p>{Userdata.phone}</p>
                {/* <TextField variant="outlined" id="phone" label="Phone" name="phone" value={Userdata.phone} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>User Status</h3>
                {Userdata.status}
                {/* <TextField variant="outlined" id="status" label="Status" name="status" value={Userdata.status} /> */}
              </FormControl>
            </Grid>

            <Grid item xs={6} className="px-0">
              <h3>Location</h3>
              <FormControl fullWidth>
                <p>{Userdata.location}</p>
                {/* <TextField variant="outlined" id="street" label="Street" name="street" value={Userdata.street} /> */}
              </FormControl>
            </Grid>

            <Grid item xs={6} className="px-0">
              <h3>Country</h3>
              <FormControl fullWidth>
                <p> {Userdata.country}</p>
                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={Userdata.country} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={12} className="px-0">
              <h3>Specilization</h3>
              <FormControl fullWidth>
                <p>{Userdata.specilization && Userdata.specilization.join(', ')}</p>
                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={Userdata.country} /> */}
              </FormControl>
            </Grid>

            <Grid className="p-0" item xs={12}>
              <h1 className="top_heading_pages_text">Job Request data</h1>
            </Grid>
            {/* <Grid item xs={6} className="px-0">
              <Grid item xs={5}>
                <h3>Pilot Category</h3>
                <FormControl fullWidth>
                  <p>{Userdata.job_request?.category}</p>
                </FormControl>
              </Grid>
            </Grid> */}
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Extra Category</h3>
                {
                  Userdata?.extra_area_category?.map((item, i) => (
                    <p key={i}>{item}</p>
                  ))
                }
              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Post Job Location</h3>
                <p>{Userdata?.location}</p>
                {/* <TextField variant="outlined" id="location" label="Location" name="location" value={Userdata.job_request?.location} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={5} className="px-0">
              <h3>Job Radius</h3>
              <FormControl fullWidth>
                <p>{Userdata?.radius}</p>
                {/* <TextField variant="outlined" id="radius" label="Radius" name="radius" value={Userdata.job_request?.radius} /> */}
              </FormControl>
            </Grid>

            <Grid className="p-0" item xs={12}>
              <h1 className="top_heading_pages_text">Links</h1>
            </Grid>

            <Grid item xs={4} className="p-2">
              <FormControl fullWidth>
                {/* <p>{Userdata.website_link}</p> */}
                <TextField
                  variant="outlined"
                  id="website_link"
                  label="Website link"
                  name="website_link"
                  value={Userdata.website_link}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className="p-2">
              <FormControl fullWidth>
                {/* <p>{Userdata.facebook_link}</p> */}
                <TextField
                  variant="outlined"
                  id="facebook_link"
                  label="Facebook link"
                  name="facebook_link"
                  value={Userdata.facebook_link}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className="p-2">
              <FormControl fullWidth>
                {/* <p>{Userdata.instagram_link}</p> */}
                <TextField
                  variant="outlined"
                  id="instagram_link"
                  label="Instagram link"
                  name="instagram_link"
                  value={Userdata.instagram_link}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className="p-2">
              <FormControl fullWidth>
                {/* <p>{Userdata.twitter_link} </p> */}
                <TextField
                  variant="outlined"
                  id="twitter_link"
                  label="Twiter link"
                  name="twitter_link"
                  value={Userdata.twitter_link}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className="p-2">
              <FormControl fullWidth>
                {/* <p>{Userdata.twitter_link} </p> */}
                <TextField
                  variant="outlined"
                  id="tiktok_link"
                  label="Twiter link"
                  name="tiktok_link"
                  value={Userdata.tiktok_link}
                />
              </FormControl>
            </Grid>
            <Grid className="p-0" item xs={12}>
              <h1 className="top_heading_pages_text">Equipment</h1>
            </Grid>
            <Grid item xs={6} className="px-0">
              <FormControl fullWidth>
                <h3>Camera Specification</h3>
                <p>{Userdata.equipment?.camera_specification}</p>

              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <h3>Drone Used</h3>
              <FormControl fullWidth>
                <p>{Userdata.equipment?.drone} </p>
                {/* <TextField variant="outlined" id="drone" label="Drone" name="drone" value={Userdata.equipment?.drone} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6} className="px-0">
              <h3>Payload</h3>
              <FormControl fullWidth>
                <p>{Userdata.equipment?.payload}</p>
                {/* <TextField variant="outlined" id="payload" label="Payload" name="payload" value={Userdata.equipment?.payload} /> */}
              </FormControl>
            </Grid>
            {
              Userdata.image !== '' &&
              <Grid item xs={12}>
                <img
                  src={Userdata.image}
                  alt="user images"
                  style={{ maxWidth: "200px" }}
                />
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
