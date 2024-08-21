import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getAllLocatData } from './Utility';
const FormModal = ({modalData, modal, setShowModal}) => {
    // const navigate = useNavigate()
    // useEffect(() => {
    //     if(getAllLocatData()?.user_type == "Pilot"){
    //         if(getAllLocatData()?.subcription_type == 'free' || getAllLocatData()?.subcription_type == ''){
    //             setFreePlanModal(true)
    //         }
    //     }
    // },[])
    const backPage = () => {
        setShowModal(false)
    }
    return (
        <>
            <Dialog
                open={modal}
                onClose={() => backPage()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                BackdropProps={{ style: { backdropFilter: 'blur(5px)' } }}
                fullscreen
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <h5 className='text-center '>Dear <strong className='text-uppercase'>{`${getAllLocatData()?.loginname || 'user'}`}</strong></h5>
                        <div className='text-center'>
                            <div className='my-3 px-4'>
                                <p style={{ fontSize: '16px' }}>{modalData.msg}</p>
                            </div>
                            <h6 className='text-success'>Thank you!</h6>
                        </div>
                        <div className='text-center d-flex gap-1 mt-3'>
                            <button className='chat_btn' onClick={()=>backPage()}>Back</button>
                            {modalData.btn}
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FormModal