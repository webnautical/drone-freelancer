// import React from 'react'
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //
// import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { axiosInstance } from 'Utility/Api';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import { toastifySuccess } from './Utility';
const DeleteProfileButton = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleDeleteAccount = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.delete('user/deleteUserAccount');
        console.log(res)
        if (res?.data?.status == 200) {
          setLoading(false)
          toastifySuccess("Your Account Deleted Successfully !!")
          navigate('/');
          localStorage.clear();
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    return (
        <>
            <button onClick={() => setOpen(true)} className='dash_edit_btn global_btn'>Delete Profile</button>

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
    )
}

export default DeleteProfileButton