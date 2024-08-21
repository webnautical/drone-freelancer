import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import StarIcon from "@mui/icons-material/Star";
import Skeleton from "@mui/material/Skeleton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import breadtopimg from "../../assets/images/breadtop.png";
import Select from "@mui/material/Select";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { axiosInstance } from "Utility/Api";
import { defaultUserIMG } from "Utility/Utility";
// import Accordion from 'react-bootstrap/Accordion';
import Pagination from "@mui/material/Pagination";
import {
  useLocation,
  useNavigate,
  useParams,
} from "../../../node_modules/react-router-dom/dist/index";
import { State } from "country-state-city";
import ThereAreNoData from "Utility/ThereAreNoData";
// import Breacrumb from 'staticspage/Header/Breacrumb';
const PilotList = () => {
  const navigate = useNavigate();
  const stateStr = useParams().state;
  const useQuery = () => new URLSearchParams(useLocation().search);
  let page = useQuery().get("page");
  let category = useQuery().get("category");

  const textToUrl = (text) => {
    const formattedString = text.toLowerCase().replace(/\s+/g, "-");
    return formattedString;
  };

  const urlToText = (urlString) => {
    if (urlString) {
      const words = urlString.split("-");
      const text = words
        .map((word) => word.charAt(0).toUpperCase() + word?.slice(1))
        .join(" ");
      return text;
    }
  };
  const state = urlToText(stateStr);

  const [searchValue, setSearchValue] = React.useState({
    state: state || "",
    category: category || "",
  });

  const itemsPerPage = 12;
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [pilotList, setPilotList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);

  const getPilotListFun = async (page_no, state, category) => {
    setLoading(true);
    try {
      const parmas = {
        page_no: page_no,
        state: state,
        category_name: category,
      };
      const res = await axiosInstance.post("/user/getallPilots", parmas);
      if (res?.data?.status == 200) {
        setTotal(res.data.total);
        setPilotList(res?.data?.allPilotdata);
        setLoading(false);
      } else {
        setPilotList([]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setPilotList([]);
      setLoading(false);
    }
  };

  const getCategoryListFun = async () => {
    try {
      const res = await axiosInstance.post("/admin/getAllJobCategory");
      if (res?.data?.status == 200) {
        setCategorylist(res?.data?.getCategory);
      } else {
        setCategorylist([]);
      }
    } catch (error) {
      console.log(error);
      setCategorylist([]);
    }
  };

  const getStateFun = () => {
    const stateData = State?.getStatesOfCountry("AU").map((state) => ({
      value: state.name,
      displayValue: state.name,
    }));
    setStateList(stateData);
  };

  useEffect(() => {
    getPilotListFun(currentPage, searchValue.state, searchValue.category);
    getStateFun();
    getCategoryListFun();
  }, []);

  const nextPage = (page) => {
    setCurrentPage(page);
    getPilotListFun(page, searchValue.state, searchValue.category);
    navigate(`/pilot-directory/${textToUrl(searchValue.state)}`);
  };

  const handleFilter = (event) => {
    if (event.target.name == "state") {
      setSearchValue({ ...searchValue, state: event.target.value });
      getPilotListFun(page, event.target.value, searchValue.category);
      // navigate(`/pilot-directory?page=${currentPage}&state=${event.target.value}&category=${searchValue.category}`);
      navigate(`/pilot-directory/${textToUrl(event.target.value)}`);
    }
    if (event.target.name == "category") {
      setSearchValue({ ...searchValue, category: event.target.value });
      getPilotListFun(page, searchValue.state, event.target.value);
      navigate(`/pilot-directory/${textToUrl(searchValue.state)}`);
    }
  };

  const goToDetailsPage = (data) => {
    navigate(`/profile-details/${data._id}`, { state: { data } });
  };

  const location = useLocation().pathname;
  const pageName = location.replace(/\//g, "");
  const [pageData, setPageData] = useState({});
  const [breadcrumbLoading, setBreadcrumbLoading] = useState(false);

  const getPAgeData = async () => {
    setBreadcrumbLoading(true);
    try {
      const res = await axiosInstance.post("/admin/getallStaticPagedata");
      if (res?.data?.status === 200) {
        const parts = location?.split('/');
        const filterPageName =  parts?.length > 1 ? parts[1] : '';
        const page = res?.data?.getdata.filter(
          (item) => item.url === filterPageName
        )[0];
        setPageData(page);
        setBreadcrumbLoading(false);
      } else {
        setPageData(null);
        setBreadcrumbLoading(false);
      }
    } catch (error) {
      console.log(error);
      setBreadcrumbLoading(false);
    }
  };
  useEffect(() => {
    getPAgeData();
  }, []);

  const handleExtract = () => {
    const parts = location.split('/');
    if (parts.length > 2) {
      const newString = parts.slice(2).join('/');
      if(newString !== "location"){
        return newString
      }
    } else {
      return ""
    }
  };


  return (
    <div className="pilot_list_page">
      {/* <Breacrumb /> */}

      <section className="global_breadcrumb_design">
        <div className="global_breadcrumb_design_inner">
          <Container fluid className="">
            <Row className="align-items-center justify-content-between">
              <Col md={8} lg={5}>
                <div className="about_page">
                  {breadcrumbLoading ? (
                    <>
                      <h1 className="text-capitalize">
                        <Skeleton
                          className="mb-2"
                          variant="rectangular"
                          width={210}
                          height={50}
                          style={{ width: "40%" }}
                        />
                        <Skeleton
                          className="mb-2"
                          variant="rectangular"
                          height={24}
                          style={{ width: "100%" }}
                        />
                        <Skeleton
                          className="mb-2"
                          variant="rectangular"
                          height={24}
                          style={{ width: "100%" }}
                        />
                        <Skeleton
                          className="mb-2"
                          variant="rectangular"
                          height={24}
                          style={{ width: "100%" }}
                        />
                      </h1>
                    </>
                  ) : (
                    <h1 className="text-capitalize">

                       {/* <br /> */}
                       {
                        handleExtract() ? <>
                          Find a Drone Pilot in{" "} {handleExtract()}
                        </>
                        :
                        <>
                        
                        {location.replace(new RegExp("/", "g"), " ")?.replace(/-/g, ' ') || pageName?.replace(/-/g, ' ')}{" "}
                        </>

                       }
                    </h1>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: pageData?.content }}
                  />
                </div>
              </Col>
              <Col lg={5} className="p-0">
                <div className="top_image">
                  <img
                    className="w-100"
                    src={breadtopimg}
                    alt="breadcrumbimg"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section className="pilot_list">
        <Container>
          <Row className="justify-content-end">
            <Col md="2" className="mb-3">
              <FormControl style={{ width: "100%", padding: "0px" }}>
                <span className="costom_label">
                  Sort By State <FilterAltIcon />
                </span>
                <Select
                  value={searchValue.state}
                  name="state"
                  onChange={handleFilter}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em className="filterby">Select</em>
                  </MenuItem>
                  {stateList?.map((item, i) => (
                    <MenuItem value={item.value} key={i}>
                      {item.displayValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
            <Col md="2" className="mb-3">
              <FormControl style={{ width: "100%" }}>
                <span className="costom_label">
                  Sort By Service <FilterAltIcon />
                </span>
                <Select
                  value={searchValue.category}
                  name="category"
                  onChange={handleFilter}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em className="filterby">category</em>
                  </MenuItem>
                  {categorylist?.map((row) => (
                    <MenuItem key={row._id} value={row.category_name}>
                      {row.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Col>
          </Row>

          {loading ? (
            <Container>
              <Row>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
                <Col lg="3" xl="3" className="mt-3">
                  <div className="pilot_list_box_main">
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={150}
                      style={{ borderRadius: "100%", margin: "auto" }}
                      className=""
                    />

                    <Skeleton
                      variant="rectangular"
                      height={24}
                      style={{
                        borderRadius: "10px",
                        width: "80%",
                        margin: "auto",
                      }}
                      className="mt-4"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={15}
                      style={{ borderRadius: "10px" }}
                      className="mt-5"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={15}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-2"
                    />

                    <Skeleton
                      variant="rectangular"
                      height={35}
                      style={{
                        borderRadius: "10px",
                        margin: "auto",
                        width: "100%",
                      }}
                      className="mt-4"
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          ) : pilotList?.length > 0 ? (
            <>
              <Row>
                {pilotList.map((item, i) => (
                  <>
                    <Col md="3" key={i} className="mt-3">
                      <div className="pilot_list_box_main ">
                        <div className="pilot_profile_box_inner m-auto text-center">
                          <img
                            src={item.image || defaultUserIMG}
                            alt=""
                            style={{ maxWidth: "", maxHeight: "" }}
                          />
                        </div>

                        <div className="pro_pilot">
                          <div className="pilot_list_name text-center text-capitalize">
                            {item.first_name + " " + item.last_name}
                          </div>
                          <div className="rating_count">
                            <StarIcon />
                            <span style={{ fontSize: "13px" }}>
                              ({item.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="location_pro_pilot_list text-center">
                          {item.location}
                        </div>
                        <div className="specialities">
                          <h2>Specialised in</h2>
                          {item?.specilization.length > 0 ? (
                            item?.specilization?.map((item, i) => (
                              <p
                                key={i}
                                className="m-0 p-0"
                                style={{ fontSize: "13px", fontWeight: "500" }}
                              >
                                {item}
                              </p>
                            ))
                          ) : (
                            <>
                              <p
                                className="when_not_have"
                                style={{ fontSize: "12px", fontWeight: "400" }}
                              >
                                Do not have any specilization
                              </p>{" "}
                            </>
                          )}
                        </div>
                        <div className="text-center mt-3">
                          <button
                            className="chat_btn "
                            onClick={() => goToDetailsPage(item)}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </Col>
                  </>
                ))}
              </Row>
              <Row>
                <Col md="12" className="mt-3">
                  <div className="pagination">
                    <Pagination
                      count={Math.ceil(total / itemsPerPage)}
                      page={currentPage}
                      onChange={(event, page) => nextPage(page)}
                      variant="outlined"
                      shape="rounded"
                    />
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <ThereAreNoData title={"there are no pilot to display !!"} />
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default PilotList;
