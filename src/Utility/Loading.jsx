import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'tachyons-components';
const Loading = () => {
  return (
    <>
      <Section>
        <Article>
          <ReactLoading type="cylon" color="#000 " />
          {/* <ReactLoading type={type} color={color} /> */}
        </Article>
      </Section>
    </>
  );
};

export default Loading;

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100`;
export const Article = styled('loader')`
w-100 ma2 h4 items-center justify-center flex flex-column flex-wrap`;
