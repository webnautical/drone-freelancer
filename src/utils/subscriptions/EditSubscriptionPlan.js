import { useState } from 'react';
// import { useEffect } from "react"
import { IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useLocation, useNavigate } from 'react-router';
import Input from '@mui/material/Input';
// import { toast } from "react-toastify"
import {
  FormControl,
  // FormGroup, Input, InputLabel,
  TextField,
  //  makeStyles,
  Grid,
  Button
} from '@mui/material';
import config from 'config';
import '../../App.css';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toastifyError, toastifySuccess } from 'Utility/Utility';
const EditSubscriptionPlan = () => {
  // const editor = useRef(null)
  const navigate = useNavigate();
  const location = useLocation();
  const subscribtiondata = location.state.data;
  console.log(subscribtiondata, 'dhdhh');
  const [plan_name, setPlan_name] = useState(subscribtiondata.plan_name);
  const [plan_type, setPlan_type] = useState(subscribtiondata.plan_type);
  const [radius, setRadius] = useState(subscribtiondata.radius);
  const [amount, setAmount] = useState(subscribtiondata.amount);
  const [plan_description, setplan_description] = useState(subscribtiondata.plan_description);
  const [inputText, setInputText] = useState('');
  const [points, setPoints] = useState(subscribtiondata.included_point);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputText.trim() !== '') {
      // Pressed Enter key and inputText is not empty
      setPoints((prevPoints) => [...prevPoints, inputText.trim()]);
      setInputText(''); // Clear the input field
    }
  };

  const handleRemovePoint = (index) => {
    setPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints.splice(index, 1);
      return newPoints;
    });
  };

  const handleform = (e) => {
    e.preventDefault();
    const newPoints = inputText == '' ? points : [...points, inputText.trim()];
    const updatedUser = {
      plan_name,
      plan_type,
      radius,
      amount,
      plan_description: plan_description,
      included_point: newPoints
    };
    fetch(`${config.url}/admin/updatdataById/${subscribtiondata._id}`, {
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
        if (data.message === 'Data Updated successfully') {
          toastifySuccess('Data Updated successfully');
          navigate(`${config.basename}/utils/subscribtion`);
        } else {
          toastifyError('SomeThing want wrong');
        }
      });
  };

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <h2 className="top_heading_pages_text">Update Plan</h2>
          <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="plan_name"
                  label="Plan name"
                  name="plan_name"
                  value={plan_name}
                  onChange={(e) => {
                    setPlan_name(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="plan_type"
                  label="Plan type"
                  name="plan_type"
                  value={plan_type}
                  onChange={(e) => {
                    setPlan_type(e.target.value);
                  }}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="radius"
                  label="Radius"
                  name="radius"
                  value={radius}
                  onChange={(e) => {
                    // Extract the entered value
                    let inputValue = e.target.value;

                    // Check if the entered value is a number or empty
                    if (/^\d*$/.test(inputValue) || inputValue === '') {
                      // Update the state with the new value
                      setRadius(inputValue);
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={6} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="amount"
                  label="Amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-2 p-2">
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  id="plan_description"
                  label="Plan description"
                  name="plan_description"
                  value={plan_description}
                  onChange={(e) => {
                    setplan_description(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="p-2">
              <strong>
                <span>Plan Includes</span>
              </strong>
              <Input
                className="w-100"
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type and press Enter"
              />
              <ul className="includes_plan">
                {points.map((point, index) => (
                  <li key={index}>
                    <Typography>{point}</Typography>
                    <IconButton className="inner_close_btn" onClick={() => handleRemovePoint(index)}>
                      <ClearIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <div className="text-end">
                <Button className="global_dashbtn" onClick={handleform}>
                  Update
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditSubscriptionPlan;
