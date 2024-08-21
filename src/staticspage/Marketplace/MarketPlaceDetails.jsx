import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Col, Container, Row } from 'react-bootstrap';
import ProductImagesSlider from './ProductImagesSlider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocation, useNavigate } from '../../../node_modules/react-router-dom/dist/index';

const MarketPlaceDetails = () => {
  const navigate = useNavigate();
  const tabLocation = useLocation();
  const productData = tabLocation.state ? tabLocation.state.data : null;
  const goToChat = () => {
    navigate('/user/chats', { state: { product: productData } });
  };

  return (
    <div className="market_place_page_details">
      <div className="bg_top"></div>
      <section className="product_details">
        <Container>
          <Row>
            <Col md="6">
              <ProductImagesSlider images={productData?.productdata?.images} />
            </Col>
            <Col md="6">
              <div className="product_right_side_details">
                <h2>{productData?.productdata?.title}</h2>
                <div>
                  <span className="market_place_location">
                    <LocationOnIcon />
                    {productData?.productdata?.location}
                  </span>
                </div>
                <div className='appprove_badge'>
                  <i className="fa-solid fa-circle-check"></i>
                  { productData?.pilotdata?.role == "Poster" ? "Poster":"Approve Pilot" }
                </div>
                <p className="priceprodust">{productData?.productdata?.price} AUD</p>
                <div className="dec_box_product">
                  <h2>Description</h2>
                  <div dangerouslySetInnerHTML={{ __html: productData?.productdata?.description }} />
                  <ul></ul>
                </div>
              </div>
              <div className=" mt-3">
                <button className="global_btn w-100" onClick={() => goToChat()}>
                  Start Chat
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default MarketPlaceDetails;
