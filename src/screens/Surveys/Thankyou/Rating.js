import React from 'react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css'

const Rating = (props) => {

  return (
    <li>
      <span className="caption">
        {/* <span className={props.iconClass}></span> */}
        <span className="text">{ props.text }</span>
      </span>
      <span className="rating-item">
        <Rater
          total={5}
          rating={props.rating}
          onRate={(val) => {
            props.changeRating(val.rating, props.index)
          }}
        />
      </span>
    </li>
  )
}

export default Rating;
