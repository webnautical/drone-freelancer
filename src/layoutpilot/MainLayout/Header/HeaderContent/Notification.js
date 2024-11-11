import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';

import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate } from '../../../../../node_modules/react-router-dom/dist/index';
import { axiosInstance } from 'Utility/Api';
import { timeAgo } from 'Utility/Date';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { getAllLocatData } from 'Utility/Utility';
// import CloseIcon from '@mui/icons-material/Close';
// MessageOutlined, SettingOutlined
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const navigate = useNavigate()
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    getNotification()
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  useEffect(() => {
    getNotification()
  }, [])

  const [notificationList, setNotificationList] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)
  // const [newNoti, setNewNot] = useState(false)
  const getNotification = async () => {
    try {
      const res = await axiosInstance.post('/user/getwebNotification')
      if (res?.data?.status == 200) {
        setNotificationList(res?.data?.webnotification)
        const unseenNotification = res?.data?.webnotification?.filter(item => item.status === "");
        setNotificationCount(unseenNotification?.length);
      } else {
        setNotificationList([])
      }
    } catch (error) {
      console.log(error)
      setNotificationList([])
    }
  }

  const viewNotification = async (data) => {
    try {
      if (data?.type == "chat") {
        const params = { jobdata: { _id: data?.type_id } }
        navigate('/user/chats', { state: { data: params } });
      }
      if (data?.type == "order") {
        const params = { jobdata: { _id: data?.type_id } }
        navigate('/user/transaction', { state: { data: params } });
      }
      if (data?.type == "user") {
        const params = { jobdata: { _id: data?.type_id } }
        navigate('/user/dashboard/default', { state: { data: params } });
      }

      if (getAllLocatData()?.user_type == "Pilot") {
        if (data?.type == "job") {
          const params = { jobdata: { _id: data?.type_id } }
          navigate('/user/job-details', { state: { data: params } });
        }
        if (data?.type == "product") {
          const params = { jobdata: { _id: data?.type_id } }
          navigate('/user/market-place-list', { state: { data: params } });
        }
        if (data?.type == "qualification") {
          const params = { jobdata: { _id: data?.type_id } }
          navigate('/user/dashboard/default', { state: { data: params } });
        }
        if (data?.type == "review") {
          const params = { jobdata: { _id: data?.type_id } }
          navigate('/user/dashboard/default', { state: { data: params } });
        }
      } else {
        if (data?.type == "job") {
          const params = { _id: data?.type_id }
          navigate('/user/jobs-details', { state: { data: params } });
        }
        if (data?.type == "review") {
          const params = { _id: data?.type_id }
          navigate('/user/reviews', { state: { data: params } });
        }
      }
      setOpen(false)
      // const params = { id: data?._id }
      // const res = await axiosInstance.post('/user/readwebNotification', params)
      // if (res?.data?.status == 200) {
      //   getNotification()
      // }
    } catch (error) {
      console.log(error)
    }
  }

  const removeNotification = async (data) => {
    const updatedItems = notificationList.filter((item) => item._id !== data._id);
    setNotificationList(updatedItems);
    // const unseenNotification = notificationList?.filter(item => item.status === "");
    setNotificationCount(updatedItems?.length);
    const params = { id: data?._id }
    await axiosInstance.post('/user/readwebNotification', params)
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Link to={'/marketplace'} className='chat_btn me-5' style={{ textDecoration: "none" }}>Marketplace</Link>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notificationCount} color="primary" className='colorChange'>
          <BellOutlined />
        </Badge>
      </IconButton>


      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <div>

              <Paper className='notification-box'
                sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: 370, maxHeight: 330, height: 'auto', [theme.breakpoints.down('md')]: { maxWidth: 285 } }}
              >
                <ClickAwayListener onClickAway={handleClose}>

                  <MainCard
                    title="Notification"
                    elevation={0}
                    border={false}
                    content={false}
                    secondary={
                      <IconButton size="small" onClick={handleToggle}>
                        <CloseOutlined />
                      </IconButton>
                    }
                  >
                    <List component="nav" sx={{ p: 0, '& .MuiListItemButton-root': { py: 0.5, '& .MuiAvatar-root': avatarSX, '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' } } }}
                    >
                      {
                        notificationList.length > 0 ?
                          notificationList?.map((item, i) => (
                            <>
                              <ListItemButton key={i} >
                                <ListItemAvatar>
                                  <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                                    <NotificationsActiveIcon />
                                  </Avatar>
                                </ListItemAvatar>

                                <ListItemText onClick={() => viewNotification(item)} primary={
                                  // <Typography variant="h6">
                                  //   It&apos;s{' '}<Typography component="span" variant="subtitle1">Cristina danny&apos;s</Typography>{' '}birthday today.
                                  // </Typography>
                                  <Typography variant="h6">{item.message}</Typography>
                                }
                                  secondary={timeAgo(item.created_at)}
                                />
                                <ListItemSecondaryAction>
                                  {
                                    item.status == "" &&
                                    <Typography variant="caption" noWrap className="text-danger">New</Typography>
                                  }
                                    <IconButton size="small" className='ms-2' onClick={() => removeNotification(item)}>
                                      <CloseOutlined />
                                    </IconButton>
                                </ListItemSecondaryAction>
                              </ListItemButton>
                              <Divider />
                            </>
                          ))
                          :
                          <div>
                            <ListItemText className='text-center text-danger mt-0 pt-0'
                              primary={
                                <Typography variant="h6">
                                  You don&apos;t have any notification yet
                                </Typography>
                              }
                            />
                          </div>
                      }
                    </List>
                  </MainCard>

                </ClickAwayListener>
              </Paper>
            </div>

          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
