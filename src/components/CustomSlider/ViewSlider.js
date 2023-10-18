import React from 'react';
import Slider from 'components/RangeSlider';

const ViewSlider = (props) => {
  return (
    <div className="row">
      <div className="col-sm-4">
        <div className="caption">
          { props.label }
        </div>
      </div>
      <div className="col-sm-8">
        <div className="progress">
          <Slider
            value={props.value}
            min={props.min}
            max={props.max}
            step={props.step}
            //tooltipAlways={true}
            onChange={(num) => {
              if (props.readOnly) {
                return;
              }
              props.onChange(num)
            }}
          />
        </div>
        <input
          type="hidden"
          name={props.name}
          value={props.value}
          data-answer-id={props.answerId}
        />
      </div>
    </div>
  )
}

export default ViewSlider;
