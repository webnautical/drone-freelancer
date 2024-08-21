import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getAllLocatData } from './Utility';
import { Link, useNavigate } from '../../node_modules/react-router-dom/dist/index';
import noplan from '../assets/images/noplan.jpg'
const FreePlanModal = ({msg, freePlanModal,setFreePlanModal}) => {
    const navigate = useNavigate()
    useEffect(() => {
        if(getAllLocatData()?.user_type == "Pilot"){
            if(getAllLocatData()?.subcription_type == 'free' || getAllLocatData()?.subcription_type == ''){
                setFreePlanModal(true)
            }
        }
    },[])
    const backPage = () => {
        navigate(-1)
        setFreePlanModal(false)
    }
    return (
        <>
            <Dialog
                open={freePlanModal}
                onClose={() => backPage()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                
                BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
                fullscreen
                maxWidth="100%"
                
            >
                <DialogContent  >
                    <DialogContentText id="alert-dialog-description" >
                        <div className='ops_image text-center'>
                            <img src={noplan} alt=''/>
                        </div>
                        <h5 className='text-center modal_head '>Dear <strong className=''>{`${getAllLocatData()?.loginname}`}</strong></h5>
                        <div className='text-center'>
                            <div className='m-2 px-4'>
                                <p style={{ fontSize: '16px' }}>{msg}</p>
                            </div>
                            <h6 className=' text-success mb-4'>Thank you!</h6>
                        </div>
                        <div className='text-center d-flex gap-1 mt-2'>
                            <button className='chat_btn' onClick={()=>backPage()}>Back</button>
                            <Link to={`/user/plans`} style={{textDecoration: 'none'}} className='chat_btn'>View plan</Link>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FreePlanModal