import {
    FormControl,
    //  FormGroup, Input, InputLabel,
    Button,
    // TextField,
    Grid
} from '@mui/material';

import {
    useLocation,
     useNavigate
} from 'react-router';
import { useState, useEffect } from 'react';
import config from 'config';
//   import { toastifyError, toastifySuccess } from 'Utility/Utility';


export default function ViewProduct() {
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState([]);
    const location = useLocation();
    const productdtetail = location.state;
    console.log(filteredData, 'hshsh');
    // const [productdtetail, setproductdtetail] = useState([]);
    const getData = async () => {
        // setloading(true);
        try {
          fetch(`${config.url}/user/getUserbyId`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.jwt}`
            },
            body: JSON.stringify({userId:productdtetail?.user_id})
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
                console.log(data,"data")
              if (data.message === 'get data successfully') {
                setFilteredData(data.getUserdata);
                // setUserList(data.userRecord);
                // setloading(false);
              }
            //   setloading(false);
            });
        } catch (error) {
          console.log(error);
        //   setloading(false);
        }
      };
      useEffect(() => {
        getData();
      }, []);
    const handleform = () => {
          navigate(`${config.basename}/user-details`, {
            state: filteredData
          });
     
      };

    return (
        <div>
            <Grid className="details_temp" container spacing={2} style={{ justifyContent: 'center' }}>
                <Grid item xs={8} className="box">
                    <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
                        <Grid item xs={12}>
                            <div className="page_heading d-flex justify-content-between align-items-center">
                                <h5>Product Details</h5>
                            </div>

                        </Grid>
                    </Grid>
                    <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={12} className="p-0">
                            <h1 className="top_heading_pages_text">Product</h1>
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Posted By</h3>
                            <FormControl fullWidth>
                                <p> {filteredData?.first_name}</p>
                                {/* <TextField variant="outlined" id="country" label="Country" name="country" value={productdtetail.country} /> */}
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <Button className="global_dashbtn" onClick={handleform}>
                                View Pilot profile
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Product Title</h3>
                                <p> {productdtetail.title}</p>
                                {/* <TextField variant="outlined" id="name" label="Name" name="name" value= /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Product Location</h3>
                                <p> {productdtetail.location}</p>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Price</h3>
                                <p>{productdtetail.price}</p>
                                {/* <TextField variant="outlined" id="email" label="Email" name="email" value={productdtetail.email} /> */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <h3>Description</h3>
                                {/* <p>{productdtetail.description}</p> */}
                                <div dangerouslySetInnerHTML={{ __html: productdtetail?.description}} />
                                {/* <TextField variant="outlined" id="phone" label="Phone" name="phone" value={productdtetail.phone} /> */}
                            </FormControl>
                        </Grid>


                        <Grid item xs={6}>
                            <h3>Status</h3>
                            <FormControl fullWidth>
                                <p>{productdtetail.product_approval}</p>
                                {/* <TextField variant="outlined" id="street" label="Street" name="street" value={productdtetail.street} /> */}
                            </FormControl>
                        </Grid>


                        <Grid item xs={12}>
                            <h3>Image</h3>
                            <FormControl fullWidth>
                                {productdtetail?.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`product ${index + 1}`} 
                                         style={{
                                            width: '300px', 
                                            height: '200px',
                                            // objectFit: 'cover', 
                                          }}
                                        />
                                    </div>
                                ))}
                            </FormControl>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
