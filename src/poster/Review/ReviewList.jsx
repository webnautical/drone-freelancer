import React, { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import config from 'config';
import { defaultUserIMG, getAllLocatData } from 'Utility/Utility';
import { timeAgo } from 'Utility/Date';
import ThereAreNoData from 'Utility/ThereAreNoData';
import Loading from 'Utility/Loading';
import Rating from '@mui/material/Rating';
import { Link } from '../../../node_modules/react-router-dom/dist/index';

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

const ReviewList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false)
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviewList.slice(indexOfFirstItem, indexOfLastItem);

    const getReview = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${config.url}/user/getAllReviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` }
            });
            const resRes = await res.json();
            console.log("Review", resRes)
            setReviewList(resRes.getallreviews);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setReviewList([]);
            setLoading(false)
        }
    }
    useEffect(() => {
        getReview()
    }, [])
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ mt: 3.25 }}>
                    <Typography variant="h5" className="global_top_head">
                        Review List
                    </Typography>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <Stack spacing={3}>
                        <div className='top_box'>
                            <div className="review_list chat_ui ">
                                <Grid container spacing={3} className="outlistingouter">
                                    {
                                        loading ? <><Loading /></> :
                                            <Grid item xs={12} lg={12} >
                                                {
                                                    reviewList.length > 0 ?
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} lg={12}>
                                                                {/* <div>User management</div> */}
                                                                <TableContainer component={Paper}>
                                                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <StyledTableCell align="center">S.No.</StyledTableCell>
                                                                                <StyledTableCell align="center">Profile</StyledTableCell>
                                                                                <StyledTableCell align="center">Name</StyledTableCell>
                                                                                <StyledTableCell align="center">Star</StyledTableCell>
                                                                                <StyledTableCell align="center">Review</StyledTableCell>
                                                                                <StyledTableCell align="center">Date</StyledTableCell>
                                                                            </TableRow>
                                                                        </TableHead>

                                                                        <TableBody>
                                                                            {currentItems.reverse().map((row, key) => (
                                                                                <StyledTableRow key={row._id}>
                                                                                    <StyledTableCell component="th" scope="row" align="center">
                                                                                        {key + 1}
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell align="center">

                                                                                        <Link to={`/profile-details/${row.reviewer_Id}`}>
                                                                                            <img src={row.reviewerImage != "" ? row.reviewerImage : defaultUserIMG} alt="" style={{ height: '40px', width: '40px', borderRadius: '100%' }} />
                                                                                        </Link>
                                                                                    </StyledTableCell>
                                                                                    {/* <StyledTableCell align="center">{row.reviewer_Id}</StyledTableCell> */}
                                                                                    <StyledTableCell align="center">
                                                                                        <Link to={`/profile-details/${row.reviewer_Id}`} className='text-dark text-uppercase' style={{textDecoration: 'none'}}>
                                                                                            {row.reviewerFirstname} {row.reviewerLastname}
                                                                                        </Link>
                                                                                    </StyledTableCell>

                                                                                    <StyledTableCell align="center">
                                                                                        <Stack spacing={1}>
                                                                                            <Rating name="half-rating-read" defaultValue={row.rating} precision={0.5} readOnly />
                                                                                        </Stack>
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell align="center">{row.review}</StyledTableCell>
                                                                                    <StyledTableCell align="center">{timeAgo(row.createdAt)}</StyledTableCell>
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
                                                                reviewList.length > 10 &&
                                                                <Grid container justifyContent={'center'} className="pageInation_box">
                                                                    <Grid item xl={6} lg={8} md={10} sm={12}>
                                                                        <Stack spacing={2}>
                                                                            <Pagination
                                                                                count={Math.ceil(reviewList.length / itemsPerPage)}
                                                                                page={currentPage}
                                                                                onChange={(event, page) => setCurrentPage(page)}
                                                                                variant="outlined"
                                                                                shape="rounded"
                                                                            />
                                                                        </Stack>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        </Grid>
                                                        :
                                                        <ThereAreNoData className="" title={<div className="global_no_data mt-3">You Don&apos;t have any review job<span> there are no review jobs available for you</span></div>} />
                                                }
                                            </Grid>
                                    }
                                </Grid>
                            </div>
                        </div>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}

export default ReviewList