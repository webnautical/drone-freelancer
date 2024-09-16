import { Grid, FormControl } from '@mui/material';
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
import DeleteIcon from '@mui/icons-material/Delete';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Tooltip from '@mui/material/Tooltip';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

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
import { apiBaseURL, toastifyError, toastifySuccess } from "Utility/Utility"
import Loading from 'Utility/Loading';
import { timeAgo } from 'Utility/Date';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import { axiosInstance } from 'Utility/Api';

const Advertisement = () => {
    const [page, setPage] = useState(null)
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setloading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const getData = async () => {
        setloading(true)
        try {
            const res = await axiosInstance.get('/admin/getAdvertise')
            if (res.data.status == 200) {
                console.log("getAdvertise", res)
                setFilteredData(res.data.advertisements)
                setloading(false)
            } else {
                setFilteredData([])
                setloading(false)
            }
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    };
    useEffect(() => {
        getData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    const [updData, setUpdData] = useState({})

    const [value, setValue] = useState({
        'title': '',
        'redirect_url': '',
        'image': '',
    })
    useEffect(() => {
        if (updData?._id) {
            setValue({
                ...value,
                'id': updData?._id,
                'title': updData?.title,
                'redirect_url': updData?.redirect_url,
                'image': apiBaseURL() + "/files/" + updData?.image,
            })
        }else{
            setValue({
                ...value,
                'id': '',
                'title': '',
                'redirect_url': '',
                'image': '',
            })
        }
    }, [updData])
    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                setValue(prevState => ({
                    ...prevState,
                    'image': base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitForm = async () => {
        const apiEndPoints = updData ? "updateAdvertiseById" : "addAdvertise"
        const res = await axiosInstance.post(`/admin/${apiEndPoints}`, value)
        if (res?.status === 200) {
            toastifySuccess(res?.data?.message)
            setPage(false)
            getData()
        } else {
            toastifyError("Something Wen't Wrong !!")
        }
    }

    function updatePage(e, row) {
        setUpdData(row)
        setPage(true)
    }

    const handleClickOpen = async (row) => {
        const res = await axiosInstance.post(`/admin/deleteAdvertiseById`, {id: row._id})
        if (res?.status === 200) {
            toastifySuccess(res?.data?.message)
            getData()
        } else {
            toastifyError("Something Wen't Wrong !!")
        }
    };

    const handleCancel = () =>{
        setPage(false)
        setValue({ ...value, 'image' : '', 'redirect_url': '', "title": '', 'id' : ''})
        setUpdData(null)
    }

    return (
        <ComponentSkeleton>
            <>
                <div className="dahbard_table top_tab_bar">
                    <div>
                        <h2>Advertisement</h2>
                    </div>
                    <div className="input-box">
                        <Button className="global_dashbtn text-end me-3" onClick={() => setPage(!page)}> Add Advertisement</Button>
                    </div>
                </div>

                <Grid container spacing={3}>
                    {
                        loading ? <Loading /> :
                            <>
                                {
                                    !page ?
                                        <>
                                            <Grid item xs={12} lg={12}>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <StyledTableCell align="center">S.No.</StyledTableCell>
                                                                <StyledTableCell>Image</StyledTableCell>
                                                                <StyledTableCell>Title</StyledTableCell>
                                                                <StyledTableCell>URL</StyledTableCell>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="center">Action</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {currentItems?.map((row, key) => (
                                                                <StyledTableRow key={row._id}>
                                                                    <StyledTableCell component="th" scope="row" align="center">
                                                                        {(currentPage - 1) * itemsPerPage + key + 1}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        <img src={apiBaseURL() + "/files/" + row.image} alt="" style={{ height: '60px', width: '60px' }} />
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {row.title}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {row.redirect_url}
                                                                    </StyledTableCell>

                                                                    <StyledTableCell>{timeAgo(row.created_at)}</StyledTableCell>
                                                                    <StyledTableCell align="left">
                                                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                                                                            <Button className="edit_btn_global action-btn d-block" onClick={(e) => updatePage(e, row)}>
                                                                                <Tooltip title="Edit">
                                                                                    <ModeEditOutlineIcon />
                                                                                </Tooltip>
                                                                            </Button>
                                                                            <Button className="view_btn action-btn d-block" onClick={() => handleClickOpen(row)}>
                                                                                <Tooltip title="View User Details">
                                                                                    <DeleteIcon />
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
                                        </>
                                        :
                                        <Grid container style={{ justifyContent: 'center' }} className='mt-3'>
                                            <Grid item xs={8} className="box">
                                                <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
                                                    <Grid item sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Title</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                name="title"
                                                                value={value.title}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Redirect URL</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                name="redirect_url"
                                                                value={value.redirect_url}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-4 p-2">
                                                        <FormControl fullWidth>
                                                            <div className="file-uploader">
                                                                <label htmlFor="file20" className="global_file_upload_deisgn">
                                                                    <InsertPhotoIcon />
                                                                    Breadcrumb Image (Recommended size 306px x 368px)
                                                                    <input type="file" id="file20" accept="image/*" onChange={handleImageUpload} />
                                                                </label>
                                                            </div>
                                                            {value.image && (
                                                                <div className="preview_upload">
                                                                    <h4>Image Preview</h4>
                                                                    <img src={value.image} alt="Selected" style={{ maxWidth: '200px' }} />
                                                                </div>
                                                            )}
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} className='text-end mx-2'>
                                                        <Button className="global_dashbtn mx-2" onClick={() => handleCancel()}>
                                                            Cancel
                                                        </Button>
                                                        {loading ? (
                                                            <Button className="global_dashbtn">
                                                                <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                                            </Button>
                                                        ) : (
                                                            <Button className="global_dashbtn" onClick={() => handleSubmitForm()}>
                                                                {updData ? "Update" : "Save"}
                                                            </Button>
                                                        )}
                                                    </Grid>
                                                </Grid>

                                            </Grid>
                                        </Grid>

                                }
                            </>
                    }
                </Grid>


            </>
        </ComponentSkeleton>
    );
};
export default Advertisement;