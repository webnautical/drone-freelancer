import {
  FormControl,

  //  FormGroup, Input, InputLabel,
  Button,
  // TextField,
  Grid
} from '@mui/material';

import {
  useLocation,

  // useNavigate
} from 'react-router';

// import { toastifyError, toastifySuccess } from 'Utility/Utility';
// import config from 'config';
export default function ViewJobDetails() {
  // const navigate = useNavigate();

  const location = useLocation();

  const Jobdata = location.state;

  console.log(Jobdata);

  // const [Jobdatas, setJobdatas] = useState(Jobdata);

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
      <div>
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
                    Download PDF
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
                    Download document
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

  // const handleform = () => {
  //   if (Jobdata.pilot_id !== '') {
  //     toastifySuccess('get pilot data successfully!');

  //     navigate(`${config.basename}/viewpilotdata`, {
  //       state: Jobdata?.pilot_id
  //     });
  //   } else {
  //     toastifyError('Not accept this job!!');
  //   }
  // };

  return (
    <div>
      <Grid container style={{ justifyContent: 'center' }}>
        <Grid item xs={8} className="box p-0">
          <Grid container sx={{ my: 2 }} style={{ textAlign: 'end' }}>
            <Grid item xs={12}>
              <div className=" page_heading d-flex justify-content-between align-items-center">
                <h5>Job Information</h5>
                {/* <Button className="global_dashbtn" onClick={handleform}>
                  View accepted details
                </Button> */}
              </div>
              {/* <Button className="global_dashbtn" onClick={handleform}>
                View Portfolio
              </Button> */}
            </Grid>
          </Grid>

          <Grid className="p-4 pages_global_background" container sx={{ my: 1 }}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <h3>Job Title</h3>
                <p>{Jobdata?.job_details?.name}</p>
                {/* <TextField variant="outlined" id="name" label="Name" name="name" value={Jobdata.name} /> */}
              </FormControl>
            </Grid>
           

            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <h3>Work Due Date</h3>
                <p>{ Jobdata?.due_date_type ? Jobdata?.due_date_type  : Jobdata.work_due_date}</p>
  
              </FormControl>
            </Grid>
 

            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <h3>Street</h3>
                <p>{Jobdata.street}</p>
                {/* <TextField variant="outlined" id="street" label="Street" name="street" value={Jobdata.street} /> */}
              </FormControl>
            </Grid>

            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <h3>Location</h3>
                <p>{Jobdata?.location}</p>
                {/* <TextField variant="outlined" id="name" label="Name" name="name" value={Jobdata.name} /> */}
              </FormControl>
            </Grid>

            {(Jobdata.job_details.quate_me_for).length > 0 && (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Quote Me For</h3>
                  <p>{(Jobdata.job_details.quate_me_for).join(', ')}</p>
                </FormControl>
              </Grid>
            )}

            {(Jobdata.job_details.its_for_a).length > 0 && (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Its for a</h3>
                  <p>{(Jobdata.job_details.its_for_a).join(', ')}</p>
                </FormControl>
              </Grid>
            )}

            {(Jobdata.job_details.inspect_a).length > 0 && (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Inspect a</h3>
                  <p>{(Jobdata.job_details.inspect_a).join(', ')}</p>
                </FormControl>
              </Grid>
            )}

            {(Jobdata.job_details.need_you_there_for).trim() !== '' ? (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Need There For</h3>
                  <p>{Jobdata.job_details.need_you_there_for}</p>
                </FormControl>
              </Grid>
            ) : null}
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <h3>Task Description</h3>
                {/* <p>{Jobdata.job_details.task_description}</p> */}
                <div dangerouslySetInnerHTML={{ __html: Jobdata?.job_details?.task_description }} />
              </FormControl>
            </Grid>


            {(Jobdata.job_details.application_method_and_rate).trim() !== '' ? (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Application Method Rate</h3>
                  <p>{Jobdata.job_details.application_method_and_rate}</p>
                </FormControl>
              </Grid>
            ) : null}


            {(Jobdata.job_details.location_nearest_town).trim() !== '' ? (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Nearest Town Location</h3>
                  <p>{Jobdata.job_details.location_nearest_town}</p>
                </FormControl>
              </Grid>
            ) : null}


            {(Jobdata.job_details.google_map_link).trim() !== '' ? (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>Google map</h3>
                  <p>{Jobdata.job_details.google_map_link}</p>
                </FormControl>
              </Grid>
            ) : null}


            {(Jobdata.job_details.what_kind_country).trim() !== '' ? (
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <FormControl fullWidth>
                  <h3>What kind Country</h3>
                  <p>{Jobdata.job_details.what_kind_country}</p>
                </FormControl>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <h3>Attachment</h3>

                <FileViewer
                  fileUrls={Jobdata?.attachment}
                  fileTypes={Jobdata?.attachment?.map(getFileType)}
                />
              </FormControl>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}