
import {
    FormControl,
    //  FormGroup, Input, InputLabel,
    // Button,
    TextField,
    Grid
  } from '@mui/material';
  
  import {
    useLocation,
    // useNavigate
  } from 'react-router';
//   import { toastifyError, toastifySuccess } from 'Utility/Utility';
  import {useEffect,useState} from 'react';
  import config from 'config';
  
  export default function ViewPilotdata() {

    const location = useLocation();
  const userId = location.state;
  console.log(userId, "sjjs")

  const [filteredData, setFilteredData] = useState([]);

  console.log(filteredData, "shhs")
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/user/getpilotdatas`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        //   Authorization: `Bearer ${localStorage.jwt}`
        // },
        body: JSON.stringify({ userId: userId })
      })
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          if (data.message === "get data successfully") {
            setFilteredData(data.getUserdata);

            // setloading(false);
          }
          // setloading(false);
        });
    } catch (error) {
      console.log(error);
      // setloading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  
    return (
      <div>
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
          <Grid item xs={8} className="box">
            <h1 className="top_heading_pages_text">pilot Details</h1>
            <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="name" label="Name" name="name" value={filteredData?.first_name} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="email" label="Email" name="email" value={filteredData?.email} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="phone" label="Phone" name="phone" value={filteredData?.phone} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="status" label="Status" name="status" value={filteredData?.status} />
                </FormControl>
              </Grid>
  
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="street" label="Street" name="street" value={filteredData?.street} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="suburb" label="Suburb" name="suburb" value={filteredData?.Suburb} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="state" label="State" name="state" value={filteredData?.state} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="pincode" label="Pincode" name="pincode" value={filteredData?.pincode} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="country" label="Country" name="country" value={filteredData?.country} />
                </FormControl>
                <Grid item xs={12}>
                  <h2>Job Request data</h2>
                <Grid item xs={5}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="category" label="category" name="category" value={filteredData?.job_request?.category} />
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="extra_area_category" label="Extra Area Radius" name="extra_area_category" value={filteredData?.job_request?.extra_area_category} />
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="location" label="Location" name="location" value={filteredData?.job_request?.location} />
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="radius" label="Radius" name="radius" value={filteredData?.job_request?.radius} />
                </FormControl>
              </Grid>
                </Grid>
                <h3>Link</h3>
                <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="website_link" label="Website link" name="website_link" value={filteredData?.website_link} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="facebook_link" label="Facebook link" name="facebook_link" value={filteredData?.facebook_link} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="instagram_link" label="Instagram link" name="instagram_link" value={filteredData?.instagram_link} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="twitter_link" label="Twiter link" name="twitter_link" value={filteredData?.twitter_link} />
                </FormControl>
              </Grid>
              <h3>Equipment</h3>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="camera_specification" label="Camera specification" name="camera_specification" value={filteredData?.equipment?.camera_specification} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="drone" label="Drone" name="drone" value={filteredData?.equipment?.drone} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="payload" label="Payload" name="payload" value={filteredData?.equipment?.payload} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField variant="outlined" id="specification" label="Specification" name="specification" value={filteredData?.equipment?.specification} />
                </FormControl>
              </Grid>
              <Grid item xs ={12}>
              <img src={filteredData?.image} alt="user images" style={{ maxWidth: '200px' }} />
                <Grid/>
                <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
              {/* <Grid item xs={12}>
                <Button className="global_dashbtn" onClick={handleform}>
                  View Qualification
                </Button>
              
              </Grid> */}
            </Grid>
              </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  