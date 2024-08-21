import { FormControl, Grid } from '@mui/material';
import { useLocation } from 'react-router'
export default function AnimalRescueDetails() {
    const location = useLocation();
    const details = location.state.data ? location.state.data : null;
    return (
        <div>
            <Grid className="details_temp" container spacing={2} style={{ justifyContent: 'center' }}>
                <Grid item xs={8} className="box">
                    <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
                        <Grid item xs={12}>
                            <div className="page_heading d-flex justify-content-between align-items-center">
                                <h5>Animal Rescue Information</h5>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={12} className="px-3">
                            <h1 className="top_heading_pages_text">Animal Rescue Information</h1>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Name</h3>
                                <p>{details.first_name} {details.name}</p>
                                {/* <TextField variant="outlined" id="name" label="Name" name="name" value= /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Email</h3>
                                <p>{details.email}</p>
                                {/* <TextField variant="outlined" id="email" label="Email" name="email" value={details.email} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Phone Number</h3>
                                <p>{details.phone}</p>
                                {/* <TextField variant="outlined" id="phone" label="Phone" name="phone" value={details.phone} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Location</h3>
                            <FormControl fullWidth>
                                <p>{details.location}</p>
                                {/* <TextField variant="outlined" id="pincode" label="Pincode" name="pincode" value={details.pincode} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>City</h3>
                                {details.city}
                                {/* <TextField variant="outlined" id="status" label="Status" name="status" value={details.status} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>State</h3>
                            <FormControl fullWidth>
                                <p>{details.state}</p>
                                {/* <TextField variant="outlined" id="pincode" label="Pincode" name="pincode" value={details.pincode} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>affected by a natural disaster.</h3>
                            <FormControl fullWidth>
                                <p>{details.natural_disaster
                                }</p>
                                {/* <TextField variant="outlined" id="street" label="Street" name="street" value={details.street} /> */}
                            </FormControl>
                        </Grid>



                        <Grid item xs={6}>
                            <h3>Disaster name</h3>
                            <FormControl fullWidth>
                                <p> {details.disaster_name}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>have been evacuated.*
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.evacuated}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>following animal missing
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.animal_type}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>animal Owner.
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.my_animal}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <h3>If he / She Owner pet details.
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.whos_animal}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <h3>when and where the animal was last seen
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.last_seen_details}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <h3>What kind of help animals need?
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.help_type}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <h3>animal have a microchip?
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.microchip}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>chip number?

                            </h3>
                            <FormControl fullWidth>
                                <p> {details.chip_number}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>wearing a collar?


                            </h3>
                            <FormControl fullWidth>
                                <p> {details.wearing_collar}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>collar description


                            </h3>
                            <FormControl fullWidth>
                                <p> {details.collar_describe}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>


                        <Grid item xs={6}>
                            <h3>ASSERT volunteers
                            </h3>
                            <FormControl fullWidth>
                                <p> {details.assert_volunteers}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3>Created Date

                            </h3>
                            <FormControl fullWidth>
                                <p> {details.created_at}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={details.country} /> */}
                            </FormControl>
                        </Grid>

                        {/* <Grid item xs={12}>
                            <img src={details.image} alt="user images" style={{ maxWidth: '200px' }} />
                            <Grid />
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
