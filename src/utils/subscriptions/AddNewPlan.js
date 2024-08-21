import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  FormControl,
  // FormGroup, Input, InputLabel,
  TextField,
  //  makeStyles,
  Grid,
} from "@mui/material";
import Input from "@mui/material/Input";
import {
  useState,
  //  useContext
} from "react";
// import { DataContext } from 'context/DataContext';
import config from "config";
import "../../App.css";
// const theme = createTheme();
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function AddNewPlan() {
  const [values, setValues] = useState({
    plan_name: "",
    plan_type: "",
    radius: "",
    amount: "",
    extra_location_per_amount: "",
    plan_description: "",
  });
  // const [formerror, setFormerror] = useState([]);
  // const [ptagwho, setPtagwho] = useState('');

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  console.log(localStorage.getItem("jwt"));
  const handlechange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const [inputText, setInputText] = useState("");
  const [points, setPoints] = useState([]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputText.trim() !== "") {
      // Pressed Enter key and inputText is not empty
      setPoints((prevPoints) => [...prevPoints, inputText.trim()]);
      setInputText(""); // Clear the input field
    }
  };

  const handleRemovePoint = (index) => {
    setPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints.splice(index, 1);
      return newPoints;
    });
  };

  const handleform = () => {
    console.log(values);

    fetch(`${config.url}/admin/createSubscriptionPlanbyAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.jwt}`,
      },
      body: JSON.stringify({
        plan_name: values.plan_name,
        plan_type: values.plan_type,
        radius: values.radius,
        amount: values.amount,
        plan_description: values.plan_description,
        extra_location_per_amount: values.extra_location_per_amount,
        included_point: points,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === "Create Subscription Plan successfully") {
          navigate(`${config.basename}/utils/subscribtion`);
        } else {
          setMessage(data.message);
        }
      });
    // } else {
    //     console.log('all the details need to be submitted');
    // }
  };

  // const handleEditorChange = (event, editor) => {
  //   const data = editor.getData();
  //   // setPtag(ptag => ({
  //   //   ...ptag,
  //   //   data,
  //   // }));
  //   setPtagwho(data)
  // };
  return (
    <div>
      <Grid container style={{ justifyContent: "center" }}>
        <Grid item xl={8} lg={6} md={12} xs={12} className="box">
          <h2 className="top_heading_pages_text text">Add New Plan</h2>
          <Grid
            className="pages_global_background p-4 "
            container
            sx={{ my: 1 }}
          >
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Plan Name"
                  variant="outlined"
                  id="plan_name"
                  name="plan_name"
                  value={values.plan_name}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.plan_name}</p> */}
            </Grid>
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Plan Type"
                  variant="outlined"
                  id="plan_type"
                  name="plan_type"
                  value={values.plan_type}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.plan_type}</p> */}
            </Grid>
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Radius"
                  variant="outlined"
                  id="radius"
                  name="radius"
                  value={values.radius}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.radius}</p> */}
            </Grid>
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Amount"
                  variant="outlined"
                  id="amount"
                  name="amount"
                  value={values.amount}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.amount}</p> */}
            </Grid>
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Extra location per category"
                  variant="outlined"
                  id="extra_location_per_amount"
                  name="extra_location_per_amount"
                  type="extra_location_per_amount"
                  value={values.extra_location_per_amount}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.extra_location_per_amount}</p> */}
            </Grid>
            <Grid item xl={6} lg={12} md={12} xs={12} className="mb-4 p-2">
              <FormControl fullWidth>
                <TextField
                  label="Plan description"
                  variant="outlined"
                  id="plan_description"
                  name="plan_description"
                  type="plan_description"
                  value={values.plan_description}
                  onChange={handlechange}
                />
              </FormControl>
              {/* <p className="text-danger">{formerror.plan_description}</p> */}
            </Grid>
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="mb-2 p-2"
            >
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
                    {point}
                    <IconButton
                      className="inner_close_btn"
                      onClick={() => handleRemovePoint(index)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>

          <Grid container sx={{ my: 2 }} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <div className="text-end">
                <Button className="global_dashbtn" onClick={handleform}>
                  Add plan
                </Button>
              </div>
            </Grid>
            <h6 className="text-danger text-center">{message}</h6>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
