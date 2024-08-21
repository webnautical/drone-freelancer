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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
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
import { handleDownloadExcel, toastifyError, toastifySuccess } from "Utility/Utility"
import Loading from 'Utility/Loading';
import { timeAgo } from 'Utility/Date';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import { axiosInstance } from 'Utility/Api';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import config from 'config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const List = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(null)
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [animalRescueList, setAnimalRescueList] = useState([]);
    const [loading, setloading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredResults = animalRescueList.filter(
            (record) => record.job_title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filteredResults);
    };
    const getData = async () => {
        setloading(true)
        try {
            const res = await axiosInstance.get('/admin/getallAnimalRescues')
            if (res.data.status == 200) {
                console.log(res)
                setAnimalRescueList(res.data.animalrescueRequests)
                setFilteredData(res.data.animalrescueRequests)
                setloading(false)
            } else {
                setAnimalRescueList([])
                setloading(false)
            }
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    };
    useEffect(() => {
        getData();
        getAnimalFromContent()
    }, []);
    const changeArrFilterData = (filteredData) => {
        const result = filteredData?.map((sponsor) =>
            ({ "name": sponsor.name, "email": sponsor.email, "location": sponsor.location, "phone": sponsor.phone, "animal": sponsor.animal_type, "city": sponsor.city, "Date": sponsor.created_at })
        )
        return result
    }
    const downloadExcel = () => {
        handleDownloadExcel(changeArrFilterData(filteredData), "animal-rescue", "animal-rescue")
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    const handleClickOpen = (row) => {
        navigate('/admin/utils/animal-rescue-details', { state: { data: row } })
    };

    const [animalFields, setAnimalFields] = useState({})
    const getAnimalFromContent = async () => {
        const res = await axiosInstance.post('user/get_animal_fields')
        if (res?.status === 200) {
            setAnimalFields(res?.data?.animalFields)
        } else {
            setAnimalFields({})
        }
    }
    const [value, setValue] = useState({
        'title1': '',
        'title2': '',
        'content1': '',
        'content2': '',
    })
    useEffect(() => {
        if (animalFields?.title1) {
            setValue({
                ...value,
                'title1': animalFields?.title1,
                'title2': animalFields?.title2,
                'content1': animalFields?.content1,
                'content2': animalFields?.content2,
            })
        }
    }, [animalFields])
    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setValue(prevValue => ({
          ...prevValue,
          content1: data,
        }));
      };
    const handleSubmitForm = async () => {
        const res = await axiosInstance.post('user/update_animal_fields', value)
        if (res?.status === 200) {
            toastifySuccess(res?.data?.message)
        } else {
            toastifyError("Something Wen't Wrong !!")
        }
    }

    function updatePage(e, row) {
        const page = { job_type: "animal", get_data_type: "animal" }
        const pararm = { ...row, ...page }
        navigate(`${config.basename}/utils/updateposte`, {
            state: { data: pararm },
        });
    }
    return (
        <ComponentSkeleton>
            <>
                <div className="dahbard_table top_tab_bar">
                    <div>
                        <h2>Animal Rescue</h2>
                    </div>
                    <div className="input-box">
                        <Button className="global_dashbtn text-end me-3" onClick={() => setPage(!page)}>
                            Update Form Title
                        </Button>
                        <Button className="global_dashbtn text-end me-3" onClick={() => downloadExcel()}>
                            Export to Excel
                        </Button>
                        <TextField
                            id="demo-helper-text-aligned-no-helper "
                            label="Search by Job Title "
                            value={searchQuery}
                            onChange={handleSearch}
                        />
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
                                                    <Table sx={{ minWidth: 700 }} aria-label="customized table" className="dahbard_table_inner">
                                                        <TableHead>
                                                            <TableRow>
                                                                <StyledTableCell align="">S.No.</StyledTableCell>
                                                                <StyledTableCell>Animal</StyledTableCell>
                                                                <StyledTableCell>name</StyledTableCell>
                                                                <StyledTableCell>Email</StyledTableCell>
                                                                <StyledTableCell>Phone</StyledTableCell>
                                                                <StyledTableCell>City</StyledTableCell>
                                                                <StyledTableCell>Location</StyledTableCell>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="">Action</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {currentItems?.map((row, key) => (
                                                                <StyledTableRow key={row._id}>
                                                                    <StyledTableCell component="th" scope="row" align="center">
                                                                        {(currentPage - 1) * itemsPerPage + key + 1}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {row.animal_type}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {row.name}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>
                                                                        {row.email}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell>{row.phone}</StyledTableCell>
                                                                    <StyledTableCell>{row.city}</StyledTableCell>
                                                                    <StyledTableCell>{row.location}</StyledTableCell>
                                                                    <StyledTableCell>{timeAgo(row.created_at)}</StyledTableCell>
                                                                    <StyledTableCell align="left">
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'row',
                                                                                justifyContent: 'start',
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
                                                                            <Button
                                                                                className="view_btn action-btn d-block"
                                                                                onClick={() => handleClickOpen(row)}
                                                                            >
                                                                                <Tooltip title="View User Details">
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
                                        </>
                                        :
                                        <Grid container style={{ justifyContent: 'center' }} className='mt-3'>
                                            <Grid item xs={8} className="box">
                                                <Grid className="pages_global_background p-4" container sx={{ my: 1 }}>
                                                    <Grid item sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Title 1</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                placeholder='Write Title ...'
                                                                name="title1"
                                                                value={value.title1}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Content 1</span>
                                                        <FormControl fullWidth>
                                                            {/* <textarea
                                                                name="content1"
                                                                value={value.content1}
                                                                onChange={handleChange}
                                                                className='form-control'
                                                                placeholder='Write Content ...'
                                                            ></textarea> */}

                                                        </FormControl>

                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={value.content1}
                                                            onChange={handleEditorChange}
                                                        />
                                                    </Grid>
                                                    {/* <Grid item sm={12} xs={12} className="p-2">
                                                        <span className="admin_label">Title 2</span>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="outlined"
                                                                placeholder='Write Title ...'
                                                                name="title2"
                                                                value={value.title2}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mb-3 p-2">
                                                        <span className="admin_label">Content 2</span>
                                                        <FormControl fullWidth>
                                                            <textarea
                                                                name="content2"
                                                                value={value.content2}
                                                                onChange={handleChange}
                                                                className='form-control'
                                                                placeholder='Write Content ...'
                                                            ></textarea>

                                                        </FormControl>
                                                    </Grid> */}

                                                    <Grid item xs={12} className='text-end mx-2'>
                                                        <Button className="global_dashbtn mx-2" onClick={() => setPage(false)}>
                                                            Cancel
                                                        </Button>
                                                        {loading ? (
                                                            <Button className="global_dashbtn">
                                                                <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                                                            </Button>
                                                        ) : (
                                                            <Button className="global_dashbtn" onClick={() => handleSubmitForm()}>
                                                                Update
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
export default List;