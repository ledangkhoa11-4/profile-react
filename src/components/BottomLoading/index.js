import React from 'react';
import './style.css';

const BottomLoading = () => {
  return (
    <div className="bottom-loading ">
      <div className="mini-loader-content">
        <div className="load-container">
          <div className="load-loader">
            <div className="spinnerBlock">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomLoading;
