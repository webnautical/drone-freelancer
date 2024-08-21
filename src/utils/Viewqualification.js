// import CssBaseline from '@mui/material/CssBaseline';
// import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
// import { Girl } from '../../node_modules/@mui/icons-material/index';
import { useState, useEffect } from 'react';

import config from 'config';
export default function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const Qualification = location.state;
  console.log(Qualification, 'sjjs');
  const [filteredData, setFilteredData] = useState([]);

  console.log(filteredData, 'shhs');
  const getData = async () => {
    // setloading(true);
    try {
      fetch(`${config.url}/user/getUserqualifictionbyAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify({ qualification_id: Qualification })
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get data successfully') {
            setFilteredData(data.qualification);

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
  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();

    // Map file extensions to file types
    const fileTypeMap = {
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      pdf: 'pdf',
      docx: 'document',
      doc: 'document',
      docs: 'document',
      // Add more mappings as needed
    };

    // Return the corresponding file type or a default value
    return fileTypeMap[extension] || 'other';
  };

  const FileViewer = ({ fileUrls, fileTypes }) => {
    if (!fileUrls || !fileTypes || fileUrls.length !== fileTypes.length) {
      return <span>No files to display</span>;
    }

    return (
      <div className='attachment' >
        {fileUrls.map((fileUrl, index) => {
          const fileType = fileTypes[index];

          if (fileType === 'image') {
            return (

              <div key={index}>
                <img src={fileUrl} alt={`user ${index}`} style={{ maxWidth: '200px' }} />
              </div>
            );
          } else if (fileType === 'pdf') {
            return (
              <div key={index}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined" color="primary">
                    {/* Download PDF */}
                    <PictureAsPdfIcon />
                  </Button>
                </a>
              </div>
            );
          } else if (fileType === 'document') {
            // Add logic for rendering document viewer or download button
            return (
              <div key={index}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined" color="primary">
                    {/* Download document */}
                    <AssignmentReturnedIcon />
                  </Button>
                </a>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <span>Unsupported file type</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box">
          <Grid className="pages_global_background" container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={12} className="p-0">
              <div className="top_heading_pages_text my-0 py-3 d-flex justify-content-between align-items-center">
                <h5 >Qualification Details</h5>
                <Button className="global_dashbtn" onClick={()=>navigate(-1)}>Go Back </Button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>license</h3>
                <p>{filteredData?.lisencs_type}</p>
                {/* <TextField variant="outlined" id="lisencs_type" lisencs_type="lisencs_type" value={filteredData?.lisencs_type} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>qualification</h3>
                <p>{filteredData?.qualification}</p>
                {/* <TextField variant="outlined" id="qualification" name="qualification" value={filteredData?.qualification} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Qualification Expiry</h3>
                <p>{filteredData?.qualification_expiry}</p>
                {/* <TextField
                  variant="outlined"
                  id="qualification_expiry"
                  name="qualification_expiry"
                  value={filteredData?.qualification_expiry}
                /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>How long you have been a operator</h3>
                <p>{filteredData?.pro_drone_oprator_longtime}</p>
                {/* <TextField
                  variant="outlined"
                  id="pro_drone_oprator_longtime"
                  name="pro_drone_oprator_longtime"
                  value={filteredData?.pro_drone_oprator_longtime}
                /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>How Would you rate your skill level</h3>
                <p>{filteredData?.rate_skill_level}</p>
                {/* <TextField variant="outlined" id="rate_skill_level" name="rate_skill_level" value={filteredData?.rate_skill_level} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Weight Limit (kg)</h3>
                <p>{filteredData?.weight_limit}</p>
                {/* <TextField variant="outlined" id="weight_limit" name="weight_limit" value={filteredData?.weight_limit} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Flight Time</h3>
                <p>{filteredData?.flight_time_limit}</p>
                {/* <TextField variant="outlined" id="flight_time_limit" name="flight_time_limit" value={filteredData?.flight_time_limit} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>maximum wind speed</h3>
                <p>{filteredData?.maximum_wind_speed}</p>
                {/* <TextField variant="outlined" id="maximum_wind_speed" name="maximum_wind_speed" value={filteredData?.maximum_wind_speed} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Addition services</h3>
                <p>{filteredData?.addition_services}</p>
                {/* <TextField variant="outlined" id="addition_services" name="addition_services" value={filteredData?.addition_services} /> */}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Radio Certificate</h3>
                <p>{filteredData?.radio_certificate} </p>
                {/* <TextField variant="outlined" id="radio_certificate" name="radio_certificate" value={filteredData?.radio_certificate} /> */}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <h3>Attachment</h3>


                <FileViewer
                  fileUrls={filteredData?.attachment}
                  fileTypes={filteredData?.attachment?.map(getFileType)}
                />

              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}