
/* eslint-disable */
import { Grid, Stack, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../assets/css/styleposter.css';
import { defaultUserIMG, getAllLocatData } from 'Utility/Utility';
import Loading from 'Utility/Loading';
import { Link, useLocation } from '../../node_modules/react-router-dom/dist/index';
import config from 'config';
import nochat from '../assets/images/nochat.png';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { axiosInstance } from 'Utility/Api';
import RefreshIcon from '@mui/icons-material/Refresh';
import useWebSocket from 'react-use-websocket';
import FreePlanModal from 'Utility/FreePlanModal';
const Chats = () => {
  const JobDetails = useLocation();
  const productDetailsData = JobDetails.state ? JobDetails.state.product : null;
  const UserInfo = JobDetails.state ? JobDetails.state.data : null;

  const [productDetails, setProductDetails] = useState(productDetailsData);
  const [UserInfoData, setUserInfoData] = useState(UserInfo);

  const socketUrl = 'wss://dronefreelancer.com.au';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [freePlanModal, setFreePlanModal] = useState(false);
  const [activeChat, setActiveChat] = useState({
    'user_id': null,
    'job_id': null,
  });
  const [roomData, setRoomData] = useState(null)
  const [info, setInfo] = useState({
    sender_id: getAllLocatData()?.login_id,
    sentby: getAllLocatData()?.user_type,
    job_id: '',
    reciever_id: user?.userData?._id,
    roomid: user?.roomdata?._id,
    first_name: user?.userData?.first_name,
    last_name: user?.userData?.last_name,
    image: user?.userData?.image,
    job_title: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 20,

    reconnectInterval: 2000,
    onOpen: () => {
      console.log("Socket is Connected !!")
      setIsConnected(true);
    },
    onClose: () => {
      console.log("Socket is Disconnected !!")
      setIsConnected(false);
    },
    onMessage: (event) => {
      const newMessage = JSON.parse(event.data);
      console.log('event_data', newMessage);
      const newMessageData = {
        reciever_id: newMessage?.reciever_id,
        sender_id: newMessage?.sender_id,
        message: newMessage?.content,
        time: newMessage?.time
      };
      if (info?.sender_id === newMessage?.reciever_id && info?.reciever_id === newMessage?.sender_id && info?.job_id === newMessage?.job_id) {

        const updateCount = { roomid: newMessage.roomId, job_id: newMessage.job_id, sender_id: roomData?.reciever_id, reciever_id: roomData?.sender_id };
        axiosInstance.post('/user/updateMessageCount', updateCount);
        setMessages((prevMessages) => [...prevMessages, newMessageData]);
      }

      filterList?.map((item, i) => {

        const listJobID = item?.jobdata ? item?.jobdata?._id : item?.productdata?._id;
        const listUserID = item?.userData?._id;

        if (activeChat.job_id === listJobID.job_id && activeChat.user_id == listUserID) {
          item.roomdata.messageCount
        } else if (listJobID == newMessage.job_id && listUserID == newMessage.sender_id && activeChat.job_id !== listJobID.job_id && activeChat.user_id !== listUserID) {
          item.roomdata.messageCount = item.roomdata.messageCount + 1;
        }

      })

    }
  });

  const sendHeartbeat = () => {
    if (readyState === WebSocket.OPEN) {
      sendJsonMessage({ type: 'heartbeat' });
    }
  };


  useEffect(() => {
    if (!isConnected) {
      reconnectWebSocket();
    }
  }, [isConnected]);

  const reconnectWebSocket = () => {
    const reconnectInterval = setInterval(() => {
      console.log('Attempting to reconnect...');
      setIsConnected(true);
      clearInterval(reconnectInterval);
    }, 5000);
  };



  const getUsers = async () => {
    setLoading(true);
    try {
      const result = await fetch(`${config.url}/user/getAllchatlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` }
      });
      const res = await result.json();
      if (res.status == 200) {
        console.log("userList", res?.getChatUserList)
        setUserList(res?.getChatUserList);
        setFilterList(res?.getChatUserList);
        setLoading(false);
        setbtnLoading(false);
      } else {
        setUserList([]);
        setFilterList([]);
        setLoading(false);
        setbtnLoading(false);
      }
    } catch (error) {
      console.log(error);
      setbtnLoading(false);
      setLoading(false);
    }
  };
  const getMessageListFun = async (roomid) => {
    setMsgLoading(true);
    try {
      const param = {
        roomid: roomid
      };
      const result = await fetch(`${config.url}/user/getmsg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAllLocatData()?.jwt}` },
        body: JSON.stringify(param)
      });
      const res = await result.json();
      if (res.status == 200) {
        setMessages(res.messages);
        setMsgLoading(false);
      } else {
        setMessages([]);
        setMsgLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    if (UserInfoData) {
      setInfo({
        ...info,
        job_id: JobDetails?.state?.JobDetailsData?._id,
        reciever_id: UserInfoData?.pilotdata?._id,
        roomid: '',
        first_name: UserInfoData?.pilotdata?.first_name,
        last_name: UserInfoData?.pilotdata?.last_name,
        image: UserInfoData?.pilotdata?.image,
        job_title: JobDetails?.state?.JobDetailsData?.job_details?.name
      });
      setActiveChat({ ...activeChat, 'user_id': UserInfoData?.pilotdata?._id, 'job_id': JobDetails?.state?.JobDetailsData?._id })
    } else if (productDetails) {
      setInfo({
        ...info,
        job_id: productDetails?.productdata?._id,
        reciever_id: productDetails?.pilotdata?._id,
        roomid: productDetails?.roomdata,
        first_name: productDetails?.pilotdata?.first_name,
        last_name: productDetails?.pilotdata?.last_name,
        image: productDetails?.pilotdata?.image,
        job_title: productDetails?.productdata?.title
      });
      setActiveChat({ ...activeChat, 'user_id': productDetails?.pilotdata?._id, 'job_id': productDetails?.productdata?._id })
    } else {
      setInfo({
        ...info,
        job_id: user?.jobdata ? user?.jobdata?._id : user?.productdata?._id,
        reciever_id: user?.userData?._id,
        roomid: user?.roomdata?._id,
        first_name: user?.userData?.first_name,
        last_name: user?.userData?.last_name,
        image: user?.userData?.image,
        job_title: user?.jobdata ? user?.jobdata?.job_details?.name : user?.productdata?.title
      });
    }
  }, [user, UserInfoData, productDetails]);

  useEffect(() => {
    getUsers();
    // const totalMsg = userList.reduce((total, user) => total + user.roomdata.messageCount, 0);
    // console.log("totalMsg", totalMsg)
  }, []);

  const [isSectionActive, setIsSectionActive] = useState(false);
  const handleButtonClick = (item) => {
    setUser(null);
    setProductDetails(null);
    setUserInfoData(null);
    setRoomData(item.roomdata)
    const jobid = item?.jobdata ? item?.jobdata?._id : item?.productdata?._id;
    getMessageListFun(item.roomdata._id);
    if (item.roomdata.messageCount > 0) {
      const updParams = {
        roomid: item.roomdata._id,
        job_id: jobid,
        sender_id: item.roomdata.reciever_id,
        reciever_id: item.roomdata.sender_id,
      }
      updateMessageCount(updParams);
      item.roomdata.messageCount = 0;
    }
    setUser(item);
    setIsSectionActive(!isSectionActive);
    setActiveChat({ ...activeChat, 'user_id': item?.userData?._id, 'job_id': jobid })
  };
  const handleClose = () => {
    setIsSectionActive(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const message = {
      roomId: info.roomid,
      sender_id: info.sender_id,
      job_id: info.job_id,
      sentby: info.sentby,
      reciever_id: info.reciever_id,
      content: newMessage,
      date: currentDate,
      time: `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    };
    console.log('message send', message);
    const newMsgData = {
      reciever_id: message.reciever_id,
      sender_id: message.sender_id,
      message: message.content,
      time: message.time
    };
    setMessages((prevMessages) => [...prevMessages, newMsgData]);
    sendJsonMessage(message);
    setNewMessage('');
  };

  const [searchVal, setSearchVal] = useState({
    usersearch: ''
  });

  const handleSearch = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearchVal({
      ...searchVal,
      [name]: value
    });
    if (name != '') {
      const filterPostedData = userList.filter((item) => {
        return (
          item.userData?.first_name.toLowerCase().includes(value.toLowerCase()) ||
          item.userData?.last_name.toLowerCase().includes(value.toLowerCase()) ||
          item?.jobdata?.job_details?.name.toLowerCase().includes(value.toLowerCase()) ||
          item?.jobdata?.title?.toLowerCase().includes(value.toLowerCase())
        );
      });
      setFilterList(filterPostedData);
    } else {
      setFilterList(userList);
    }
  };

  const ROOT_CSS = css({
    height: 'calc(100vh - 410px)',
    width: '100%'
  });

  const updateMessageCount = async (param) => {
    try {
      await axiosInstance.post('/user/updateMessageCount', param);
    } catch (error) {
      console.log(error);
    }
  };

  const closeChatWithUser = () => {
    setUser(null);
    setProductDetails(null);
    setUserInfoData(null);
    setActiveChat({
      'job_id': null,
      'user_id': null
    })
  };

  const reloadUser = () => {
    setbtnLoading(true);
    getUsers();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ mt: 3.25 }}>
        <Typography variant="h5" className="global_top_head">
          Chats
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Stack spacing={3}>
          <div className="top_box">
            <div className="chat_ui top_box">
              <Grid container className="outlistingouter">
                <Grid item xl="3" lg="4" md="12">
                  <div className="chat_listing">
                    <div className="serch_listing d-flex">
                      <input type="text" placeholder="Search" value={searchVal.usersearch} name="usersearch" onChange={(e) => handleSearch(e)} />
                      {btnLoading ? (
                        <button style={{ background: 'transparent', border: 'none', outline: 'none' }} type="button">
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span className="visually-hidden">Loading...</span>
                        </button>
                      ) : (
                        <button
                          style={{ background: 'transparent', border: 'none', outline: 'none' }}
                          onClick={() => reloadUser()}
                          type="button"
                        >
                          <RefreshIcon />
                        </button>
                      )}
                    </div>
                    <div className="listings">
                      {!loading ? (
                        filterList?.map((item, i) => (
                          <button
                            className="Chatoutprofile"
                            style={{
                              background:
                                info.reciever_id === item.userData._id && info.job_id === item.jobdata?._id ? '#def1ff' : 'inherit',
                              borderLeft:
                                info.reciever_id === item.userData._id && info.job_id === item.jobdata?._id ? '4px solid #2563eb' : 'none'
                            }}
                            key={i}
                            onClick={() => handleButtonClick(item)}
                          >
                            <div className="user_chat">
                              <div className="user_profile">
                                <Link className='ntext' to={`/profile-details/${item.userData?._id}`}>
                                  <img
                                    src={item.userData.image != '' ? item.userData.image : defaultUserIMG}
                                    alt="logo"
                                    style={{ width: '50px', height: '50px', borderRadius: '100%', objectFit: 'Contain' }}
                                    className="grey_img"
                                  />
                                </Link>
                                <div className="user_name_lastmsg text-start">
                                  <h2 className="poster_name">{item?.userData?.first_name + ' ' + item?.userData?.last_name}</h2>
                                  {item?.jobdata ? (
                                    <p>@{item?.jobdata?.job_details?.name}</p>
                                  ) : (
                                    <>
                                      {' '}
                                      <p>@{item?.productdata?.title}</p>{' '}
                                    </>
                                  )}
                                </div>
                              </div>
                              {item.roomdata.messageCount != 0 && <p style={{ display: 'block', height: '25px', width: '25px', color: '#fff', background: '#2977ff', padding: '2px', margin: '0px', borderRadius: '5px' }}> {item.roomdata.messageCount}</p>}
                            </div>
                          </button>
                        ))
                      ) : (
                        <Grid container spacing={2} className="p-4">
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} className="p-2  mb-2">
                            <Grid item xs={2}>
                              <Skeleton variant="circular" width={50} height={50} />
                            </Grid>
                            <Grid item xs={8}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </div>
                  </div>
                </Grid>

                <Grid item xl="9" lg="8" md="12" className={`your-section ${isSectionActive ? 'showchatlisting' : ''}`}>
                  {user || UserInfoData || productDetails ? (
                    <div className="chat_section">
                      <div className="chat_user_header">
                        <div className="user_chat">
                          <div className="user_profile">
                            <button className="Chatoutprofile" onClick={handleClose}>
                              <ArrowBackIosNewIcon />
                            </button>
                            <Link className='ntext' to={`/profile-details/${info?.reciever_id}`}>
                              <img
                                src={info.image != '' ? info.image : defaultUserIMG}
                                alt="logo"
                                style={{ width: '50px', height: '50px', borderRadius: '100%' }}
                                className="grey_img"
                              />
                            </Link>
                            <div className="user_name_lastmsg">
                              <h2 className="poster_name"><Link className='ntext' to={`/profile-details/${info?.reciever_id}`}>{info?.first_name + ' ' + info?.last_name}</Link></h2>
                              {info?.job_title ? <p className="text-capitalize">@{info?.job_title}</p> : <></>}
                            </div>
                          </div>
                          <button className='close_btn'
                            style={{ outline: 'none', border: 'none', background: 'none', color: 'red' }}
                            onClick={() => closeChatWithUser()}
                          >
                            <DisabledByDefaultIcon />
                          </button>
                        </div>
                      </div>

                      <div className="chat_user_with_user">
                        <div className="left_side_chat">
                          <div className="chat_message" style={{ display: 'block', background: 'none' }}>
                            <ScrollToBottom className={ROOT_CSS}>
                              {msgLoading ? (
                                <Loading />
                              ) : messages.length > 0 ? (
                                messages.map((item, i) => (
                                  <div
                                    className={`${item.sender_id === getAllLocatData()?.login_id ? 'right_side_chat_wrp' : 'left_side_chat_wrp'
                                      }`}
                                    key={i}
                                  >
                                    <p className="chat_bg  d-inline-block mb-4">
                                      {item.message} <span className="time_txt d-block text-red">{item.time}</span>
                                    </p>
                                  </div>
                                ))
                              ) : null}
                            </ScrollToBottom>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSendMessage}>
                        <div className="chat_user_type">
                          <input
                            type="text"
                            placeholder="Type Something"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          {newMessage != '' ? (
                            <button>
                              <SendIcon />
                            </button>
                          ) : (
                            <button disabled style={{ cursor: 'not-allowed' }}>
                              <SendIcon />
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div
                      className="chat_section"
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                    >
                      <div className="img-box no_select_chat mt-5 pt-3">
                        <img src={nochat} alt="" />
                      </div>
                      <h4 className="mt-3 no_select_chat_txt">Welcome to Drone Freelancer Chat</h4>
                      {/* <p className="no_select_chat_sub">There is No chat Selected</p> */}
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
          </div>
        </Stack>
      </Grid>
      <FreePlanModal msg={'You don`t have any plan to access this page !!'} freePlanModal={freePlanModal} setFreePlanModal={setFreePlanModal} />

    </Grid>
  );
};
export default Chats;
