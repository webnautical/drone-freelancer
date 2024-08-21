import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { axiosInstance } from './Api';
import { toastifyError, toastifySuccess } from './Utility';

import reviewimg from '../assets/images/rev.png'

import StarRating from './StarRating';

const ReviewModal = (props) => {
    // const [value, setValue] = React.useState(2);
    const { showReviewModal, setShowReviewModal, reviewToId, job_id } = props;
    const [submitLoading, setSubmitLoading] = useState(false);
    const [param, setParam] = useState({
        reviewedBy: 'test',
        rating: '',
        review: '',
        job_id: job_id
    });
    const handleChange = (e) => {
        console.log(e.target)
        setParam({
            ...param,
            [e.target.name]: e.target.value
        });
    };
    // const handleChangeRating = (e) => {
    //     console.log(e.target)
    // }


    const handleReview = async () => {
        setSubmitLoading(true);
        try {
            const res = await axiosInstance.post(`/user/createReview/${reviewToId}`, param);
            if (res.status == 200) {
                toastifySuccess('Review Submited Succesfully !!');
                setShowReviewModal(false);
                setSubmitLoading(false);
            } else {
                toastifyError("Something Wen't Wrong !!");
                setSubmitLoading(false);
            }
        } catch (error) {
            console.log(error);
            if (error?.response?.status == 400) {
                toastifyError(error?.response?.data?.message);
            } else {
                toastifyError("Something Wen't Wrong !!");
            }
            setSubmitLoading(false);
        }
    };



    const handleRatingChange = (newRating) => {
        setParam({ ...param, 'rating': newRating })
    };

    return (
        <Modal show={showReviewModal} size="md" aria-labelledby="contained-modal-title-vcenter" centered className="review_model">
            <Modal.Header closeButton onClick={() => setShowReviewModal(false)}></Modal.Header>
            <Modal.Body className="text-center px-3">


                <div className="review-box">

                    <div className='rev_box'>
                        <img
                            src={reviewimg}
                            alt=""
                            style={{ maxWidth: '', maxHeight: '' }}
                            className="grey_img"
                        />
                    </div>

                    <StarRating
                        totalStars={5}
                        initialRating={param.rating}
                        onRatingChange={handleRatingChange}
                    />
                    {/* <input type="text" className="form-control" name="rating" onChange={handleChange} placeholder="Star" /> */}
                    <textarea
                        name="review"
                        onChange={handleChange}
                        cols="30"
                        rows="5"
                        className="form-control mt-3"
                        placeholder="Write Your Feedback ..."
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button onClick={() => setShowReviewModal(false)}>Close</Button> */}
                {submitLoading ? (
                    <button className="chat_btn">
                        <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
                    </button>
                ) : (
                    <Button className='chat_btn' onClick={() => handleReview()}>Ok</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewModal;
