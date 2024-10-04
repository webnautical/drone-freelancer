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
import { toastifyError, toastifySuccess } from "Utility/Utility"
import Loading from 'Utility/Loading';
import { timeAgo } from 'Utility/Date';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import { axiosInstance } from 'Utility/Api';

const MetaListing = () => {
    const [page, setPage] = useState(null)
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [list, setList] = useState([]);
    const [loading, setloading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);

    const getData = async () => {
        setloading(true)
        try {
            const res = await axiosInstance.get('/admin/getallMetaItems')
            if (res.data.status == 200) {
                setList(res.data.metaitems)
                setloading(false)
            } else {
                setList([])
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
    const currentItems = list?.slice(indexOfFirstItem, indexOfLastItem);

    const [updData, setUpdData] = useState({})

    const [value, setValue] = useState({
        'slug': '',
        'meta_title': '',
        'meta_description': '',
    })
    useEffect(() => {
        if (updData?.slug) {
            setValue({
                ...value,
                'slug': updData?.slug,
                'meta_title': updData?.meta_title,
                'meta_description': updData?.meta_description,
            })
        } else {
            setValue({
                ...value,
                'slug': '',
                'meta_title': '',
                'meta_description': '',
            })
        }
    }, [updData])
    const handleChange = (e) => {
        if (e.target.name === 'meta_title') {
            setValue({ ...value, 'meta_title': e.target.value })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleUpdateSubmitForm = async () => {
        setSubLoading(true)
        const res = await axiosInstance.post('admin/createMetadetail', value)
        if (res?.status === 200) {
            toastifySuccess(res?.data?.message)
            setSubLoading(false)
            getData()
            setPage(false)
            setUpdData(null)
        } else {
            toastifyError("Something Wen't Wrong !!")
            setSubLoading(false)
        }
    }

    function updatePage(e, row) {
        setUpdData(row)
        setPage(true)
    }

    return (
        <ComponentSkeleton>
            <>
                <div className="dahbard_table top_tab_bar">
                    <div>
                        <h2>Meta Tags</h2>
                    </div>
                </div>

                <Grid container spacing={3}>
                    {
                        loading ? <Loading /> :
                            <>
                                {
                                    !page ?
                                        <>
                                            {
                                                list.length > 0 ?
                                                    <>
                                                        <Grid item xs={12} lg={12}>
                                                            <TableContainer component={Paper}>
                                                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <StyledTableCell align="center">S.No.</StyledTableCell>
                                                                            <StyledTableCell>Meta Title</StyledTableCell>
                                                                            <StyledTableCell>Meta Description</StyledTableCell>
                                                                            <StyledTableCell>Slug</StyledTableCell>
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
                                                                                    {row.meta_title}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {row.meta_description}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {row.slug}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>{timeAgo(row.createdAt)}</StyledTableCell>
                                                                                <StyledTableCell align="left">
                                                                                    <div
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            flexDirection: 'row',
                                                                                            justifyContent: 'center',
                                                                                            gap: '10px'
                                                                                        }}
                                                                                    >
                                                                                        <Button
                                                                                            className="edit_btn_global action-btn d-block"
                                                                                            onClick={(e) => updatePage(e, row)}
                                                                                        >
                                                                                            <Tooltip title="Edit">
                                                                                                <ModeEditOutlineIcon />
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
                                                                        count={Math.ceil(list.length / itemsPerPage)}
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
                                                    <>
                                                        <Grid item xs={12} lg={12}>
                                                            <TableContainer component={Paper}>
                                                                <h6 className='text-center py-3'>There are no data to display.</h6>
                                                            </TableContainer>
                                                        </Grid>
                                                    </>
                                            }
                                        </>
                                        :
                                        <Grid container style={{ justifyContent: 'center' }} className='mt-3'>
                                            <Grid item xs={8} className="box">
                                                <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>

                                                    <Grid item sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Meta Title</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                placeholder='Write Title ...'
                                                                name="meta_title"
                                                                value={value.meta_title}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Slug</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                placeholder='Write Slug ...'
                                                                name="slug"
                                                                value={value.slug}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Meta Description</span>
                                                        <FormControl fullWidth>
                                                            <textarea
                                                                name="meta_description"
                                                                value={value.meta_description}
                                                                onChange={handleChange}
                                                                className='form-control'
                                                                placeholder='Write Description ...'
                                                            ></textarea>

                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} className='text-end mx-2'>
                                                        <Button className="global_dashbtn mx-2" onClick={() => { setPage(false); setUpdData(null) }}>
                                                            Cancel
                                                        </Button>
                                                        {subLoading ? (
                                                            <Button className="global_dashbtn">
                                                                <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                                            </Button>
                                                        ) : (
                                                            <Button className="global_dashbtn" onClick={() => handleUpdateSubmitForm()}>
                                                                {updData ? "Update" : "Create"}
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
export default MetaListing;