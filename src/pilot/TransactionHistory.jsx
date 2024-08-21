import React, { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import config from 'config';
import { getAllLocatData } from 'Utility/Utility';
import { timeAgo } from 'Utility/Date';
import Loading from 'Utility/Loading';
import ThereAreNoData from 'Utility/ThereAreNoData';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '../../node_modules/@mui/material/index';
// import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
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

const TransactionHistory = () => {
    // const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionList, setTransactionList] = useState([]);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactionList?.slice(indexOfFirstItem, indexOfLastItem);
    const [loading, setLoading] = useState(false)
    const getTransaction = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${config.url}/user/getPilottransections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` }
            });
            const resRes = await res.json();
            console.log("getTransaction", resRes)
            if (resRes.status == 200) {
                setTransactionList(resRes.transection_data);
                setLoading(false)
            } else {
                setTransactionList([]);
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setTransactionList([]);
            setLoading(false)
        }
    }
    useEffect(() => {
        getTransaction()
    }, [])

    const downloadPDF = (pdf) => {
        window.open(pdf, '_blank');
    }
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ mt: 3.25 }}>
                    <Typography variant="h5" className="global_top_head">
                        Transaction History
                    </Typography>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        <div className='top_box'>
                            <div className="chat_ui ">
                                <Grid container spacing={3} className="outlistingouter">
                                    <Grid item xs={12} lg={12} >
                                        {
                                            loading ? <Loading /> :
                                                transactionList.length > 0 ?
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} lg={12}>
                                                            {/* <div>User management</div> */}
                                                            <TableContainer component={Paper}>
                                                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <StyledTableCell align="center">S.No.</StyledTableCell>
                                                                            <StyledTableCell align="center">amount</StyledTableCell>
                                                                            <StyledTableCell align="center">Plan Name</StyledTableCell>
                                                                            <StyledTableCell align="center">Extra Category</StyledTableCell>
                                                                            <StyledTableCell align="center">Date</StyledTableCell>
                                                                            <StyledTableCell align="center">Invoice</StyledTableCell>
                                                                            <StyledTableCell align="center">Status</StyledTableCell>
                                                                        </TableRow>
                                                                    </TableHead>

                                                                    <TableBody>
                                                                        {currentItems.reverse().map((row, key) => (
                                                                            <StyledTableRow key={row._id}>
                                                                                <StyledTableCell component="th" scope="row" align="center">{key + 1}</StyledTableCell>
                                                                                <StyledTableCell align="center"><strong>${row.amount} AUD</strong></StyledTableCell>
                                                                                <StyledTableCell align="center">{row.plan_name}</StyledTableCell>
                                                                                <StyledTableCell align="center">
                                                                                    {
                                                                                        row?.extra_category.length > 0 ?
                                                                                            row?.extra_category?.map((item, i) => (
                                                                                                <>
                                                                                                    <span key={i}>{item}</span>
                                                                                                    {i < row?.extra_category?.length - 1 && <span>, </span>}
                                                                                                </>
                                                                                            )) :
                                                                                            <>---</>
                                                                                    }
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>

                                                                                <StyledTableCell align="center">
                                                                                    <Button variant="contained" onClick={() =>downloadPDF(row.invoice)}  size="small" className='text-uppercase' endIcon={<DownloadIcon />}>Invoice</Button>
                                                                                </StyledTableCell>

                                                                                <StyledTableCell align="center">
                                                                                    <button className={`btn btn-sm text-uppercase ${row.transaction_id !== '' ? "text-success" : "text-danger"}`}>
                                                                                        <strong>{row.transaction_id !== '' ? "Paid" : "Failed"}</strong>
                                                                                    </button>
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                        {
                                                            transactionList?.length > 10 ?
                                                                <Grid container justifyContent={'center'} className="pageInation_box">
                                                                    <Grid item xl={6} lg={8} md={10} sm={12}>
                                                                        <Stack spacing={2}>
                                                                            <Pagination
                                                                                count={Math.ceil(transactionList.length / itemsPerPage)}
                                                                                page={currentPage}
                                                                                onChange={(event, page) => setCurrentPage(page)}
                                                                                variant="outlined"
                                                                                shape="rounded"
                                                                            />
                                                                        </Stack>
                                                                    </Grid>
                                                                </Grid>
                                                                :
                                                                <></>}
                                                    </Grid>
                                                    :
                                                    <ThereAreNoData title={<div className='global_no_data'>
                                                        You don&apos;t have any transaction history<span>No transaction records were found for your account</span>
                                                    </div>} />

                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}

export default TransactionHistory