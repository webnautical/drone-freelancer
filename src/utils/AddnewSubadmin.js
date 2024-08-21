import { useState } from 'react';
// import { useEffect } from "react"
import { Form, Button, Container } from 'reactstrap';

import {  useNavigate } from 'react-router';
// import { toast } from "react-toastify"
import {
    FormControl,
    // FormGroup, Input, InputLabel,
    // ListItemText,
    // Checkbox,
    // MenuItem,
    // Select,
    Grid
} from '@mui/material';
import config from 'config';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
const AddnewSubadmin = () => {
    const navigate = useNavigate();
    const [selectedImage, setSubcategoryBase64Image] = useState('');
    const [subadmin, setSubadmin] = useState('');
    const [email, setemailname] = useState('');
    const [phone, setphone] = useState('');
    const [password, setpassword] = useState('');
    const [address, setaddress] = useState('');
    // const [message, setMessage] = useState('');

    const handleform = (e) => {
        e.preventDefault();
        const updatedUser = {
            name: subadmin, email: email, phone: phone,role:"Subadmin", password: password, address: address, company: "", image: selectedImage.split(',').pop()
        };
        console.log(updatedUser);
        alert("test")
        fetch(`${config.url}/admin/adminSignup`, {
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
                if (data.message == 'create sub admin account successfully') {
                    toastifySuccess("create sub admin account successfully !!")
                    navigate(`${config.basename}/utils/subadminlist`);
                } else {
                    toastifyError("Something Wen't Wrong !!")

                }
            });
    };
    // const handlesubcategoryUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();

    //         reader.onload = (event) => {
    //             const base64Stringofsub = event.target.result;
    //             setSubcategoryBase64Image(base64Stringofsub);
    //         };
    //         reader.readAsDataURL(file);
    //         setSubcategoryBase64Image(file);
    //     }
    // };

    const handlesubcategoryUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSubcategoryBase64Image(
                   reader.result
                );
            };
            reader.readAsDataURL(file);
        }
    };

    return (

        <div>
            <Grid container spacing={2} style={{ justifyContent: 'center' }}>
                <Grid item xs={8} className="box">
                    <h2 className="top_heading_pages_text">Add new Subadmin</h2>




                    <Form onSubmit={handleform}>
                        <Grid className="pages_global_background" container spacing={2}>

                            <Grid item xs={4}>
                                <div className="my-3">
                                    <span htmlFor="name">Name</span>
                                    <input
                                        type="text"
                                        id="subadmin"
                                        placeholder="Enter here"
                                        className="rounded-0 form-control"
                                        name="subadmin"
                                        value={subadmin}

                                        onChange={(e) => {
                                            setSubadmin(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="my-3">
                                    <span htmlFor="name">Email</span>
                                    <input
                                        type="text"
                                        id="email"
                                        placeholder="Enter here"
                                        className="rounded-0 form-control"
                                        name="email"
                                        value={email}

                                        onChange={(e) => {
                                            setemailname(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="my-3">
                                    <span htmlFor="name">phone</span>
                                    <input
                                        type="text"
                                        id="phone"
                                        placeholder="Enter here"
                                        className="rounded-0 form-control"
                                        name="phone"
                                        value={phone}

                                        onChange={(e) => {
                                            setphone(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="my-3">
                                    <span htmlFor="name">Password</span>
                                    <input
                                        type="text"
                                        id="password"
                                        placeholder="Enter here"
                                        className="rounded-0 form-control"
                                        name="password"
                                        value={password}

                                        onChange={(e) => {
                                            setpassword(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <div className="my-3">
                                    <span htmlFor="name">Address</span>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Enter here"
                                        className="rounded-0 form-control"
                                        name="address"
                                        value={address}

                                        onChange={(e) => {
                                            setaddress(e.target.value);
                                        }}
                                    />
                                </div>
                            </Grid>



                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <h4>Upload Image</h4>
                                    <input type="file" accept="image/*" onChange={handlesubcategoryUpload} />
                                    {selectedImage && (
                                        <div>
                                            <h4>Selected Image:</h4>
                                            <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                </FormControl>
                            </Grid>
                            <Container className="text-center">
                                <Button type="submit" className="rounded-0" color="primary">
                                    Add New
                                </Button>
                            </Container>
                        </Grid>
                    </Form>






                </Grid>
            </Grid>
        </div>
    );
};

export default AddnewSubadmin;