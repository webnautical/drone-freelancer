import { Grid, Box } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';

import TableBody from '@mui/material/TableBody';

import TextField from '@mui/material/TextField';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import TableContainer from '@mui/material/TableContainer';

import TableHead from '@mui/material/TableHead';

import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';

import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

import { useState, useEffect } from 'react';

import { Button, Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import config from 'config';

import '../App.css';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

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
import { toastifyError, toastifySuccess } from "Utility/Utility";
import { timeAgo } from 'Utility/Date';
const Postedjob = () => {
  const navigate = useNavigate();

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredResults = userList.filter(
      (record) => record.job_details.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  const getData = async () => {
    setLoading(true)
    try {
      fetch(`${config.url}/user/getAllPostedJobs`, {
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
          if (data.message === 'get data successfully') {
            setFilteredData(data.getpostedjob);
            setUserList(data.getpostedjob);
            setLoading(false);

          }
        });
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  function startEdit(e, row) {
    navigate(`${config.basename}/utils/updateposte`, {
      state: { data: row },
    });
  }

  const singleDelete = (_id) => {
    fetch(`${config.url}/user/deleteJobById/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      }
    })
      .then((res) => {
        return res.json();
      }).then((data) => {
        console.log(data);
        if (data.status === 200) {
          toastifySuccess("Job deleted successfully")
        } else {
          toastifyError("Something want wrong")
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function handleNavigate(row) {
    navigate(`${config.basename}/job-details`, {
      state: row
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="top_tab_bar">
        <div>
          <h2>Posted Jobs</h2>
        </div>

        <div className="input-box">
          <TextField

            id="demo-helper-text-aligned-no-helper "
            label="Search by Job title"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Grid container spacing={3}>
        {loading ? (
          <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Box>
              <CircularProgress size={60} />
            </Box>
          </div>
        ) : (
          <Grid item xs={12} lg={12}>
            <TableContainer component={Paper} className="dahbard_table_inner">
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">S.No.</StyledTableCell>
                    <StyledTableCell align="left"> Job Title</StyledTableCell>
                    {/* <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Phone</StyledTableCell> */}
                    {/* <StyledTableCell align="left">Job Type</StyledTableCell> */}
                    <StyledTableCell align="left">Work due date</StyledTableCell>
                    <StyledTableCell align="left">Name</StyledTableCell>
                                            <StyledTableCell align="left">Email</StyledTableCell>
                                            <StyledTableCell align="left">Send message</StyledTableCell>
                    <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentItems.map((row, key) => (
                    <StyledTableRow key={row._id}>
                      <StyledTableCell component="th" scope="row" align="left">
                      {(currentPage - 1) * itemsPerPage + key + 1}
                      </StyledTableCell>

                      <StyledTableCell align="center">{row.job_details.name}</StyledTableCell>

                      {/* <StyledTableCell align="center">{row.email}</StyledTableCell>
 
                    <StyledTableCell align="center">{row.phone}</StyledTableCell> */}

                      {/* <StyledTableCell align="center">{row.job_type}</StyledTableCell> */}

                      <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>
                      <StyledTableCell align="center">{row.userName}</StyledTableCell>
                                                <StyledTableCell align="center">{row.userEmail}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button className="view_btn action-btn d-block" onClick={() => navigate(`${config.basename}/sendmessage`, {state: {_id : row.user_id}})}>
                                                        <Tooltip title="Send message"><ForwardToInboxIcon /></Tooltip>
                                                    </Button>
                                                </StyledTableCell>
                      <StyledTableCell align="center">
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center',
                            gap: '11px'
                          }}
                        >
                          <div>
                            <Button
                              className="edit_btn_global action-btn d-block"
                              onClick={(e) => {
                                startEdit(e, row);
                              }}
                            >
                              <Tooltip title="edit ">
                                <ModeEditOutlineIcon />
                              </Tooltip>
                            </Button>
                          </div>

                          <Button className="dlt_btn action-btn d-block" onClick={() => singleDelete(row._id)}>
                            <Tooltip title="Delete">
                              <DeleteOutlineIcon />
                            </Tooltip>
                          </Button>
                          <Button className="view_btn action-btn d-block" onClick={() => handleNavigate(row)}>
                            <Tooltip title="View Details">
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
        )}
      </Grid>
    </div>
  );
};

export default Postedjob