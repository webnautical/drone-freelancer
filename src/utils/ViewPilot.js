import * as React from 'react';
import {
  //  Breadcrumbs, Divider,
  Grid
  //   Link, Stack, Typography
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

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
import { handleDownloadExcel, toastifyError, toastifySuccess } from "Utility/Utility"
// import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import Tooltip from '@mui/material/Tooltip';
import { timeAgo } from 'Utility/Date';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { axiosInstance } from 'Utility/Api';
import { useParams } from '../../node_modules/react-router-dom/dist/index';
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
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const ViewPilot = () => {
  const { type } = useParams()
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
    );
    setFilteredData(filteredResults);
  };
  const getPayload = (type) => type === "incomplete" ? { isIncomplete: true } : type === "delete-user" ? { isDeleted: true } : {};

  const getData = async () => {
    setloading(true);
    const payload = getPayload(type);

    try {
      fetch(`${config.url}/admin/getUnApprovedPilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
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
  }, [type]);

  const handleStatusToggle = async (userId) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error("No JWT token found");
        return;
      }
      console.log("Toggling status for userId:", userId);
      const response = await fetch(`${config.url}/admin/restoreUserAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === userId
              ? { ...row, status: row.status === 'active' ? 'inactive' : 'active' }
              : row
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

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

  const [open, setOpen] = React.useState(false);
  const [rowObj, setRowObj] = useState(null)
  const handleConfirmModalOpen = (row) => {
    setOpen(true);
    setRowObj(row)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const res = await axiosInstance.post('/admin/markUserAsIncomplete', { id: rowObj?._id })
      if (res?.data?.status == 200) {
        toastifySuccess(res?.data?.message)
        setOpen()
        getData()
      } else {
        toastifyError("Something went wrong! Please try again letter")
      }
    } catch (error) {
      console.log(error)
      toastifyError(error?.response?.data?.message)
    }
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
          <div className="dahbard_table top_tab_bar">
            <div>
              <h2>
                {type === "incomplete"
                  ? "Incomplete Pilot"
                  : type === "delete-user"
                    ? "Deleted User"
                    : "Pilot Request"}
              </h2>
            </div>

            {type !== "delete-user" && (
              <div className="input-box">
                <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
                  Export to Excel
                </Button>
                <TextField
                  id="demo-helper-text-aligned-no-helper"
                  label="Search by Name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            )}
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
                      <StyledTableCell align="left">Status</StyledTableCell>
                      <StyledTableCell align="left">Plan type</StyledTableCell>
                      <StyledTableCell align="left">Created Date</StyledTableCell>
                      <StyledTableCell align="left">Send message</StyledTableCell>
                      <StyledTableCell align="left">IP</StyledTableCell>
                      <StyledTableCell align="left">Location</StyledTableCell>
                      {type !== "delete-user" && (
                        <StyledTableCell align="center">Action</StyledTableCell>
                      )}
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
                        <StyledTableCell align="center">
                          <Switch
                            checked={row.status === 'active'}
                            onChange={() => handleStatusToggle(row._id)}
                            color="primary"
                          />
                        </StyledTableCell>

                        <StyledTableCell align="center" className='text-uppercase'>{row.subscription_type}</StyledTableCell>
                        <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>

                        <StyledTableCell align="center">
                          <Button className="view_btn action-btn d-block" onClick={() => sendmesaage(row)}>
                            <Tooltip title="Send message">
                              <ForwardToInboxIcon />
                            </Tooltip>
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.ip ? row.ip : "N/A"}</StyledTableCell>
                        <StyledTableCell align="center">{row.location}</StyledTableCell>

                        {type !== "delete-user" && (
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

                              <Button className="view_btn action-btn d-block" onClick={() => handlePreview(row)} >
                                <Tooltip title="Preview">
                                  <PersonSearchIcon />
                                </Tooltip>
                              </Button>
                              <Button className="edit_btn action-btn d-block" onClick={() => handleConfirmModalOpen(row)} >
                                <Tooltip title="Mark as incomplete">
                                  <PersonSearchIcon />
                                </Tooltip>
                              </Button>
                            </div>
                          </StyledTableCell>
                        )}
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

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to move this pilot request to the Incomplete Pilot List?
                This action will remove it from the Requested Pilot List.
              </DialogContentText>
            </DialogContent>

            <DialogActions className="mx-2">
              <Button onClick={handleClose} variant="outlined" color="secondary"> Cancel</Button>
              <Button onClick={handleConfirm} variant="contained" color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};
export default ViewPilot;