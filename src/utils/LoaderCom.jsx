import React from 'react';
// import ReactLoading from 'react-loading';
import styled from 'tachyons-components';
import gifloader from '../assets/images/loader.png'
const LoaderCom = () => {
  return (
    <>
      <Section>
        <Article>
          {/* <ReactLoading type="cylon" color="#fff " /> */}
          {/* <ReactLoading type={type} color={color} /> */}
          <img src={gifloader} alt='' style={{ width: '150px' }} />

          <div id="wave">
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
</div>
        </Article>
      </Section>
    </>
  );
};

export default LoaderCom;

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;
export const Article = styled('loader')` loaderdesign
w-100  ma2 h4 items-center justify-center flex flex-column flex-wrap`;
