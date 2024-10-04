import React, { useEffect, useState } from 'react'
import breadtopimg from '../../assets/images/breadtop.png'
import { Col, Container, Row } from 'react-bootstrap';
import { axiosInstance } from 'Utility/Api';
import { useLocation } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

const Breacrumb = () => {
    const location = useLocation().pathname
    const pageName = location.replace(/\//g, "");
    const [pageData, setPageData] = useState({})
    const [breadcrumbLoading, setBreadcrumbLoading] = useState(false)

    const getPAgeData = async () => {
        setBreadcrumbLoading(true)
        try {
            const res = await axiosInstance.post('/admin/getallStaticPagedata');
            if (res?.data?.status === 200) {
                const page = res?.data?.getdata.filter((item) => item.url === pageName)[0];
                setPageData(page)
                setBreadcrumbLoading(false)
            } else {
                setPageData(null)
                setBreadcrumbLoading(false) 
            }
        } catch (error) {
            console.log(error)
            setBreadcrumbLoading(false)
        }
    }
    useEffect(() => {
        getPAgeData()
    }, [])

    return (
        <>
            <section className='global_breadcrumb_design'>
                <div className='global_breadcrumb_design_inner'>
                    <Container fluid className="">
                        <Row className="align-items-center justify-content-between">
                            <Col md={8} lg={5}>
                                <div className='about_page'>
                                    {
                                        breadcrumbLoading ? <><h1 className='text-capitalize'>
                                            <Skeleton className="mb-2" variant="rectangular" width={210} height={50} style={{ width: '40%' }} />
                                            <Skeleton className="mb-2" variant="rectangular" height={24} style={{ width: '100%' }} />
                                            <Skeleton className="mb-2" variant="rectangular" height={24} style={{ width: '100%' }} />
                                            <Skeleton className="mb-2" variant="rectangular" height={24} style={{ width: '100%' }} />
                                        </h1></>
                                            :
                                            <h1 className='text-capitalize'>{pageData?.title || pageName?.replace(/-/g, ' ')}</h1>
                                    }
                                    {
                                        pageName == "how-it-works"  ||  pageName == "why-drone-freelancer"?
                                            <p dangerouslySetInnerHTML={{ __html: pageData?.content2 }} />
                                            :
                                            <div dangerouslySetInnerHTML={{ __html: pageData?.content }} />
                                    }

                                </div>
                            </Col>
                            <Col lg={5} className="p-0">
                                <div className='top_image'>
                                    <img className='w-100' src={breadtopimg} alt='breadcrumbimg' />
                                </div>
                            </Col>

                        </Row>
                    </Container>
                </div>
            </section>
        </>
    )
}

export default Breacrumb