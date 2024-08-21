import {
  //  Breadcrumbs, Divider,
  Grid,
  //   Link, Stack, Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ComponentSkeleton from "../../pages/components-overview/ComponentSkeleton";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox, FormControlLabel } from '@mui/material';

import { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import config from "config";
import { Col } from "react-bootstrap";

import Tooltip from "@mui/material/Tooltip";
import "../../App.css";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosInstance } from "Utility/Api";
import { toastifyError, toastifySuccess } from "Utility/Utility";
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

const ViewPlan = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setloading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(false)
  const [addMoreToggle, setAddMoreToggle] = useState(false)

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredResults = userList.filter((record) =>
      record.plan_name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filteredResults);
  };

  const getData = async () => {
    setloading(true);
    try {
      fetch(`${config.url}/admin/getSubscriptionPlan`, {
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
          if (data.message === "Get Subscription Plan successfully") {
            setFilteredData(data.getsubscriptionpane);
            setUserList(data.getsubscriptionpane);
            setloading(false);
          }
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const EditPlan = async (row) => {
    navigate(`${config.basename}/utils/editsubscribtion`, {
      state: { data: row },
    });
  };


  useEffect(() => {
    getData();
    getPlanCompareList()
  }, []);

  const [planComparisonActualData, setPlanComparisonActualData] = useState([])
  const [planComparison, setPlanComparison] = useState([])
  const getPlanCompareList = async () => {
    try {
      const res = await axiosInstance.get('/admin/getPlanComparison')
      if (res?.data?.status == 200) {
        setPlanComparison(res?.data?.comparison)
        setPlanComparisonActualData(res?.data?.comparison)
      } else {
        setPlanComparison([])
      }
    } catch (error) {
      console.log(error)
    }
  }



  const [value, setValue] = useState({
    "title": "",
    "subtitle": "",
    "free": false,
    "purchased": false
  })
  const handleChange = (e) => {
    if (e.target.name == 'free') {
      setValue({
        ...value,
        'free': e.target.checked
      });
    } else if (e.target.name == 'purchased') {
      setValue({
        ...value,
        'purchased': e.target.checked
      });
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      });
    }
  };

  const addMore = () => {
    if (value.title !== '') {
      const newarr = [...planComparison, value]
      setPlanComparison(newarr)
      setValue({
        ...value,
        'free': false, purchased: false, title: '', subtitle: ''
      });
    } else {
      if (addMoreToggle) {
        toastifyError('Title and Sub Title are required !!')
      }
      setAddMoreToggle(true)
    }
  }

  const handleSubmitPlanComparison = async () => {
    try {
      let params = { comparison: planComparison };

      if (value.key !== undefined && value.key >= 0 && value.key < planComparison.length) {
          const index = value.key;
          const newPlanComparison = [...planComparison];
          newPlanComparison[index] = value;
          params.comparison = newPlanComparison;
      }else{
        params.comparison = [...planComparison, value];
      }
      const res = await axiosInstance.post('/admin/saveOrUpdateComparison', params)
      if (res?.data.status === 200) {
        toastifySuccess(res?.data?.message)
        getPlanCompareList()
        setAddMoreToggle(false);
        setValue({
          ...value,
          'free': false, purchased: false, title: '', subtitle: '', key: null
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removePlanComparisonFromArray = (index) => {
    const newPlanComparison = [...planComparison];
    newPlanComparison.splice(index, 1);
    setPlanComparison(newPlanComparison);
  };

  const updatePlanComparison = (key, item) => {
    setValue({ key, ...item })
    setAddMoreToggle(true)

  };

  const handleCancel = () => {
    setValue({
      ...value,
      'free': false, purchased: false, title: '', subtitle: ''
    });
    setPage(false); setAddMoreToggle(false); setPlanComparison(planComparisonActualData)
  }

  return (
    <div>
      {loading ? (
        <div className="loader">
          <Box sx={{ display: "flex" }}>
            <CircularProgress size={60} />
          </Box>
        </div>
      ) : (
        <>
          <div className="top_tab_bar">
            <div>
              <h2>Subscription Plan</h2>
            </div>

            <div className="option_bar">
              <div className="">
                <Button
                  className=" global_dashbtn d-block"
                  onClick={() => setPage('planCompare')}
                >
                  <div>Plan Compare </div>
                </Button>
              </div>
              <div className="input-box">
                <TextField
                  id="demo-helper-text-aligned-no-helper "
                  label="Search by Plan"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

            </div>
          </div>

          <ComponentSkeleton>
            <Grid container spacing={3}>
              {
                page ?
                  <>
                    <Grid container style={{ justifyContent: 'left' }}>
                      <Grid item xs={12} className="box mt-3 mx-3">
                        <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
                          <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Title</StyledTableCell>
                                <StyledTableCell>Sub Title</StyledTableCell>
                                <StyledTableCell align="left">Free</StyledTableCell>
                                <StyledTableCell align="left">Purchased</StyledTableCell>
                                <StyledTableCell align="left">Action</StyledTableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {planComparison.map((row, key) => (
                                <StyledTableRow key={key}>
                                  <StyledTableCell>{row.title}</StyledTableCell>
                                  <StyledTableCell>{row.subtitle}</StyledTableCell>
                                  <StyledTableCell align="left"><Checkbox disabled={!row?.free} checked={row?.free} /></StyledTableCell>
                                  <StyledTableCell align="left"><Checkbox disabled={!row?.purchased} checked={row?.purchased} /></StyledTableCell>
                                  <StyledTableCell align="left">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "11px",
                                      }}
                                    >
                                      <Button className="edit_btn_global action-btn d-block" onClick={() => updatePlanComparison(key, row)}>
                                        <Tooltip title="Edit">
                                          <ModeEditOutlineIcon />
                                        </Tooltip>
                                      </Button>
                                      <Button className="dlt_btn action-btn d-block" onClick={() => removePlanComparisonFromArray(key)}>
                                        <Tooltip title="Delete">
                                          <DeleteOutlineIcon />
                                        </Tooltip>
                                      </Button>
                                    </div>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}

                              {
                                addMoreToggle &&
                                <StyledTableRow>
                                  <StyledTableCell>
                                    <div className={`group error`}>
                                      <textarea
                                        className="inputMaterial"
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        value={value.title}
                                        onChange={handleChange}
                                        required
                                      />
                                      <span className="bar"></span>
                                    </div>
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    <div className={`group error`}>
                                      <textarea
                                        className="inputMaterial"
                                        type="text"
                                        name="subtitle"
                                        placeholder="Sub Title"
                                        value={value.subtitle}
                                        onChange={handleChange}
                                        required
                                      />
                                      <span className="bar"></span>
                                    </div>
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    <FormControlLabel
                                      control={<Checkbox checked={value.free} name='free' className='ms-4' onChange={handleChange} />}
                                    />

                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    <FormControlLabel
                                      control={<Checkbox checked={value.purchased} name='purchased' className='ms-4' onChange={handleChange} />}
                                    />
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                  </StyledTableCell>
                                </StyledTableRow>
                              }
                            </TableBody>

                          </Table>
                          <Col md={12} className="text-end mt-2">
                            <button className="global_dashbtn" onClick={() => handleCancel()}>Cancel</button>
                            <button className="global_dashbtn mx-2" onClick={() => addMore()}>Add More</button>
                            <button className="global_dashbtn" onClick={handleSubmitPlanComparison}>Save</button>
                          </Col>


                        </Grid>

                      </Grid>
                    </Grid>

                  </>
                  :
                  <>
                    <Grid item xs={12} lg={12}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="left">S.No.</StyledTableCell>
                              <StyledTableCell align="left">
                                Plan Name
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                Plan Type
                              </StyledTableCell>
                              <StyledTableCell align="left">Radius</StyledTableCell>
                              <StyledTableCell align="left">
                                Plan Price
                              </StyledTableCell>
                              <StyledTableCell align="left">Action</StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {filteredData.map((row, key) => (
                              <StyledTableRow key={row._id}>
                                <StyledTableCell
                                  component="th"
                                  scope="row"
                                  align=""
                                >
                                  {key + 1}
                                </StyledTableCell>
                                <StyledTableCell align="">
                                  {row.plan_name}
                                </StyledTableCell>
                                <StyledTableCell align="">
                                  {row.plan_type}
                                </StyledTableCell>
                                <StyledTableCell align="">
                                  {row.radius}
                                </StyledTableCell>
                                <StyledTableCell align="">
                                  {row.amount}
                                </StyledTableCell>
                                <StyledTableCell align="">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "",
                                      alignItems: "center",
                                      gap: "11px",
                                    }}
                                  >
                                    <Button
                                      className="edit_btn_global action-btn d-block"
                                      onClick={() => EditPlan(row)}
                                    >
                                      <Tooltip title="Edit">
                                        <ModeEditOutlineIcon />
                                      </Tooltip>
                                    </Button>
                                    {/* '    <Button
                                className="dlt_btn action-btn d-block"
                                onClick={(e) => removePlanComparisonFromArray(e, row._id)}
                              >
                                <Tooltip title="Delete">
                                  <DeleteOutlineIcon />
                                </Tooltip>
                              </Button>' */}
                                  </div>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </>
              }
            </Grid>
          </ComponentSkeleton>
        </>
      )}
    </div>
  );
};
export default ViewPlan;
