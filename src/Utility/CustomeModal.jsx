import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import awarimg from '../assets/images/award.png';
const CustomeModal = (props) => {
  const { showModal, setShowModal, modalMsg, handleFunc, submitLoading } = props;
  return (
    <>
      <Modal show={showModal} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton onClick={() => setShowModal(false)}></Modal.Header>
        <Modal.Body className="text-center px-3">
          <div className="rev_box">
            <img src={awarimg} alt="" style={{ maxWidth: '', maxHeight: '' }} className="grey_img" />
          </div>
          <h5 className="mt-4 text-capitalize">{modalMsg}</h5>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={() => setShowModal(false)}>Close</Button> */}
          {submitLoading ? (
            <button className="chat_btn">
              <div className="spinner-border spinner-border-sm me-1" role="status"></div> Loading ...
            </button>
          ) : (
            <Button className="chat_btn" onClick={() => handleFunc()}>
              Yes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomeModal;
