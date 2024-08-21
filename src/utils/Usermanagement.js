import { Grid, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ComponentSkeleton from "../pages/components-overview/ComponentSkeleton";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import config from "config";
import Tooltip from "@mui/material/Tooltip";
// import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { handleDownloadExcel } from "../Utility/Utility"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import "../App.css";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1890ff",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
import { toastifyError, toastifySuccess } from "Utility/Utility";
import { timeAgo } from "Utility/Date";
import { Checkbox, FormLabel, Radio, RadioGroup } from "../../node_modules/@mui/material/index";
import { axiosInstance } from "Utility/Api";
const Usermanagement = () => {
  const [open, setOpen] = useState(false)

  const navigate = useNavigate();
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [userDataObj, setUserDataObj] = useState(null)

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredResults = userList.filter((record) =>
      record.first_name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filteredResults);
  };
  const getData = async () => {
    setLoading(true)
    try {
      fetch(`${config.url}/admin/getInactiveUsersRecored`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.jwt}`,
        },
        body: JSON.stringify({ role: "Pilot" }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "User data get successfully") {
            setFilteredData(data.userRecord);
            setUserList(data.userRecord);
            setLoading(false)
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false)

    }
  };

  function startEdit(row) {
    try {
      fetch(`${config.url}/admin/gettoken/${row._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.jwt}`
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "get data successfully") {
            navigate(`${config.basename}/utils/updateuser`, {
              state: { token: data.token, tab: 0 },
            });
          }
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  }

  const singleDelete = (event, _id) => {
    event.preventDefault();
    setUserList((prev) => prev.filter((i) => i._id !== _id));
    setTimeout(() => {
      // setloading(false);
    }, 1000);
    fetch(`${config.url}/admin/userdelete/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.jwt}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "user deleted successfully") {
          window.location.reload();
        }
      });
  };

  useEffect(() => {
    getData();
    getPlanSubs()
  }, []);

  function handleprefferd(row) {
    try {
      fetch(`${config.url}/admin/createpreffredlocation/${row._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.jwt}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "create prefferd successfully") {
            toastifySuccess("create prefferd successfully!");
            window.location.reload();
          } else if (data.message === "Un prefferd successfully") {
            toastifySuccess("Un prefferd successfully");
            window.location.reload();
          } else {
            toastifyError("something want wrong");
          }
        });
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  }

  function handleNavigate(row) {
    navigate(`${config.basename}/user-details`, {
      state: row,
    });
  }
  function sendmesaage(row) {
    navigate(`${config.basename}/sendmessage`, {
      state: row
    });
  }
  function handlePreview(row) {
    navigate(`/profile-details/${row._id}`,);
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
  const downloadExcel = (type) => {
    if (type == "marketing_email") {
      const marketEmail = filteredData.filter((item) => item.receive_email === true)
      handleDownloadExcel(changeArrFilterData(marketEmail), "MarketingApprovedPilotList", "MarketingApprovedPilot")
    } else {
      handleDownloadExcel(changeArrFilterData(filteredData), "ApprovedPilotList", "ApprovedPilot")
    }
  };
  const [planList, setPlanList] = useState([])
  const getPlanSubs = async () => {
    try {
      const res = await axiosInstance.post('/admin/getSubscriptionPlan')
      if (res?.data?.status == 200) {
        const filteredPlans = res?.data?.getsubscriptionpane.filter(plan => plan.plan_name.toLowerCase() === "silver" || plan.plan_name.toLowerCase() === "gold");
        setPlanList(filteredPlans)
      } else {
        setPlanList([])
      }
    } catch (error) {
      console.log(error)
      setPlanList([])
    }
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const openAsignModal = (row) => {
    setOpen(true)
    setUserDataObj(row)
  }
  const [planId, setPlanId] = useState(null)
  const handleAsignPlan = async () => {
    try {
      const params = {
        "plan_id": planId,
        "user_id": userDataObj?._id
      }
      const res = await axiosInstance.post('/admin/createSubscriptionPlanbyAdmin', params)
      if(res.data.status == 200){
        toastifySuccess(res?.data?.message)
        setOpen(false)
      }else{
        toastifyError("Something went wrong !!")
      }
    } catch (error) {
      console.log(error)
      toastifyError("Something went wrong !!")
    }
  }

  return (
    <ComponentSkeleton>
      <div className="dahbard_table top_tab_bar">
        <div>
          <h2>Pilot List</h2>
        </div>

        <div className="input-box">
          <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel("marketing_email")}>
            Export Marketing Email
          </Button>
          <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel("all")}>
            Export to Excel
          </Button>
          <TextField
            id="demo-helper-text-aligned-no-helper"
            label="Search by Name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <Grid container spacing={3}>
        {loading ? (
          <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Box>
              <CircularProgress size={60} />
            </Box>
          </div>
        ) : (<>
          <Grid item xs={12} lg={12}>
            <TableContainer component={Paper} className="dahbard_table_inner">
              <Table className="text-start" sx={{ minWidth: 700 }} aria-label="customized table">
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
                    <StyledTableCell align="left">Marketing Email</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentItems.map((row, key) => (
                    <StyledTableRow key={row._id}>
                      <StyledTableCell component="th" scope="row" align="">
                        {(currentPage - 1) * itemsPerPage + key + 1}
                      </StyledTableCell>
                      <StyledTableCell align="">
                        {row.first_name} {row.last_name}
                      </StyledTableCell>
                      <StyledTableCell align="">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="">
                        {row.phone}
                      </StyledTableCell>
                      <StyledTableCell align="">
                        {row.status}
                      </StyledTableCell>
                      <StyledTableCell align="" className='text-uppercase'>{row.subscription_type}</StyledTableCell>
                      <StyledTableCell align="">{timeAgo(row.created_at)}</StyledTableCell>

                      <StyledTableCell align="">

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
                        <Checkbox disabled={!row?.receive_email} checked={row?.receive_email} />
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            // alignItems: 'center',
                            gap: "10px",
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
                          <Button className="btn-success action-btn d-block" onClick={() => { openAsignModal(row) }}>
                            <Tooltip title="Asign Plan">
                              <AttachMoneyIcon />
                            </Tooltip>
                          </Button>
                          <Button
                            className="dlt_btn action-btn d-block"
                            onClick={(e) => singleDelete(e, row._id)}
                          >
                            <Tooltip title="Hold">
                              <AccessAlarmsIcon />
                            </Tooltip>
                          </Button>

                          <Button
                            className="view_btn action-btn d-block"
                            onClick={() => handleNavigate(row)}
                          >
                            <Tooltip title="View Details">
                              <RemoveRedEyeIcon />
                            </Tooltip>
                          </Button>
                          {/* {row.role === 'Pilot' && (
                          <Button className="product_view action-btn d-block" onClick={() => handleProductNavigate(row)}>
                            <Tooltip title="View Marketplace product Details">
                              <AutoAwesomeMotionIcon />
                            </Tooltip>
                          </Button>
                        )} */}

                          {row.role === "Pilot" && (
                            <Button
                              className={` action-btn d-block ${row.preferred ? 'preferd_badge' : 'grey-color'}`}
                              onClick={() => handleprefferd(row)}
                            >
                              <Tooltip title={row.preferred ? "Preferred" : "Not Preferred"}>
                                <WorkspacePremiumIcon />
                              </Tooltip>
                            </Button>
                          )}
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
          </Grid>
          <Grid container justifyContent={"center"} className="pageInation_box">
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
        )}
      </Grid>


      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
        fullscreen
      >
        <DialogTitle id="alert-dialog-title"><h5 className="text-center">Assign plan</h5></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className='text-center'>

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Plan Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={planId}
                  onChange={(e)=>setPlanId(e.target.value)}
                >
                  {
                    planList?.map((item, i) => (
                      <FormControlLabel key={i} value={item._id} control={<Radio />}
                        label={
                          <Typography className='text-uppercase' style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', color: '#000' }}>
                            {item.plan_name}
                          </Typography>
                        } />
                    ))
                  }
                </RadioGroup>
              </FormControl>
              <h6 className="text-capitalize">you are assigning plan to <strong className="text-uppercase">{userDataObj?.first_name + " " + userDataObj?.last_name}</strong></h6>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className='chat_btn' onClick={() => { setOpen(false) }}>Cancel</button>
          <button className='chat_btn' onClick={() => handleAsignPlan()}> Assign</button>
        </DialogActions>
      </Dialog>
    </ComponentSkeleton>
  );
};
export default Usermanagement;