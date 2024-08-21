import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useState, useRef } from 'react';

const ProductImagesSlider = (props) => {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeImage, setActiveImage] = useState(props.images[0]);
  const swiperRef = useRef(null);

  const handleThumbClick = (index) => {
    setActiveThumb(index);
    setActiveImage(props.images[index]);
    swiperRef.current?.swiper.slideTo(index);
  };

  const handleSwiperNavigation = () => {
    const activeIndex = swiperRef.current?.swiper.activeIndex;
    if (activeIndex !== undefined && activeIndex !== null) {
      setActiveThumb(activeIndex);
      setActiveImage(props.images[activeIndex]);
    }
  };

  return (
    <>
      <Swiper
        // loop={true}
        spaceBetween={0}
        navigation={true}
        modules={[Navigation, Thumbs]}
        grabCursor={true}
        onSlideChange={handleSwiperNavigation}
        ref={swiperRef}
        className="product-images-slider"
      >
        {props.images.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={activeImage} alt="product images" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        loop={true}
        navigation={true}
        spaceBetween={10}
        slidesPerView={4}
        modules={[Navigation, Thumbs]}
        className="product-images-slider-thumbs"
      >
        {props.images.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              role="button"
              tabIndex={0}
              className={`product-images-slider-thumbs-wrapper ${index === activeThumb ? 'active' : ''}`}
              onClick={() => handleThumbClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleThumbClick(index);
                }
              }}
            >
              <img src={item} alt="product images" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

ProductImagesSlider.propTypes = {
  images: PropTypes.array.isRequired
};

export default ProductImagesSlider;
