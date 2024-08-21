import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { Grid } from '@mui/material';
const ImagePreviewModal = (props) => {
  return (
    <>
    <Modal className="" {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="total_images_section">
                  <>
                    {props?.previewImg?.map((item, i) => (
                      <>
                        <img src={item} alt="img" style={{ width: '100%', height: '500px' }} className="grey_img" key={i} />
                      </>
                    ))}
                  </>
              </div>
            </Grid>
          </Grid>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ImagePreviewModal