import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
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
import { axiosInstance } from 'Utility/Api';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { timeAgo } from 'Utility/Date';
import { Link, useNavigate } from '../../../../../node_modules/react-router-dom/dist/index';
import { Skeleton } from '../../../../../node_modules/@mui/material/index';

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
  const [notificationList, setNotificationList] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    navigate('/admin/notification')
    // setOpen((prevOpen) => !prevOpen);
    // getNotification()
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

  const getNotification = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.post('/admin/getalladminnotification')
      if (res?.data?.status == 200) {
        setNotificationCount(res?.data?.totalRecords)
        setNotificationList(res?.data?.data)
        setLoading(false)
      } else {
        setNotificationList([])
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setNotificationList([])
      setLoading(false)
    }
  }

  const removeNotification = async (data) => {
    const updatedItems = notificationList.filter((item) => item._id !== data._id);
    if (notificationList.length == 1) {
      getNotification()
    }
    setNotificationList(updatedItems);
    setNotificationCount(notificationCount - 1);
    const params = { id: data?._id }
    await axiosInstance.post('/admin/seenadminnotification', params)
  }
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
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
        <Badge badgeContent={notificationCount + "+"} color="primary">
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
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              className='notification-box'
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285, maxWidth: 370, maxHeight: 400, height: 'auto',
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
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
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >

                    {
                      loading ? <>
                        <div className='row px-2'>
                          <div className='col-12 d-flex'>
                            <Skeleton variant="circular" animation="wave" sx={{ gap: 2 }} width={30} height={30} />
                            <div className='ms-2'>
                              <Skeleton variant="rectangular" animation="wave" width={300} height={10} />
                              <Skeleton variant="rectangular" animation="wave" sx={{ my: 1 }} width={300} height={10} />
                              <Skeleton variant="rectangular" animation="wave" width={300} height={10} />
                            </div>
                          </div>
                          {[...Array(5)].map((_, index) => (
                            <div className='col-12 mt-4 d-flex' key={index}>
                              <Skeleton variant="circular" animation="wave" sx={{ gap: 2 }} width={30} height={30} />
                              <div className='ms-2'>
                                <Skeleton variant="rectangular" animation="wave" width={300} height={10} />
                                <Skeleton variant="rectangular" animation="wave" sx={{ my: 1 }} width={300} height={10} />
                                <Skeleton variant="rectangular" animation="wave" width={300} height={10} />
                              </div>
                            </div>
                          ))}
                        </div>



                      </> :
                        notificationList.length > 0 ?
                          notificationList?.map((item, i) => (
                            <>
                              <ListItemButton key={i} >
                                <ListItemAvatar>
                                  <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                                    <NotificationsActiveIcon />
                                  </Avatar>
                                </ListItemAvatar>

                                <ListItemText onClick={() => { navigate(`/profile-details/${item.user_id}`); setOpen(false) }} primary={
                                  <Typography variant="h6"> <strong className='text-uppercase'>{item.user_name}</strong> has updated their <strong>{item.updated_key.replace(/_/g, ' ')}</strong> - ({item.updated_value})</Typography>
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


                    <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            <Link to={'/admin/notification'} onClick={() => setOpen(false)} className='text-dark'> View All</Link>
                          </Typography>
                        }
                      />
                    </ListItemButton>


                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
