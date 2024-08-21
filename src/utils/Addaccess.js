import * as React from 'react';
import Button from '@mui/material/Button';

import {

    // FormGroup, Input, InputLabel,  makeStyles,

    Grid
} from '@mui/material';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
// import axios from 'axios';
import config from 'config';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
// const theme = createTheme();

export default function UpdateUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const userRecord = location.state;
console.log(userRecord,"userRecord")
    const [dashboard, setDashboard] = useState(false);
    const [approvePilotList, setApprovePilotList] = useState(false);
    const [posterList, setPosterList] = useState(false);
    const [marketplace, setmarketplace] = useState(false);
    const [postedjob, setpostedjob] = useState(false);
    const [transction, settransction] = useState(false);
    const [subscriptionplan, setsubscriptionplan] = useState(false);
    const [staticPage, setstaticPage] = useState(false);
    const [faq, setfaq] = useState(false);
    const [aboutus, setaboutus] = useState(false);
    const [sitereview, setsitereview] = useState(false);
    const [topcategory, settopcategory] = useState(false);
    const [allcategory, setallcategory] = useState(false);
    const [contectus, setcontectus] = useState(false);
    const [applink, setapplink] = useState(false);

    console.log(dashboard, "dashboard")

    const handleform = () => {
        const updatedUser = {
            dashboard,
            approvePilotList,
            posterList,
            marketplace,
            postedjob,
            transction,
            subscriptionplan,
            staticPage,
            faq,
            aboutus,
            sitereview,
            topcategory,
            allcategory,
            contectus,
            applink


        };
        fetch(`${config.url}/admin/CreateAcessSubadmin/${userRecord._id}`, {
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
                if (data.message === 'Access create successfully') {
                    toastifySuccess('Access create successfully')
                    navigate(`${config.basename}/utils/subadminlist`);
                } else {
                    toastifyError('Something want wrong');
                }
            });
    };

    return (
        <div>
            <Grid container spacing={2} style={{ justifyContent: 'center' }}>
                <Grid item xs={8} className="box">
                    <h2 className="top_heading_pages_text">Add Access</h2>
                    <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={10}>
                            <div className='aces_menu'>
                                <ul className='p-0'>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>dashboard</strong></div>
                                        <div className='accces_menu_check_box'>


                                            <Form.Check
                                                inline
                                                label="Dashboard"
                                                name="dashboard"
                                                type="checkbox"
                                                id={`inline-checkbox-1`}
                                                checked={dashboard}
                                                onChange={(e) => setDashboard(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Approve pilot List</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Approve Pilot List"
                                                name="approvePilotList"
                                                type="checkbox"
                                                id={`inline-checkbox-2`}
                                                checked={approvePilotList}
                                                onChange={(e) => setApprovePilotList(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Poster List</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Poster List"
                                                name="posterList"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={posterList}
                                                onChange={(e) => setPosterList(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Marketplace Product</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Marketplace Product"
                                                name="marketplace"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={marketplace}
                                                onChange={(e) => setmarketplace(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Posted Job</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Posted Job"
                                                name="postedjob"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={postedjob}
                                                onChange={(e) => setpostedjob(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Transction</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Transction"
                                                name="transction"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={transction}
                                                onChange={(e) => settransction(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Subcription Plan</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Subcription Plan"
                                                name="subscriptionplan"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={subscriptionplan}
                                                onChange={(e) => setsubscriptionplan(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Static Page</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Static Page"
                                                name="staticPage"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={staticPage}
                                                onChange={(e) => setstaticPage(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>FAQ</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="FAQ"
                                                name="faq"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={faq}
                                                onChange={(e) => setfaq(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>AboutUs Page</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="AboutUs Page"
                                                name="aboutus"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={aboutus}
                                                onChange={(e) => setaboutus(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Site Review</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Site Review"
                                                name="sitereview"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={sitereview}
                                                onChange={(e) => setsitereview(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Top Category</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Top Category"
                                                name="topcategory"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={topcategory}
                                                onChange={(e) => settopcategory(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>All Category</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="All Category"
                                                name="allcategory"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={allcategory}
                                                onChange={(e) => setallcategory(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>Contect Us</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="Contect Us"
                                                name="contectus"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={contectus}
                                                onChange={(e) => setcontectus(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                    <li className='d-flex justify-content-between'>
                                        <div className='acces_menus'><strong>App Link Update</strong></div>
                                        <div className='accces_menu_check_box'>
                                            <Form.Check
                                                inline
                                                label="App Link Update"
                                                name="applink"
                                                type="checkbox"
                                                id={`inline-checkbox-3`}
                                                checked={applink}
                                                onChange={(e) => setapplink(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
                        <Grid item xs={12}>
                            <Button className="global_dashbtn" onClick={handleform}>
                                Allow Access
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
