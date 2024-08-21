import {
    //  Breadcrumbs, Divider,
    Grid,
    //   Link, Stack, Typography
} from '@mui/material';


import ComponentSkeleton from '../pages/components-overview/ComponentSkeleton';
import DownloadIcon from '@mui/icons-material/Download';

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput, Stack, Pagination } from "@mui/material";
import config from "config";
import "../App.css";
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


import { AdminLoading, apiBaseURL, handleDownloadExcel } from "../Utility/Utility"
import { timeAgo } from 'Utility/Date';

const ViewAlltransction = () => {
    // const navigate = useNavigate();
    // const [userList, setUserList] = useState([]);
    const [loading, setloading] = useState(false);
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredDatalist, setFilteredDatalist] = useState([]);

    const [filterElement, setFilterElement] = useState("selectNothing");

    const handleFilterChange = (event) => {
        // console.log(event.target.value);
        setFilterElement(event.target.value);
    };

    const getData = async () => {
        setloading(true)
        try {
            fetch(`${config.url}/admin/getAlltransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.jwt}`
                },
            })
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    if (data.status === 200) {
                        setFilteredData(data?.alltransaction);
                        setFilteredDatalist(data?.alltransaction)
                        setloading(false)

                    }
                });
        } catch (error) {
            console.log(error);
            setloading(false)

        }
    };
    useEffect(() => {
        if (filterElement === "selectNothing") {
            // console.log(filterElement)
            setFilteredData(filteredDatalist)
        } else if (filterElement === "week") {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7); // Subtract 7 days for last week

            const sortingData = filteredDatalist.filter(
                item => new Date(item.created_at) >= lastWeek && new Date(item.created_at) <= today
            );
            setFilteredData(sortingData)
        } else if (filterElement === "month") {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 30); // Subtract 7 days for last week

            const sortingData = filteredDatalist.filter(
                item => new Date(item.created_at) >= lastWeek && new Date(item.created_at) <= today
            );
            setFilteredData(sortingData)
        } else {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 365); // Subtract 7 days for last week

            const sortingData = filteredDatalist.filter(
                item => new Date(item.created_at) >= lastWeek && new Date(item.created_at) <= today
            );
            setFilteredData(sortingData)
        }
    }, [filteredData, filterElement, filteredDatalist]);

    useEffect(() => {
        getData();
    }, []);

    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
            ({ 
                "Transaction Id": sponsor.transaction_id, 
                "Status": sponsor.status, 
                "First Name": sponsor.invoice_details.first_name, 
                "Last Name": sponsor.invoice_details.last_name, 
                "Company Name": sponsor.invoice_details.company_name, 
                "Email": sponsor.invoice_details.email, 
                "ABN": sponsor.invoice_details.abn, 
                "Address": sponsor.invoice_details.address, 
                "Amount": sponsor.amount, "Payment Method": "", "Plan Name": sponsor.plan_id, "Extra Category": sponsor.extra_category, "Date": sponsor.created_at 
            })
        )
        return result
    }
    const downloadExcel = () => {
        handleDownloadExcel(changeArrFilterData(filteredData), "Transactionlist", "Transaction")
    };

    // console.log("filteredData",filteredData)
    // console.log("ExelData",changeArrFilterData(filteredData))

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const downloadPDF = (pdf) => {
        const newPath = pdf.replace("public/", "");
        window.open(apiBaseURL() + "/" + newPath, '_blank');
    }
    return (
        <>
        {loading ? (
            <AdminLoading />
        ) : (
        <ComponentSkeleton>
            <div className='top_tab_bar'>
                <div>
                    <h2>All Transaction</h2>
                </div>
                <div className='d-flex align-items-center'>
                    <Button className="global_dashbtn" onClick={() => downloadExcel()}>
                        Export to Excel
                    </Button>
                    <div className="input-box">
                        <div className='option_bar'>
                         
                            <div style={{}}>
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="demo-multiple-name-label">Filter</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        value={filterElement}
                                        onChange={handleFilterChange}
                                        input={<OutlinedInput label="Filter" />}
                                    >
                                        <MenuItem value="selectNothing">Filter by date</MenuItem>
                                        <MenuItem value="week">Last week </MenuItem>
                                        <MenuItem value="month">Last Month</MenuItem>
                                        <MenuItem value="year">Last Year</MenuItem>
                                    </Select>

                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>

                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">S.No.</StyledTableCell>
                                    <StyledTableCell align="center">Fullname</StyledTableCell>
                                    <StyledTableCell align="center">Address</StyledTableCell>
                                    <StyledTableCell align="center">Company Name</StyledTableCell>
                                    <StyledTableCell align="center">Invoice</StyledTableCell>
                                    <StyledTableCell align="center">ABN</StyledTableCell>

                                    <StyledTableCell align="center">Transaction Id</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center">Payment Method</StyledTableCell>
                                    <StyledTableCell align="center">Plan Name</StyledTableCell>
                                    <StyledTableCell align="center">Extra Category</StyledTableCell>
                                    <StyledTableCell align="center">Date</StyledTableCell>

                                    {/* <StyledTableCell align="center">Action</StyledTableCell> */}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {currentItems.map((row, key) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell component="th" scope="row" align="center">
                                            {(currentPage - 1) * itemsPerPage + key + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.invoice_details?.first_name ? row.invoice_details?.first_name + " " + row.invoice_details?.last_name : "---"}</StyledTableCell>
                                        <StyledTableCell align="center">{row.invoice_details?.address ? row.invoice_details?.address : "---"}</StyledTableCell>
                                        <StyledTableCell align="center">{row.invoice_details?.company_name ? row.invoice_details?.company_name : "---"}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained" onClick={() => downloadPDF(row?.invoice)} size="small" className='text-uppercase' endIcon={<DownloadIcon />}>Inovoice</Button>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.invoice_details?.abn ? row.invoice_details?.abn : '---'}</StyledTableCell>
                                        <StyledTableCell align="center">{row.transaction_id}</StyledTableCell>
                                        <StyledTableCell align="center">{row.status}</StyledTableCell>
                                        <StyledTableCell align="center">{row.amount}</StyledTableCell>
                                        <StyledTableCell align="center" className='text-uppercase'>{row.payment_method}</StyledTableCell>
                                        <StyledTableCell align="center">{row.plan_id}</StyledTableCell>
                                        <StyledTableCell align="center"> {row.extra_category?.join(', ') ?? ''}</StyledTableCell>
                                        <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>
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
        </ComponentSkeleton>
        )}
        </>
    );
}
export default ViewAlltransction;