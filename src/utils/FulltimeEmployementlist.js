import { Grid } from '@mui/material';
import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
//   import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import config from 'config';
import Tooltip from '@mui/material/Tooltip';
// import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import '../App.css';
import defaulPath from "../assets/images/default-placeholder.png"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1890ff',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));
//   import { toastifyError, toastifySuccess } from 'Utility/Utility';

import { handleDownloadExcel } from "Utility/Utility"
import Loading from 'Utility/Loading';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { timeAgo } from 'Utility/Date';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

const FulltimeEmployementlist = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [loading, setloading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredResults = userList.filter(
      (record) => record.job_title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredResults);
  };
  const getData = async () => {
    setloading(true)
    try {
      fetch(`${config.url}/user/getfullTimejobPost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get data successfully') {
            setFilteredData(data.getdata);
            setUserList(data.getdata);
            setloading(false)
          } else {
            setFilteredData([]);
            setUserList([]);
            setloading(false)
          }
        });
    } catch (error) {
      console.log(error);
      setUserList([]);
      setloading(false)
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const changeArrFilterData = (filteredData) => {
    const result = filteredData?.map((sponsor) =>
      ({ "Job Title": sponsor.job_title, "Company Name": sponsor.company_name, "location": sponsor.location, "job_type": sponsor.job_type, "description": sponsor.description, "image": sponsor.image, "createdAt": sponsor.createdAt })
    )
    return result
  }
  const downloadExcel = () => {
    handleDownloadExcel(changeArrFilterData(filteredData), "FulltimeJobrequestList", "FulltimeJobrequest")
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const [details, setDetails] = useState({})
  const handleClickOpen = (row) => {
    setOpen(true);
    setDetails(row)
  };

  function updatePage(e, row) {
    const page = { job_type: "business", get_data_type: "business" }
    const pararm = { ...row, ...page }
    navigate(`${config.basename}/utils/updateposte`, {
      state: { data: pararm },
    });
  }
  return (
    <ComponentSkeleton>
      <div className="dahbard_table top_tab_bar">
        <div>
          <h2>Business employement portal List</h2>
        </div>
        <div className="input-box">
          <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
            Export to Excel
          </Button>
          <TextField
            id="demo-helper-text-aligned-no-helper "
            label="Search by Job Title "
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <Grid container spacing={3}>
        {
          loading ? <Loading /> :
            <>
              <Grid item xs={12} lg={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">S.No.</StyledTableCell>
                        <StyledTableCell align="left">Image</StyledTableCell>
                        <StyledTableCell align="left">Job title</StyledTableCell>
                        <StyledTableCell align="left">Company Name</StyledTableCell>
                        <StyledTableCell align="left">Job Type</StyledTableCell>
                        <StyledTableCell align="left">Name</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="left">Send message</StyledTableCell>
                        <StyledTableCell align="left">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((row, key) => (
                        <StyledTableRow key={row._id}>
                          <StyledTableCell component="th" scope="row" align="">
                            {(currentPage - 1) * itemsPerPage + key + 1}
                          </StyledTableCell>
                          <StyledTableCell align="">
                            {row?.image ? (
                              <img src={row.image} alt="altimg" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                            ) : (
                              <img src={defaulPath} alt="Default Product" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="">
                            {row.job_title}
                          </StyledTableCell>
                          <StyledTableCell align="">{row.company_name}</StyledTableCell>
                          <StyledTableCell align="">{row.job_type}</StyledTableCell>
                          <StyledTableCell align="">{row.userName}</StyledTableCell>
                          <StyledTableCell align="">{row.userEmail}</StyledTableCell>
                          <StyledTableCell align="">
                            <Button className="view_btn action-btn d-block" onClick={() => navigate(`${config.basename}/sendmessage`, { state: { _id: row.user_id } })}>
                              <Tooltip title="Send message"><ForwardToInboxIcon /></Tooltip>
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'start',
                                // alignItems: 'center',
                                gap: '10px'
                              }}
                            >
                              <Button
                                className="edit_btn_global action-btn d-block"
                                onClick={(e) => updatePage(e, row)}
                              >
                                <Tooltip title="Edit">
                                  <ModeEditOutlineIcon />
                                </Tooltip>
                              </Button>
                              <Button
                                className="view_btn action-btn d-block"
                                onClick={() => handleClickOpen(row)}
                              >
                                <Tooltip title="View User Details">
                                  <RemoveRedEyeIcon />
                                </Tooltip>
                              </Button>

                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid container justifyContent={'center'} className="pageInation_box">
                <Grid item xl={6} lg={8} md={10} sm={12}>
                  <Stack spacing={2}>
                    <Pagination
                      count={Math.ceil(filteredData.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                      variant="outlined"
                      shape="rounded"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </>
        }
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => { setOpen(false) }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <h4>Full time job requests details</h4>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <TextField fullWidth label="Job Title" variant="standard" readOnly value={details.job_title} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField fullWidth label="Job Type" variant="standard" readOnly value={details.job_type} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField fullWidth label="Company Name" variant="standard" readOnly value={details.company_name} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField fullWidth label="Request Date" variant="standard" readOnly value={timeAgo(details.createdAt)} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField fullWidth label="Location" variant="standard" readOnly value={details.location} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField fullWidth multiline label="Description" variant="standard" readOnly value={details.description} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <span>Logo</span>
                <img src={details.logo} alt='logo' style={{ width: '100%', height: '240px' }} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <span>Image</span>
                <img src={details.image} alt='img' style={{ width: '100%', height: '240px' }} />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false) }} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ComponentSkeleton>
  );
};
export default FulltimeEmployementlist;