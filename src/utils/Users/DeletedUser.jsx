import { Grid, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from "@mui/material/TextField";
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
import config from "config";
import Tooltip from "@mui/material/Tooltip";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { handleDownloadExcel } from "Utility/Utility"
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
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
import { toastifyError, toastifySuccess } from "Utility/Utility";
import { axiosInstance } from "Utility/Api";
import ComponentSkeleton from "pages/components-overview/ComponentSkeleton";
import { timeAgo } from "Utility/Date";
const DeletedUser = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [userList, setUserList] = useState([]);
    const [loading, setloading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    // const [filterElement, setFilterElement] = useState("selectNothing");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredResults = userList.filter((record) =>
            record.first_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filteredResults);
    };
    const getData = async () => {
        setloading(true)
        try {
            const res = await axiosInstance.post(`/admin/deletedUsers`)
            if (res.data.status == 200) {
                setFilteredData(res.data.deletedUser);
                setUserList(res.data.deletedUser);
                setloading(false)
            } else {
                setFilteredData([]);
                setUserList([]);
                setloading(false)
            }
        } catch (error) {
            setFilteredData([]);
            setUserList([]);
            setloading(false)
        }
    };
    const handleActive = async (row) => {
        try {
            const res = await axiosInstance.post(`/admin/approvedPilot/${row._id}`)
            if (res?.data?.status == 200) {
                toastifySuccess("User activeted successfully !!")
                getData()
            } else {
                toastifyError("Something went wrong !!")
            }
        } catch (error) {
            toastifyError("Something went wrong !!")
        }
    }

    useEffect(() => {
        getData();
    }, []);

    function handleNavigate(row) {
        navigate(`${config.basename}/user-details`, {
            state: row,
        });
    }
    function sendmesaage(row) {
        navigate(`${config.basename}/sendmessage`, {
            state: row
        });
    }
    function handlePreview(row) {
        navigate(`/profile-details/${row._id}`,);
    }
    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
        ({
            "First Name": sponsor.first_name,
            "Last Name": sponsor.last_name,
            "Email": sponsor.email,
            "Phone Number": sponsor.phone,
            "Location": sponsor.location,
            "Country": sponsor.country,
            "Role": sponsor.role,
            "Specilization": Array.isArray(sponsor.specilization) ? sponsor.specilization.join(', ') : sponsor.specilization,
            "company": sponsor.first_name,
            "Short description": sponsor.short_description,
            "website link": sponsor.website_link,
            "Instagram link": sponsor.instagram_link,
            "Facebook link": sponsor.facebook_link,
            "Twiter link": sponsor.twitter_link,
            "tiktok_link": sponsor.tiktok_link,
            "Reviews": sponsor.reviews,
            "averageRating": sponsor.averageRating,
            "radius": sponsor.radius,
            "status": sponsor.status,
            "Extra Area Category": Array.isArray(sponsor.extra_area_category) ? sponsor.extra_area_category.join(', ') : sponsor.extra_area_category,
            "specification": sponsor.equipment.specification, //
            "Drone": Array.isArray(sponsor.equipment.drone) ? sponsor.equipment.drone.join(', ') : sponsor.equipment.drone,
            "Camera specification": Array.isArray(sponsor.equipment.camera_specification) ? sponsor.equipment.camera_specification.join(', ') : sponsor.equipment.camera_specification,
            "payload": sponsor.equipment.payload,
            "Subcription Plan Name": sponsor.subcription_id,
            "Create Date": sponsor.created_at,
        })
        )
        return result
    }
    const downloadExcel = () => {
        handleDownloadExcel(changeArrFilterData(filteredData), "ApprovedPilotList", "ApprovedPilot")
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
                            <h2>Hold Pilot List</h2>
                        </div>
                        <div className="input-box">
                            <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
                                Export to Excel
                            </Button>
                            <TextField
                                id="demo-helper-text-aligned-no-helper "
                                label="Search by Name"
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
                                            <StyledTableCell align="left">Name</StyledTableCell>
                                            <StyledTableCell align="left">Email</StyledTableCell>
                                            <StyledTableCell align="left">Phone</StyledTableCell>
                                            <StyledTableCell align="left">Status</StyledTableCell>
                                            <StyledTableCell align="left">Plan type</StyledTableCell>
                  <StyledTableCell align="left">Created Date</StyledTableCell>

                                            <StyledTableCell align="left">Send message</StyledTableCell>
                                            <StyledTableCell align="left">Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {currentItems.map((row, key) => (
                                            <StyledTableRow key={row._id}>
                                                <StyledTableCell component="th" scope="row" align="center">
                                                {(currentPage - 1) * itemsPerPage + key + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.first_name} {row.last_name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.email}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.phone}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {row.status}
                                                </StyledTableCell>
                                                <StyledTableCell align="center" className='text-uppercase'>{row.subscription_type}</StyledTableCell>
                                                <StyledTableCell align="center">{timeAgo(row.created_at)}</StyledTableCell>

                                                <StyledTableCell align="center">
                                                    <Button className="view_btn action-btn d-block" onClick={() => sendmesaage(row)}>
                                                        <Tooltip title="Send message">
                                                            <ForwardToInboxIcon />
                                                        </Tooltip>
                                                    </Button>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "left",
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
                                                        {row.role === "Pilot" && (
                                                            <Button
                                                                className={` action-btn d-block`}
                                                                onClick={() => handleActive(row)}
                                                            >
                                                                <Tooltip title={"Activeted"}>
                                                                    <VerifiedUserIcon />
                                                                </Tooltip>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            className="view_btn action-btn d-block"
                                                            onClick={() => handlePreview(row)}
                                                        >
                                                            <Tooltip title="Preview">
                                                                <PersonSearchIcon />
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
                            userList?.length > 10 &&
                            <Grid container justifyContent={"center"} className="pageInation_box">
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
                        }
                        {userList?.length == 0 &&
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
export default DeletedUser;