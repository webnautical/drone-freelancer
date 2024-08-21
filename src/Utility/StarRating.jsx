import React, { useState } from 'react';
import PropTypes from 'prop-types';
 
const StarRating = ({ totalStars, initialRating, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);
 
    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
        onRatingChange(selectedRating);
    };
 
    return (
        <div className='star_icon'>
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    selected={index < rating}
                    onClick={() => handleStarClick(index + 1)}
                />
            ))}
    
        </div>
    );
};
const Star = ({ selected, onClick }) => (
    <button onClick={() => onClick()} style={{ cursor: 'pointer' }}>
        {selected ? '★' : '☆'}
    </button>
);
 
StarRating.propTypes = {
    totalStars: PropTypes.number.isRequired,
    initialRating: PropTypes.number.isRequired,
    onRatingChange: PropTypes.func.isRequired,
};
 
export default StarRating;