import React, { createContext, useState,
    //  useEffect
     } from 'react';
// import config from 'config';

export const DataContext = createContext();

const ProductContextProvider = (props) => {
    // const [dealerinfo, setDealerinfo] = useState([]);
    // const [products, setProducts] = useState([]);
    // const [subCat, setSubCat] = useState([]);
    const [loginname, setLoginname] = useState(localStorage.getItem('loginname'));
    const [loginstatus, setLoginstatus] = useState(localStorage.getItem('loginstatus'));
    const [login_id, setLogin_id] = useState(localStorage.getItem('login_id'));
    // const [loginrole, setLoginRole] = useState(localStorage.getItem('loginrole'));

    // useEffect(() => {
    //     // Make API call to fetch categories and products data
    //     const fetchCategoriesAndProducts = async () => {
    //         const dealerresponse = await fetch(`${config.url}/user/alldealers`);
    //         const dealerData = await dealerresponse.json();
    //         setDealerinfo(dealerData);

    //         const productsResponse = await fetch('/api/product');
    //         const productsData = await productsResponse.json();
    //         setProducts(productsData);

    //         const subcatResponse = await fetch('/api/subcategory');
    //         const subcatData = await subcatResponse.json();
    //         setSubCat(subcatData);
    //     };

    //     fetchCategoriesAndProducts();
    // }, []);

    return (
        <DataContext.Provider
            value={{ loginname, setLoginname, loginstatus, setLoginstatus, login_id, setLogin_id }}
        >
            {props.children}
        </DataContext.Provider>
    );
};

export default ProductContextProvider;
