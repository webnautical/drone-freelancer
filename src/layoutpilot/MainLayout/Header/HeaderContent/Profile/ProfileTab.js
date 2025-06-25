import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from '../../../../../../node_modules/react-router-dom/dist/index';
import { axiosInstance } from 'Utility/Api';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { toastifySuccess } from 'Utility/Utility';
const ProfileTab = ({ handleLogout,onClose }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete('user/deleteUserAccount');
      if (res?.data?.status === 200) {
        setLoading(false);
        setOpen(false);
        toastifySuccess("Your Account Deleted Successfully !!");
        localStorage.clear();
        if (onClose) onClose();
        navigate('/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>


      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
        <ListItemButton onClick={() => setOpen(true)}>
          <ListItemIcon>
          <LogoutOutlined />

          </ListItemIcon>
          <ListItemText primary="Delete Profile" />
        </ListItemButton>

        <ListItemButton selected={2 === 2} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
      <Dialog
        open={open}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className='text-danger'>{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete your profile?
          </DialogContentText>
          <div className='mt-4 text-end'>
            <button className='dash_edit_btn global_btn py-2 mx-2' onClick={() => setOpen(false)}>Cancel  </button>
            {
              loading ?
                <button type='button' className='dash_edit_btn global_btn py-2'>Loading...  </button>
                :
                <button type='button' className='dash_edit_btn global_btn py-2' onClick={() => handleDeleteAccount()}>Yes, I Want to Delete  </button>

            }
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
