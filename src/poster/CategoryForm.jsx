import React, { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Grid } from '../../node_modules/@mui/material/index';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

const CategoryForm = ({ formOpen, cateDetails, error }) => {
  const [personName, setPersonName] = React.useState([]);
  const handleChange = (event) => {
    handleUpdate()
    const {target: { value }} = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [postercat, setPostercat] = React.useState('');
  const handleChangespostercat = (event) => {
    setPostercat(event.target.value);
    handleUpdate()
  };

  const [itsfor, setItsfor] = React.useState('');
  const handleChangesitsfor = (event) => {
    handleUpdate()
    setItsfor(event.target.value);
  };

  const [param, setParams] = useState({
    "name": "",
    "quate_me_for": personName,
    "its_for_a": "",
    "inspect_a": "",
    "need_you_there_for": "",
    "task_description": "",
    "application_method_and_rate": "",
    "location_nearest_town": "",
    "google_map_link": "",
    "what_kind_country": ""
  })
  const handleFormChange = (e) => {
    setParams({
      ...param, [e.target.name]: e.target.value
    })
    handleUpdate()
  }

  const handleUpdate = () => {
    cateDetails(param);
  };

  return (
    <div>
      {
        formOpen &&
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="group  error">
                <input className="inputMaterial" type="text" placeholder="Enter Your Name" name='name' onChange={handleFormChange} /> <label htmlFor="firstName">Name</label>
                <span className="bar"></span>
                <span className="errmsg">{error.name}</span>
              </div>
            </Grid>
            <Grid item xs={6}>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                <span className="top_text">Need You There For</span>
                <Select
                  value={postercat}
                  onChange={handleChangespostercat}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="normal_select"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value={10}>0 - 2 hrs</MenuItem>
                  <MenuItem value={20}>Half Day</MenuItem>
                  <MenuItem value={20}>Full Day</MenuItem>
                  <MenuItem value={20}>Not Sure Yet</MenuItem>
                </Select>

              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl sx={{ m: 1, width: 300 }} className="check_select_outer ">
                <InputLabel id="demo-multiple-checkbox-label">Quote Me For</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                  className="check_select"
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={personName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                  <span className="errmsg">{error.quate_me_for}</span>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                <span className="top_text">Its For A</span>
                <Select
                  value={itsfor}
                  onChange={handleChangesitsfor}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="normal_select"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value={10}>Mine Site </MenuItem>
                  <MenuItem value={20}>Quarry</MenuItem>
                  <MenuItem value={30}>Land Fill Site</MenuItem>
                  <MenuItem value={40}>West Depot</MenuItem>
                  <MenuItem value={50}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <div className="dec_text">
                <textarea placeholder="Describe The Task" name="task_description" onChange={(e) => { setParams({ ...param, 'task_description': e.target.value }); handleUpdate() }} />
              </div>
            </Grid>
          </Grid>
        </>
      }
    </div>
  );
};

export default CategoryForm;