import { styled } from '@mui/material/styles';
import '../../App.css';
import React, { useMemo, useState, useEffect } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useTable } from "react-table";
import TextField from '@mui/material/TextField';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import config from 'config';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { ToastContainer } from 'react-toastify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1890ff',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0
//   }
// }));
import { toastifyError, toastifySuccess } from 'Utility/Utility';
import { StaticTableRow } from 'utils/DragTable/StaticTableRow';
import { DraggableTableRow } from 'utils/DragTable/DraggableTableRow';
import { axiosInstance } from 'Utility/Api';
export default function QueationAnswerlist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [Id, setId] = useState('');

  const [base64Stringofbaner, setSubcategoryBasebaner] = useState('');
  const [base64Stringofsub, setSubcategoryBase64Image] = useState('');
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // const filteredResults = records.filter((record) => record.imino.toLowerCase().includes(query.toLowerCase()));
    // setFilteredData(filteredResults);
  };
  const [data, setData] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      fetch(`${config.url}/admin/getAllQuation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        }
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.message === 'Get all Queation successfully') {
            // setFilteredData(res?.getallquation[0]?.qa);
            setData(res?.getallquation[0]?.qa);
            setId(res?.getallquation[0]?._id);
            setSubcategoryBasebaner(res?.getallquation[0]?.baner);
            setSubcategoryBase64Image(res?.getallquation[0]?.image);
            setLoading(false);
          }
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [deleteID, setDeleteID] = useState(null)
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if(deleteID){
      singleDelete(deleteID, Id)
    }
  },[deleteID])

  const singleDelete = (item, mainID) => {
    try {
      fetch(`${config.url}/admin/deletQuation/${mainID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.jwt}`
        },
        body: JSON.stringify({ quation_id: item })
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === 'Deleted Queation successfully') {
            toastifySuccess('Deleted Successfully !')
            getData()
          }
        });
    } catch (error) {
      console.log(error)
    }
  };

  const addNewQueation = () => {
    navigate(`${config.basename}/utils/addqa`);
  };
  const handleform = () => {
    setLoading(true);
    const updatedUser = {
      Id: Id,
      image: base64Stringofsub,
      baner: base64Stringofbaner
    };
    fetch(`${config.url}/admin/updateQaBaner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.jwt}`
      },
      body: JSON.stringify(updatedUser)
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === 'baner update successfully') {
          toastifySuccess('baner update successfully!');
          setLoading(false);
        } else {
          toastifyError('baner not update successfully!');
          setLoading(false);
        }
        setLoading(false);
      });
  };

  const handlesubcategoryUpload2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Stringofsub = event.target.result;
        setSubcategoryBasebaner(base64Stringofsub);
      };
      reader.readAsDataURL(file);
      // setSelectedbanerImage(file);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Question",
        accessor: "quetion"
      },
      {
        Header: "Answer",
        accessor: "answer",
      },
      {
        Header: <><p className='text-center'>Action</p></>,
        accessor: "Status",
        Cell: ({ row }) => (
          <>
            <StyledTableCell align="center">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '11px'
                }}
              >
                <Button className="edit_btn_global action-btn d-block"
                  onClick={() => { navigate(`/admin/utils/addqa`, { state: { data: row.original } }); }}
                >
                  <Tooltip title="Edit">
                    <ModeEditOutlineIcon />
                  </Tooltip>
                </Button>
                <Button
                  className="dlt_btn action-btn d-block"
                  onClick={() => {
                    setDeleteID(row.original._id);
                  }}
                >
                  <Tooltip title="Delete">
                    <DeleteOutlineIcon />
                  </Tooltip>
                </Button>
              </div>
            </StyledTableCell>
          </>
        ),
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState();
  const items = useMemo(() => data?.map(({ _id }) => _id), [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setCount(count + 1)
    if (active.id !== over.id) {
      setData((data) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const selectedRow = useMemo(() => {
    if (!activeId) {
      return null;
    }
    const row = rows.find(({ original }) => original._id === activeId);
    prepareRow(row);
    return row;
  }, [activeId, rows, prepareRow]);

  const [count, setCount] = useState(0)
  const changeArrFilterData = () => {
    const result = rows?.map((sponsor) =>
      ({ "quetion": sponsor.original.quetion, "answer": sponsor.original.answer, "suggestions": sponsor.original.suggestions, "_id": sponsor.original._id })
    )
    return result
  }
  const newData = changeArrFilterData()

  useEffect(() => {
    if (newData && count > 0) {
      changeArrayIndex(newData)
    }
  }, [newData, count])

  const changeArrayIndex = async (data) => {
    try {
      const params = { qaList: data }
      const res = await axiosInstance.post('/admin/updatefaqOrder', params)
      if (res.data.status != 200) {
        toastifyError("Something Wen't Wrong !!")
      }
    } catch (error) {
      toastifyError("Something Wen't Wrong !!")
      console.log(error)
    }
  }

  return (
    <div>
      {loading ? (
        <div className="loader">
          <Box sx={{ display: 'flex' }}>
            <CircularProgress size={60} />
          </Box>
        </div>
      ) : (
        <>
          <div className="top_tab_bar">
            <div>
              <h2>Question & Answers</h2>
            </div>
            <div className="select-box">
              <div className="input-box">
                <TextField
                  id="demo-helper-text-aligned-no-helper "
                  label="Search by Question"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button className="edit_btn action-btn d-block" onClick={() => addNewQueation()}>
                  {/* <ModeEditOutlineIcon /> */}
                  <div className="global_dashbtn">Add New Question</div>
                </Button>
              </div>
            </div>
          </div>
          <Grid container className="pages_global_background mt-4  mb-4 p-4">
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} className="mt-4 p-2">
              <div className="file-uploader">
                <label htmlFor="file2" className="global_file_upload_deisgn">
                  <InsertPhotoIcon />
                  Banner Upload Here (Recommended size 1920px x 435px)
                  <input type="file" id="file2" accept="image/*" onChange={handlesubcategoryUpload2} style={{ display: 'none' }} />
                </label>
                {base64Stringofbaner && (
                  <div className="preview_upload">
                    <h4>Image Preview</h4>
                    <img src={base64Stringofbaner} alt="Selected" />
                  </div>
                )}
              </div>
            </Grid>
            <div style={{ textAlign: 'right' }}>
              {loading ? (
                <Button className="global_dashbtn">
                  <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                </Button>
              ) : (
                <Button className="global_dashbtn" onClick={() => handleform()}>
                  Update
                </Button>
              )}
            </div>
          </Grid>
          <TableContainer component={Paper}>
            {/* <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">S.No.</StyledTableCell>
                  <StyledTableCell align="center">Question</StyledTableCell>
                  <StyledTableCell align="center">Answer</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, key) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {key + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.quetion}</StyledTableCell>
                    <StyledTableCell align="center">{row.answer}</StyledTableCell>

                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '11px'
                        }}
                      >
                        <Button className="edit_btn_global action-btn d-block"
                          onClick={() => { navigate(`/admin/utils/addqa`, { state: { data: row } }); }}
                        >
                          <Tooltip title="Edit">
                            <ModeEditOutlineIcon />
                          </Tooltip>
                        </Button>
                        <Button
                          className="dlt_btn action-btn d-block"
                          onClick={(e) => {
                            singleDelete(e, row._id);
                          }}
                        >
                          <Tooltip title="Delete">
                            <DeleteOutlineIcon />
                          </Tooltip>
                        </Button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table> */}

            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
            >
              <table {...getTableProps()} style={{ width: "100%" }} className='table px-4'>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <>
                      <tr {...headerGroup.getHeaderGroupProps()}>
                      <th></th> 
                        {headerGroup.headers.map((column) => (
                          <>
                                                    
                          <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                          </>
                        ))}
                      </tr>
                    </>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return <DraggableTableRow key={row.original._id} row={row} />;
                    })}
                  </SortableContext>
                </tbody>
              </table>
              <DragOverlay>
                {activeId && (
                  <table style={{ width: "100%" }} className='table px-4'>
                    <tbody>
                      <StaticTableRow row={selectedRow} />
                    </tbody>
                  </table>
                )}
              </DragOverlay>
            </DndContext>


          </TableContainer>

          <ToastContainer position="top-center" />


          {/* <TableData /> */}



        </>
      )}
    </div>
  );
}
