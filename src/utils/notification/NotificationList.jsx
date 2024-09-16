import { Grid, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Tooltip from "@mui/material/Tooltip";
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
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
import { axiosInstance } from "Utility/Api";
import ComponentSkeleton from "pages/components-overview/ComponentSkeleton";
import { timeAgo } from "Utility/Date";
import { CloseOutlined } from "../../../node_modules/@mui/icons-material/index";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
const NotificationList = () => {

    const [notification, setNotificationList] = useState([])
    const navigate = useNavigate()
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState();
    const [loading, setloading] = useState(true);

    const getData = async (page_no) => {
        setloading(true)
        try {
            const parmas = { page: page_no };
            const res = await axiosInstance.post(`/admin/getalladminnotification`, parmas)
            if (res?.data?.status == 200) {
                setTotal(res.data.totalRecords);
                setNotificationList(res?.data?.data)
                setloading(false)
            } else {
                setNotificationList([]);
                setloading(false)
            }
        } catch (error) {
            setNotificationList([]);
            setloading(false)
        }
    };
    const handleNavigate = async (row) => {
        if(row?.typeId){
            navigate('/admin/postedjob')
        }else{
            const detailsPageURL = `/profile-details/${row.user_id}`;
            window.open(detailsPageURL, '_blank');
        }
    }
    useEffect(() => {
        getData(currentPage);
    }, []);

    const nextPage = (page) => {
        setCurrentPage(page);
        getData(page);
    };

    const removeNotification = async (data) => {
        const updatedItems = notification?.filter((item) => item._id !== data._id);
        if (notification.length == 1) {
            getData()
        }
        setNotificationList(updatedItems);
        const params = { id: data?._id }
        await axiosInstance.post('/admin/seenadminnotification', params)
    }


    return (
        <>
            {loading ? (
                <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Box>
                        <CircularProgress size={60} />
                    </Box>
                </div>
            ) : (
                <ComponentSkeleton>
                    <div className="dahbard_table top_tab_bar">
                        <div>
                            <h2>Notification List</h2>
                        </div>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">S.No.</StyledTableCell>
                                            <StyledTableCell>Message</StyledTableCell>
                                            <StyledTableCell align="center">Date/Time</StyledTableCell>
                                            <StyledTableCell align="center">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {notification.map((row, key) => (
                                            <StyledTableRow key={row._id}>
                                                <StyledTableCell component="th" scope="row" align="center">
                                                    {(currentPage - 1) * itemsPerPage + key + 1}
                                                </StyledTableCell>

                                                <StyledTableCell>
                                                    {
                                                        row?.updated_key ?
                                                            <>
                                                                <strong className='text-uppercase'>{row.user_name}</strong> has updated their <strong>{row?.updated_key?.replace(/_/g, ' ')}</strong> - ({row.updated_value})
                                                            </>
                                                            :
                                                            <span>{row?.message}</span>
                                                    }
                                                </StyledTableCell>


                                                <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>

                                                <StyledTableCell align="left">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "center",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <Button
                                                            className="view_btn action-btn d-block"
                                                            onClick={() => handleNavigate(row)}
                                                        >
                                                            <Tooltip title="View Details">
                                                                <RemoveRedEyeIcon />
                                                            </Tooltip>
                                                        </Button>

                                                        <Button
                                                            className="view_btn text-danger action-btn d-block"
                                                            onClick={() => removeNotification(row)}
                                                        >
                                                            <Tooltip title="Remove Notification">
                                                                <CloseOutlined />
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
                        {
                            total > 10 &&
                            <Grid container justifyContent={"center"} className="pageInation_box">
                                <Grid item xl={6} lg={8} md={10} sm={12}>
                                    <Stack spacing={2}>
                                        <Pagination
                                            count={Math.ceil(total / itemsPerPage)}
                                            page={currentPage}
                                            onChange={(event, page) => nextPage(page)}
                                            variant="outlined"
                                            shape="rounded"
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        }
                        {notification?.length == 0 &&
                            <Grid container justifyContent={"center"} className="pageInation_box">
                                <Grid item xl={12} lg={12} md={12} sm={12}>
                                    <h6 className="text-center mt-4">Do&apos;nt have any deleted users</h6>
                                </Grid>
                            </Grid>}
                    </Grid>
                </ComponentSkeleton>
            )}
        </>
    );
};
export default NotificationList;