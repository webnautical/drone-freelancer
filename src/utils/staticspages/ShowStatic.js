import { styled } from '@mui/material/styles';
import '../../App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// import TextField from '@mui/material/TextField';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
// import { Delete, Edit } from '@mui/icons-material';
import {
  Button,
  //  Grid ,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
  useNavigate
  //  Link, useLocation
} from 'react-router-dom';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
// import { ToastContainer, toast } from 'react-toastify';

import config from 'config';
// import { blue } from '@mui/material/colors';
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
import { toastifyError, toastifySuccess } from 'Utility/Utility';

export default function ShowStatic() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  // const [formerror, setFormerror] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/admin/getallStaticPagedata`, {
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
          if (data.message === 'Get static page data fund successfully') {
            setFilteredData(data.getdata);
            setLoading(false);
          } else {
            setFilteredData([]);
          }
        });
      //  const { data } = await axios.get(url);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []); //util-staticUpdate
  const startEdit = (row) => {
    navigate(`${config.basename}/utils/util-staticUpdate`, {
      state: { data: row }
    });
  };
  const addNewdata = () => {
    navigate(`${config.basename}/utils/util-addStatsdata`);
  };
  const singleDelete = (_id) => {
    fetch(`${config.url}/admin/deletedataById/${_id}`, {
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
        if (data.message == 'Deleted data successfully') {
          toastifySuccess('Deleted data successfully');
          navigate(`${config.basename}/utils/staticpage`);
        } else {
          toastifyError('Something want wrong');
          setMessage('error occured');
        }
      });
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
              <h2 className="top_bar text">Static Pages</h2>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
                alignItems: 'right',
                gap: '11px'
              }}
            >
              <Button className="global_dashbtn action-btn d-block" onClick={() => addNewdata()}>
                {/* <ModeEditOutlineIcon /> */}
                <div className="btn_txt">Add New page</div>
              </Button>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="">S.No.</StyledTableCell>
                  <StyledTableCell align="">Name</StyledTableCell>
                  <StyledTableCell align="">Language</StyledTableCell>
                  <StyledTableCell align="">Status</StyledTableCell>
                  <StyledTableCell align="">Url</StyledTableCell>
                  <StyledTableCell align="">Action</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.map((row, key) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="">
                      {key + 1}
                    </StyledTableCell>
                    <StyledTableCell align="">{row.title}</StyledTableCell>
                    <StyledTableCell align="">{row.language}</StyledTableCell>
                    <StyledTableCell align="">{row.status}</StyledTableCell>
                    <StyledTableCell align="">{row.url}</StyledTableCell>
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
                        <Button className="edit_btn_global action-btn d-block" onClick={() => startEdit(row)}>
                          <Tooltip title="Edit">
                            <ModeEditOutlineIcon />
                          </Tooltip>
                        </Button>
                        <Button className="dlt_btn action-btn d-block" onClick={() => singleDelete(row._id)}>
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
        </>
      )}
    </div>
  );
}
