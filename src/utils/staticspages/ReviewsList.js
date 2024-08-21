import { styled } from '@mui/material/styles';
import '../../App.css';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from 'config';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { ToastContainer } from 'react-toastify';

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

export default function ReviewsList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [recorddata, setRecorddata] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // const handleFilterChange = (event) => {
  //     setFilterElement(event.target.value);

  // };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredResults = recorddata.filter((record) => record.name.toLowerCase().includes(query.toLowerCase()));

    setFilteredData(filteredResults);
  };

  const getData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/admin/getAllReviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res, 'jsjsjsjsj');
          if (res.message === 'get data successfully') {
            setFilteredData(res.getallreview);
            setRecorddata(res.getallreview);
            setLoading(false);
          }
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const singleDelete = (event, _id) => {
    event.preventDefault();
    setLoading(true);
    console.log(_id);
    // alert('sjsjsj');
    fetch(`${config.url}/admin/deletReviews/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === 'delet reviews successfully') {
          window.location.reload();
          setLoading(false);
        }
        setLoading(false);
      });
  };

  const addNewReviews = () => {
    navigate(`${config.basename}/utils/addreview`);
  };

  return (
    <div>
      {loading ? (
        <div className="loader">
          <Box sx={{ display: 'flex' }}>
            <CircularProgress size={60} />
          </Box>
        </div>
      ) : (
        <>
          <div className="top_tab_bar">
            <div>
              <h2>Site Reviews</h2>
            </div>
            <div className="select-box">
              <div className="input-box">
                <TextField id="demo-helper-text-aligned-no-helper " label="Search by name" value={searchQuery} onChange={handleSearch} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <Button className="edit_btn action-btn d-block" onClick={() => addNewReviews()}>
                  {/* <ModeEditOutlineIcon /> */}
                  <div className="global_dashbtn">Add New Reviews</div>
                </Button>
              </div>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="">S.No.</StyledTableCell>
                  <StyledTableCell align="">Name</StyledTableCell>
                  <StyledTableCell align="">Reviews</StyledTableCell>
                  <StyledTableCell align="">Rating</StyledTableCell>
                  <StyledTableCell align="">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, key) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="">
                      {key + 1}
                    </StyledTableCell>
                    <StyledTableCell align="">{row.name}</StyledTableCell>
                    <StyledTableCell align="">{row.reviews}</StyledTableCell>
                    <StyledTableCell align="">{row.ratting}</StyledTableCell>

                    <StyledTableCell align="">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: '',
                          alignItems: 'center',
                          gap: '11px'
                        }}
                      >
                        <Button
                          className="dlt_btn action-btn d-block"
                          onClick={(e) => {
                            singleDelete(e, row._id);
                          }}
                        >
                          <Tooltip title="Delete">
                            <DeleteOutlineIcon />
                          </Tooltip>
                        </Button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ToastContainer position="top-center" />
        </>
      )}
    </div>
  );
}
