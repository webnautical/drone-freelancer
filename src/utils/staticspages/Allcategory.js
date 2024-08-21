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
import { Button, Tooltip } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box } from '@mui/material';
import defaulPath from '../../assets/images/default-placeholder.png';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from 'config';
import Form from 'react-bootstrap/Form';
 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toastifyError, toastifySuccess } from "Utility/Utility";
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
import '../../App.css';
export default function ReviewsList() {
  const navigate = useNavigate();
  // const [dataReloaded, setDataReloaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [recorddata, setRecorddata] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [topcategory, setTopcategory] = useState([]);
 
  // const handleFilterChange = (event) => {
  //     setFilterElement(event.target.value);
 
  // };
 
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
 
    const filteredResults = recorddata.filter((record) => record.category_name.toLowerCase().includes(query.toLowerCase()));
 
    setFilteredData(filteredResults);
  };
 
  const getData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/admin/getAllJobCategory`, {
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
          if (res.message === 'get category data successfully') {
            setFilteredData(res.getCategory);
            setRecorddata(res.getCategory);
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
  }, []); //handledelete
 
  const singleDelete = (event, _id) => {
    event.preventDefault();
    setLoading(true);
    console.log(_id);
    // alert('sjsjsj');
    fetch(`${config.url}/admin/deletecategory/${_id}`, {
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
        if (data.message === 'Category deleted successfully') {
          getData()
          setLoading(false);
        }
        setLoading(false);
      });
  };
  // const handledit = (row) => {
 
  //     fetch(`${config.url}/admin/deletReviews/${row._id}`, {
  //         method: 'DELETE',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${localStorage.jwt}`
  //         }
  //     })
  //         .then((res) => {
  //             return res.json();
  //         })
  //         .then((data) => {
  //             console.log(data);
  //             if (data.message === 'delet reviews successfully') {
  //                 window.location.reload();
  //                 setLoading(false);
  //             }
  //             setLoading(false);
  //         });
  // };
 
  const setIdtoarray = (row) => {
    try {
     let topactegoryvalue;
      if(row?.topcategory === false){
        topactegoryvalue=true
      }else{
        topactegoryvalue=false  
      }
     
      fetch(`${config.url}/admin/addTopcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify({
          category_id: row?._id,
          statusValue:topactegoryvalue
        })
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data, "hdhhdhd");
          if (data.status === 200) {
            toastifySuccess(data.message)
            getData()
            // setDataReloaded(true);
          } else {
            toastifyError(data.message);
          }
        });
    } catch (error) {
      console.log(error,"error")
    }
  };
  // useEffect(() => {
  //   if (dataReloaded) {
  //     // Reset the state to false after re-rendering
  //     setDataReloaded(false);
  //     // Perform any other actions you need after the partial reload
  //   }
  // }, [dataReloaded]);
  const addNewReviews = () => {
    navigate(`${config.basename}/utils/addnewcategory`);
  };
  const handledit = (row) => {
    navigate(`${config.basename}/utils/editcategory`, {
      state: { data: row }
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
              <h2>All Category</h2>
            </div>
            <div className="select-box">
              <div className="input-box">
                <TextField id="demo-helper-text-aligned-no-helper " label="Search by name" value={searchQuery} onChange={handleSearch} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <Button className="edit_btn action-btn d-block" onClick={() => addNewReviews()}>
                  {/* <ModeEditOutlineIcon /> */}
                  <div className="global_dashbtn">Add New Category</div>
                </Button>
              </div>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="">S.No.</StyledTableCell>
                  <StyledTableCell align="">Category Name</StyledTableCell>
                  <StyledTableCell align="">Image</StyledTableCell>
                  <StyledTableCell align="">Top Category</StyledTableCell>
                  <StyledTableCell align="">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, key) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="">
                      {key + 1}
                    </StyledTableCell>
                    <StyledTableCell align="">{row.category_name}</StyledTableCell>
                    <StyledTableCell align="">
                      {row?.image ? (
                        <img src={row.image} alt="category" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                      ) : (
                        <img src={defaulPath} alt="Default categoery" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align=""><div className='accces_menu_check_box'>
                      <Form.Check
                        inline
                        // label="top cat"
                        name="marketplace"
                        type="checkbox"
                        id={`inline-checkbox-3`}
                        checked={row?.topcategory}
                        onChange={() => setIdtoarray(row)}
                      />
                    </div> </StyledTableCell>
                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: '',
                          alignItems: 'center',
                          gap: '11px'
                        }}
                      >
                        <Button className="edit_btn_global action-btn d-block" onClick={() => handledit(row)}>
                          <Tooltip title="Edit Category">
                            <ModeEditIcon />
                          </Tooltip>
                        </Button>
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