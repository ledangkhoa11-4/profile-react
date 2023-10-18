import React from 'react';
import Rater from 'react-rater';

const ViewRating = (props) => {
  return (
    <div className="rating">
      <span className="caption">
        <span className="text">{ props.label }</span>
      </span>
      <span className="rating-item">
        <Rater
          total={5}
          rating={props.value}
          onRate={props.changeRating}
          interactive={props.interactive}
        />
      </span>
      <input
        type="hidden"
        name={props.name}
        value={props.value}
        data-answer-id={props.answerId}
      />
    </div>
  )
}

export default ViewRating;
