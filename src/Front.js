import React, { useEffect, useState } from 'react';
import Footer from 'staticspage/Footer/Footer';
import Header from 'staticspage/Header/Header';
import { useLocation } from '../node_modules/react-router-dom/dist/index';
import LoaderCom from 'utils/LoaderCom';
import { FrontContextProvider } from 'context/FrontContextProvider';
import GetMetaDetails from 'staticspage/meta/GetMetaDetails';

const Front = ({ cmp }) => {
  const Component = cmp;

  const [isLoading, setLoading] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [currentPath]);

  return (
    <>
      {isLoading ? (
        <>
          <LoaderCom />
        </>
      ) : (
        <>
          <FrontContextProvider>
            <GetMetaDetails />
            <Header />
            <Component />
            <Footer />
          </FrontContextProvider>
        </>
      )}
    </>
  );
};

export default Front;
