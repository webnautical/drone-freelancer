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
import defaulPath from '../../assets/images/default-placeholder.png';
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

export default function Topcategorylist() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // const handleFilterChange = (event) => {
  //     setFilterElement(event.target.value);

  // };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredResults = records.filter((record) => record.imino.toLowerCase().includes(query.toLowerCase()));

    setFilteredData(filteredResults);
  };

  const getData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/admin/getTopcategory`, {
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
            setFilteredData(res.getallcategory);
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
    fetch(`${config.url}/admin/deletTopcategory/${_id}`, {
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
        if (data.message === 'delete top category successfully') {
          window.location.reload();
          setLoading(false);
        }
        setLoading(false);
      });
  };

  const addNewTopcategory = () => {
    navigate(`${config.basename}/utils/addtopcategory`);
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
              <h2>Top Category</h2>
            </div>
            <div className="select-box">
              <div className="input-box">
                <TextField
                  id="demo-helper-text-aligned-no-helper "
                  label="Search by Category name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <Button className="edit_btn action-btn d-block" onClick={() => addNewTopcategory()}>
                  {/* <ModeEditOutlineIcon /> */}
                  <div className="global_dashbtn">Add New Category</div>
                </Button>
              </div>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.No.</StyledTableCell>
                  <StyledTableCell align="center">Category Image</StyledTableCell>
                  <StyledTableCell align="center">Category name</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, key) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {key + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.image ? (
                        <img src={row.image} alt="categoery" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                      ) : (
                        <img src={defaulPath} alt="Default categoery" style={{ width: '100px', height: '100px' }} />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.category_name}</StyledTableCell>
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
