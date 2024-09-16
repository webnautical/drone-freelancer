
import {
  //  Breadcrumbs, Divider,
  Grid
  //   Link, Stack, Typography
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { Button, Box, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import config from 'config';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { handleDownloadExcel } from "Utility/Utility"
// import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import Tooltip from '@mui/material/Tooltip';
import { timeAgo } from 'Utility/Date';
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

const ViewPilot = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setloading] = useState(true);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredResults = userList.filter(
      (record) => record.first_name.toLowerCase().includes(query.toLowerCase())
      //|| record.phone.toString().includes(query)
    );

    setFilteredData(filteredResults);
  };

  const getData = async () => {
    setloading(true);
    try {
      fetch(`${config.url}/admin/getUnApprovedPilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'User data get successfully') {
            setFilteredData(data.userRecord);
            setUserList(data.userRecord);
            setloading(false);
          }
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const rejectPilot = async (row) => {
    try {
      setloading(true);
      fetch(`${config.url}/admin/rejectPilotByadmin/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'Reject Pilot successfully') {
            // navigate(`${config.basename}/utils/pilot`);
            window.location.reload();
            setloading(false);
          }
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // function handleProductNavigate(row) {
  //   navigate(`${config.basename}/productlist`, {
  //     state: row
  //   });
  // }

  function handleApproved(row) {
    try {
      setloading(true);
      fetch(`${config.url}/admin/approvedPilot/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'Approved Pilot successfully') {
            // navigate(`${config.basename}/utils/pilot`);
            window.location.reload();
            setloading(false);
          }
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }
  function handleNavigate(row) {
    navigate(`${config.basename}/user-details`, {
      state: row
    });
  }
  function startEdit(row) {
    try {
      fetch(`${config.url}/admin/gettoken/${row._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.jwt}`
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'get data successfully') {
            navigate(`${config.basename}/utils/updateuser`, {
              state: { token: data.token, tab: 0 }
            });
          }
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }


  }

  const changeArrFilterData = (filteredData) => {
    const result = filteredData?.map((sponsor) =>
    ({
      "First Name": sponsor.first_name,
      "Last Name": sponsor.last_name,
      "Email": sponsor.email,
      "Phone Number": sponsor.phone,
      "Location": sponsor.location,
      "Country": sponsor.country,
      "Role": sponsor.role,
      "Specilization": Array.isArray(sponsor.specilization) ? sponsor.specilization.join(', ') : sponsor.specilization,
      "company": sponsor.first_name,
      "Short description": sponsor.short_description,
      "website link": sponsor.website_link,
      "Instagram link": sponsor.instagram_link,
      "Facebook link": sponsor.facebook_link,
      "Twiter link": sponsor.twitter_link,
      "tiktok_link": sponsor.tiktok_link,
      "Reviews": sponsor.reviews,
      "averageRating": sponsor.averageRating,
      "radius": sponsor.radius,
      "status": sponsor.status,
      "Extra Area Category": Array.isArray(sponsor.extra_area_category) ? sponsor.extra_area_category.join(', ') : sponsor.extra_area_category,
      "specification": sponsor.equipment.specification, //
      "Drone": Array.isArray(sponsor.equipment.drone) ? sponsor.equipment.drone.join(', ') : sponsor.equipment.drone,
      "Camera specification": Array.isArray(sponsor.equipment.camera_specification) ? sponsor.equipment.camera_specification.join(', ') : sponsor.equipment.camera_specification,
      "payload": sponsor.equipment.payload,
      "Subcription Plan Name": sponsor.subcription_id,
      "Create Date": sponsor.created_at,

    })
    )
    return result
  }
  const downloadExcel = () => {
    handleDownloadExcel(changeArrFilterData(filteredData), "UnApprovedPilotList", "UnApprovedPilot")
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  function sendmesaage(row) {
    navigate(`${config.basename}/sendmessage`, {
      state: row
    });
  }
  function handlePreview(row) {
    navigate(`/profile-details/${row._id}`,);
  }

  return (
    <div>
      {loading ? (
        <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <Box>
            <CircularProgress size={60} />
          </Box>
        </div>
      ) : (
        <>
          <div className="dahbard_table  top_tab_bar">
            <div>
              <h2>Pilot Request</h2>
            </div>
            <div className="input-box">
              <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
                Export to Excel
              </Button>

              <TextField

                id="demo-helper-text-aligned-no-helper "
                label="Search by Name"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <TableContainer component={Paper} className="dahbard_table_inner">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">S.No.</StyledTableCell>
                      <StyledTableCell align="left">Name</StyledTableCell>
                      <StyledTableCell align="left">Email</StyledTableCell>
                      <StyledTableCell align="left">Phone</StyledTableCell>
                      <StyledTableCell align="left">Location</StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>
                      <StyledTableCell align="left">Plan type</StyledTableCell>
                      <StyledTableCell align="left">Created Date</StyledTableCell>
                      <StyledTableCell align="left">Send message</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentItems.map((row, key) => (
                      <StyledTableRow key={row._id} style={{ background: row.status === 'Reject' ? 'rgba(255, 0, 0, 0.1)' : 'inherit' }} >
                        <StyledTableCell component="th" scope="row" align="left">
                        {(currentPage - 1) * itemsPerPage + key + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.first_name} {row.last_name}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row.email}</StyledTableCell>
                        <StyledTableCell align="center">{row.phone}</StyledTableCell>
                        <StyledTableCell align="center">{row.location}</StyledTableCell>
                        <StyledTableCell align="center">{row.status}</StyledTableCell>
                        <StyledTableCell align="center" className='text-uppercase'>{row.subscription_type}</StyledTableCell>
                        <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>

                        <StyledTableCell align="center">
                          <Button
                            className="view_btn action-btn d-block"
                            onClick={() => sendmesaage(row)}
                          >
                            <Tooltip title="Send message">
                              <ForwardToInboxIcon />
                            </Tooltip>
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '11px'
                            }}
                          >
                            <div>
                              <Button
                                className="edit_btn_global action-btn d-block"
                                onClick={() => {
                                  startEdit(row);
                                }}
                              >
                                <Tooltip title="Edit">
                                  <ModeEditOutlineIcon />
                                </Tooltip>
                              </Button>
                            </div>
                            <Button className="view_btn action-btn d-block" onClick={() => handleNavigate(row)}>
                              <Tooltip title="View Details">
                                <RemoveRedEyeIcon />
                              </Tooltip>
                            </Button>
                            <Button className="dlt_btn action-btn d-block" onClick={() => rejectPilot(row)}>
                              <Tooltip title="Reject User">
                                <SwipeLeftIcon />
                              </Tooltip>
                            </Button>
                            <Button className="edit_btn_global action-btn d-block" onClick={() => handleApproved(row)}>
                              <Tooltip title="Approve Pilot">
                                <CheckBoxIcon />
                              </Tooltip>
                            </Button>
                            {/* <Button className="edit_btn action-btn d-block" onClick={() => handleProductNavigate(row)}>
                                <Tooltip title="View Marketplace Product">
                                  <AutoAwesomeMotionIcon />
                                </Tooltip>
                              </Button> */}
                            <Button
                              className="view_btn action-btn d-block"
                              onClick={() => handlePreview(row)}
                            >
                              <Tooltip title="Preview">
                                <PersonSearchIcon />
                              </Tooltip>
                            </Button>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            </Grid>
          </Grid>

        </>
      )}
    </div>
  );
};
export default ViewPilot;