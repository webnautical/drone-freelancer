import * as React from 'react';
import {
  //  Breadcrumbs, Divider,
  Grid
  //   Link, Stack, Typography
} from '@mui/material';
// import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import {Box, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import config from 'config';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
// import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { timeAgo } from 'Utility/Date';
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

const DeleteUser = () => {
  const {type} = useParams()
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const getPayload = (type) => type == "delete" ? { isDeleted: true } : {};

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

  useEffect(() => {
    getData();
  }, [type]);


  return (
    <div>
        <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <Box>
            <CircularProgress size={60} />
          </Box>
        </div>
        <>
          <div className="dahbard_table  top_tab_bar">
            <div>
              <h2>{"Delete User"} </h2>
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
                      <StyledTableCell align="left">IP</StyledTableCell>
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
                        <StyledTableCell align="center">{row?.ip ? row.ip : "N/A"}</StyledTableCell>
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
    </div>
  );
};
export default DeleteUser;