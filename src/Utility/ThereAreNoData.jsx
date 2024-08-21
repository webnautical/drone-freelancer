import React from 'react'
import emptylist from '../assets/images/emptyllist.png'
const ThereAreNoData = ({ title }) => {
    return (
        <div className='empty_list_area text-center' style={{ width: '100%' }}>
            <img src={emptylist} alt="" style={{ maxWidth: '400px', maxHeight: '' }} className="" />
            <p >{title}</p>
        </div>
    )
}

export default ThereAreNoData