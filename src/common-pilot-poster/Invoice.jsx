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
import { timeAgo } from 'Utility/Date';
import Loading from 'Utility/Loading';
import ThereAreNoData from 'Utility/ThereAreNoData';
import { axiosInstance } from 'Utility/Api';

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

const Invoice = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionList] = useState([]);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactionList?.slice(indexOfFirstItem, indexOfLastItem);
    const [loading, setLoading] = useState(false)
    const getInvoice = async () => {
        setLoading(false)
        try {
            const res = await axiosInstance.post('user/get_invoice_detail')
            console.log("get_invoice_detail",res)
            // if (res?.status === 200) {

            // }
        } catch (error) { console.error(error) }
    }
    useEffect(() => {
        getInvoice()
    }, [])
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ mt: 3.25 }}>
                    <Typography variant="h5" className="global_top_head">
                        Invoice List
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
                                                                            <StyledTableCell align="center">Status</StyledTableCell>
                                                                        </TableRow>
                                                                    </TableHead>

                                                                    <TableBody>
                                                                        {currentItems.reverse().map((row, key) => (
                                                                            <StyledTableRow key={row._id}>
                                                                                <StyledTableCell component="th" scope="row" align="center">
                                                                                    {key + 1}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="center">
                                                                                    <strong>${row.amount} AUD</strong>
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="center">
                                                                                    {row.plan_name}
                                                                                </StyledTableCell>
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
                                                                                    <button className={`btn btn-sm ${row.transaction_id !== '' ? "btn-success" : "btn-danger"}`}>
                                                                                        {row.transaction_id !== '' ? "Payment success" : "Payment Failed"}
                                                                                    </button>
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="left">
                                                                                    <div
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            flexDirection: 'row',
                                                                                            justifyContent: 'center',
                                                                                            gap: '10px'
                                                                                        }}
                                                                                    >
                                                                                    </div>
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
                                                        you don&apos;t have any invoice<span>No inovice records were found for your account</span>
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

export default Invoice