import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { axiosInstance } from 'Utility/Api';
import { useLocation } from 'react-router-dom';
const GetMetaDetails = () => {
    const location = useLocation();
    const [data, setData] = useState({});

    useEffect(() => {
        fetchData();
    }, [location.pathname]);

    const fetchData = async () => {
        try {
            const pathWithoutLeadingSlash = location.pathname.replace(/^\/+/g, '');
            const params = { slug: pathWithoutLeadingSlash || "home" }
            console.log("pathWithoutLeadingSlash", params)
            const res = await axiosInstance.post('admin/getMetadetail', params)
            if (res?.status === 200) setData(res.data.metadata); else setData(null)
        } catch (error) { console.error(error); setData(null) }
    };

    return (
        <>
            <Helmet>
                <title>{data?.meta_title || "Drone Freelancer"}</title>
                <meta name="description" content={data?.meta_description || "Drone Freelancer"} />
            </Helmet>
        </>
    );
};

export default GetMetaDetails;