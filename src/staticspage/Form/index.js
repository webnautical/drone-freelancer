import React from 'react'
import { useLocation } from '../../../node_modules/react-router-dom/dist/index';
import BusinessForm from './BusinessForm';

const FormIndex = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let url = useQuery().get('v');
    console.log(url)
  return (
    <>
        <BusinessForm />
    </>
  )
}

export default FormIndex