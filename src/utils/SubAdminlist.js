import {
    //  Breadcrumbs, Divider,
    Grid
    //   Link, Stack, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { Button, Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
// import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import config from 'config';
import Tooltip from '@mui/material/Tooltip';
//   import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import '../App.css';
//   import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
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
const SubAdminlist = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [userList, setUserList] = useState([]);
    // const [loading, setloading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    // const [filterElement, setFilterElement] = useState("selectNothing");
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredResults = userList.filter(
            (record) => record.first_name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filteredResults);
    };
    // console.log(localStorage.jwt,"dhhdhdhdhdhh")
    const getData = async () => {
        try {
            fetch(`${config.url}/admin/getSubAdminList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.jwt}`
                }
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.message === 'get data successfully') {
                        console.log(data.getadmindata, "data.getadmindata")
                        setFilteredData(data.getadmindata);
                        setUserList(data.getadmindata);
                    } else if (data.message === 'data not get successfully') {
                        setFilteredData([]);
                        setUserList([]);
                    }
                });
        } catch (error) {
            console.log(error);
            // setLoading(false);
        }
    };

    // function startEdit(row) {
    //   navigate(`${config.basename}/utils/updateuser`, {
    //     state: { data: row }
    //   });
    // }

    const singleDelete = (event, _id) => {
        event.preventDefault();

        fetch(`${config.url}/admin/Subadmindelete/${_id}`, {
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
                if (data.message === 'Subadmin deleted successfully') {
                    toastifySuccess('Subadmin deleted successfully')
                    window.location.reload();
                } else {
                    toastifyError('Subadmin not deleted successfully')
                }
            });
        // setloading(false);
    };

    useEffect(() => {
        getData();
    }, []);
    //

    //    function handleprefferd(row) {
    //     try {
    //       fetch(`${config.url}/admin/createpreffredlocation/${row._id}`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${localStorage.jwt}`
    //         }
    //       })
    //         .then((res) => {
    //           return res.json();
    //         })
    //         .then((data) => {
    //           if (data.message === 'create prefferd successfully') {
    //             toastifySuccess('create prefferd successfully!');
    //           }else if(data.message === 'Un prefferd successfully'){
    //             toastifySuccess('Un prefferd successfully')
    //           }else{
    //             toastifyError('something want wrong')
    //           }
    //         });
    //     } catch (error) {
    //       console.log(error);
    //       // setLoading(false);
    //     }
    //   }

    function handleNavigate(row) {
        navigate(`${config.basename}/user-details`, {
            state: row
        });
    }

    const addNewSubadmin = () => {
        navigate(`${config.basename}/utils/addnewsubadmin`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <ComponentSkeleton>
            <div className="dahbard_table top_tab_bar">
                <div>
                    <h2>Sub admin</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button className="edit_btn action-btn d-block" onClick={() => addNewSubadmin()}>
                        {/* <ModeEditOutlineIcon /> */}
                        <div className="global_dashbtn">Add New Subadmin</div>
                    </Button>
                </div>
                <div className="input-box">
                    <TextField
                        id="demo-helper-text-aligned-no-helper "
                        label="Search by Name and Phone"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                    {/* <div>User management</div> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">S.No.</StyledTableCell>
                                    <StyledTableCell align="center">Name</StyledTableCell>
                                    <StyledTableCell align="center">Email</StyledTableCell>
                                    <StyledTableCell align="center">Phone</StyledTableCell>
                                    <StyledTableCell align="center">User Type</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {currentItems.reverse().map((row, key) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell component="th" scope="row" align="center">
                                        {(currentPage - 1) * itemsPerPage + key + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center"> {row.name}</StyledTableCell>
                                        <StyledTableCell align="center">{row.email}</StyledTableCell>
                                        <StyledTableCell align="center">{row.phone}</StyledTableCell>
                                        <StyledTableCell align="center">{row.role}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    // alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <div>
                                                    {/* <Button
                              className="edit_btn_global action-btn d-block"
                              onClick={() => {
                                startEdit(row);
                              }}
                            >
                              <Tooltip title="Edit">
                                <ModeEditOutlineIcon />
                              </Tooltip>
                            </Button> */}
                                                </div>
                                                <Button className="dlt_btn action-btn d-block" onClick={(e) => singleDelete(e, row._id)}>
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
                </Grid>
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
        </ComponentSkeleton>
    );
};
export default SubAdminlist;