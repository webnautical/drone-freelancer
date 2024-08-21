import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Textarea from '@mui/material/TextareaAutosize';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

// import Select from "react-dropdown-select";

export default function Findpilot() {
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    }
  };
  // --------------------Jobtypedropdown---------------------------

  const [jobtype, setJobtype] = React.useState('');

  const handleChangejobtype = (event) => {
    setJobtype(event.target.value);
  };

  // --------------------Jobtypedropdown---------------------------

  const [country, setCountry] = React.useState('');

  const handleChangecountry = (event) => {
    setCountry(event.target.value);
  };

  // --------------------countrydropdown---------------------------
  const [state, setState] = React.useState('');

  const handleChange = (event) => {
    setState(event.target.value);
  };

  // --------------------countrydropdown---------------------------

  return (
    <div className="find_pilot_page">
      {/* <section className="breacrumb"></section> */}

      <section className="form_pilot_find">
        <Container>
          <div className="inner_main_box custom-form">
            <div className="form_heading">
              <h2>Let's Get Started</h2>
              <p>Please Fill All The Details For Find A Pilot</p>
            </div>
            <Row className="">
              <Col md="6" className="mb-4">
                <div class="group  error">
                  <input className="inputMaterial" type="text" placeholder="Enter your Name" />
                  <span class="bar"></span>
                  <label>Name</label>
                </div>
              </Col>
              <Col md="6" className="mb-4">
                <div className="group  error">
                  <input className="inputMaterial" type="text" placeholder="Enter your Email Address" />
                  <span class="bar"></span>
                  <label>Email</label>
                </div>
              </Col>
              <Col md="6" className="mb-4">
                <div className="group  error">
                  <input className="inputMaterial" type="text" placeholder="Enter your Email Address" />
                  <span className="bar"></span>
                  <label>Phone Number</label>
                </div>
              </Col>
              <Col md="6" className="mb-4">
                <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                  <span className="top_text">Choose Country </span>
                  <Select
                    className="normal_select"
                    value={country}
                    onChange={handleChangecountry}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value={10}>China</MenuItem>
                    <MenuItem value={20}>India</MenuItem>
                    <MenuItem value={30}>Dubai</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col md="6" className="mb-4">
                <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                  <span className="top_text">Choose State </span>
                  <Select
                    className="normal_select"
                    value={state}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value={10}>China</MenuItem>
                    <MenuItem value={20}>India</MenuItem>
                    <MenuItem value={30}>Dubai</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col md="6" className="mb-4">
                <FormControl sx={{ m: 1, minWidth: 120 }} className="normal_select">
                  <span className="top_text">Job Type </span>
                  <Select
                    className="normal_select"
                    value={jobtype}
                    onChange={handleChangejobtype}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value={10}>Commercial property</MenuItem>
                    <MenuItem value={20}>Residential property</MenuItem>
                  </Select>
                </FormControl>
              </Col>

              <Col md="6" className="mb-4">
                <div className="group  error">
                  <input className="inputMaterial" type="text" placeholder="Enter Your Suburb" />
                  <span className="bar"></span>
                  <label>Suburb</label>
                </div>
              </Col>
              <Col md="6" className="mb-4">
                <div className="group  error">
                  <input className="inputMaterial" type="text" placeholder="Enter Your Street Address" />
                  <span class="bar"></span>
                  <label>Street</label>
                </div>
              </Col>

              <Col md="12" className="mb-4">
                <div className="text_decribe">
                  <label>Describe</label>
                  <Textarea placeholder="Type anything…" />
                </div>
              </Col>

              <Col md="12" className="mb-4">
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                  </p>
                </Dragger>
              </Col>

              <Col className="t-end">
                <button class="global_btn">Submit</button>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
}
