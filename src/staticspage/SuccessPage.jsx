import React from 'react'
import { Link } from '../../node_modules/react-router-dom/dist/index'
import Succespostjob from '../assets/images/success_celebratin.gif';

const SuccessPage = () => {
    return (
        <div>
            <div className="bg_top"></div>
            <div className="succes_post_job pt-5">
                <img src={Succespostjob} alt="" style={{ maxWidth: '', maxHeight: '' }} className="" />
                <h2>Your Job is posted successfully</h2>
                <p> You Can View and edit Your Listing In posted job or Dashboard</p>
                <Link to={'/user/dashboard/default'} className="chat_btn" style={{ textDecoration: 'none' }}>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default SuccessPage