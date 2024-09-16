import {
    //  Breadcrumbs, Divider,
    Grid
    //   Link, Stack, Typography
} from '@mui/material';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
// import { useNavigate, Link } from "react-router-dom";
import { Button, Box, Stack } from '@mui/material';
import defaulPath from "../assets/images/default-placeholder.png"
import Pagination from '@mui/material/Pagination';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import config from 'config';
import '../App.css';
import EditNoteIcon from '@mui/icons-material/EditNote';
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
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));
import { handleDownloadExcel } from "../Utility/Utility"
import { Checkbox, FormControl, FormControlLabel } from '../../node_modules/@mui/material/index';
const Product = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setloading] = useState(true);

    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);

    const [filteredData, setFilteredData] = useState([]);
    // const [filterElement, setFilterElement] = useState("selectNothing");
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filteredResults = userList.filter(
            (record) => record.title.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filteredResults);
    };

    const getData = async () => {
        try {
            setloading(true)
            fetch(`${config.url}/admin/getProductListByadmin`, {
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
                    if (data.message === 'Product get successfully') {
                        setFilteredData(data.getProductList);
                        setUserList(data.getProductList);
                        setloading(false)

                    }
                    setloading(false)

                });
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);
    const rejectProduct = async (row) => {
        try {
            setloading(true);
            fetch(`${config.url}/admin/productApproval/${row._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.jwt}`
                },
                body: JSON.stringify({ product_status: "reject" })
            })
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    if (data.message === "Product updated successfully") {
                        getData()
                        setloading(false);
                    }
                    setloading(false);
                });
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    };

    function handleApproved(row) {
        try {
            setloading(true);
            fetch(`${config.url}/admin/productApproval/${row._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.jwt}`
                },
                body: JSON.stringify({ product_status: "approved" })
            })
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    if (data.message === "Product updated successfully") {
                        getData()
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
        navigate(`${config.basename}/viewProduct`, {
            state: row
        });
    }

    function handleEdit(row) {
        navigate(`${config.basename}/utils/editProduct`, {
            state: row
        });
    }

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
        ({
            "Product Title": sponsor.title,
            "Location": sponsor.location,
            "Price": sponsor.price,
            "Status": sponsor.status,

            "Description": sponsor.description,
            "Product approval": sponsor.product_approval,
            "Images url": Array.isArray(sponsor.images) ? sponsor.images.join(', ') : sponsor.images,

            "Create Date": sponsor.createdAt,

        })
        )
        return result
    }
    const downloadExcel = () => {
        handleDownloadExcel(changeArrFilterData(filteredData), "ProductList", "Product")
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    console.log("currentItems", currentItems)
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

                    <div className="top_tab_bar">
                        <div>
                            <h2>Product List</h2>
                        </div>

                        <div className="input-box">
                            <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
                                Export to Excel
                            </Button>
                            <TextField
                                id="demo-helper-text-aligned-no-helper "
                                label="Search by Title"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12}>
                            <TableContainer component={Paper} className="dahbard_table_inner">
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">S.No.</StyledTableCell>
                                            <StyledTableCell align="left">Image</StyledTableCell>
                                            <StyledTableCell align="left">Product Title</StyledTableCell>
                                            <StyledTableCell align="left">Price</StyledTableCell>
                                            <StyledTableCell align="left">Location</StyledTableCell>
                                            <StyledTableCell align="left">Product Status</StyledTableCell>
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
                                                <StyledTableCell align="left">
                                                    {row?.images[0] ? (
                                                        <img src={row.images[0]} alt="product" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                                                    ) : (
                                                        <img src={defaulPath} alt="Default Product" style={{ width: '50px', height: '50px', borderRadius: '5px' }} />
                                                    )}
                                                </StyledTableCell>

                                                <StyledTableCell align="center">{row.title}</StyledTableCell>
                                                <StyledTableCell align="center">{row.price}</StyledTableCell>
                                                <StyledTableCell align="center">{row.location}</StyledTableCell>
                                                <StyledTableCell align="center">{row.product_approval}</StyledTableCell>

                                                <StyledTableCell align="center">{row.userName}</StyledTableCell>
                                                <StyledTableCell align="center">{row.userEmail}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Button className="view_btn action-btn d-block" onClick={() => navigate(`${config.basename}/sendmessage`, { state: { _id: row.user_id } })}>
                                                        <Tooltip title="Send message"><ForwardToInboxIcon /></Tooltip>
                                                    </Button>
                                                </StyledTableCell>

                                                <StyledTableCell align="center">
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'left',
                                                            alignItems: 'center',
                                                            gap: '11px'
                                                        }}
                                                    >

                                                        <Button className="view_btn action-btn d-block" onClick={() => handleNavigate(row)}>
                                                            <Tooltip title="View Details">
                                                                <RemoveRedEyeIcon />
                                                            </Tooltip>
                                                        </Button>
                                                        {/* <Button className="dlt_btn action-btn d-block" onClick={() => rejectProduct(row)}>
                                                            <Tooltip title="Reject Product">
                                                                <SwipeLeftIcon />
                                                            </Tooltip>
                                                        </Button> */}
                                                        {/* <Button className="edit_btn_global action-btn d-block" onClick={() => handleApproved(row)}>
                                                            <Tooltip title="Approve Product">
                                                                <CheckBoxIcon />
                                                            </Tooltip>
                                                        </Button> */}
                                                        <FormControl className="check_select_outer mb-0">
                                                            <Tooltip
                                                                title={row.product_approval === "approved" ? "Product is already approved" : "Reject Product"}
                                                            >
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={row.product_approval === "reject"}
                                                                            onChange={() => rejectProduct(row)}
                                                                            disabled={row.product_approval !== "approved"} // Disable if product is approved
                                                                            style={{
                                                                                color: row.product_approval !== "approved" ? '#1677ff' : undefined,
                                                                            }}
                                                                        />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </FormControl>

                                                        <FormControl className="check_select_outer mb-0">
                                                            <Tooltip
                                                                title={row.product_approval === "reject" ? "Product is already rejected" : "Approve Product"}
                                                            >
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={row.product_approval === "approved"}
                                                                            onChange={() => handleApproved(row)}
                                                                            disabled={row.product_approval !== "reject"} // Disable if product is rejected
                                                                            style={{
                                                                                color: row.product_approval !== "reject" ? '#1677ff' : undefined,
                                                                            }}
                                                                        />
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        </FormControl>

                                                        <Button className="view_btn action-btn d-block" onClick={() => handleEdit(row)}>
                                                            <Tooltip title="Edit Product">
                                                                <EditNoteIcon />
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
                    </Grid>

                </>
            )}
        </div>
    );
};
export default Product;