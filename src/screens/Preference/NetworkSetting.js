import React from 'react';

const NetworkSetting = () => {
  return (
    <form name="option" className="form form-setting">
      <div className="box">
        <div className="inner">
          <div className="title">
            <span className="material-icons">local_phone </span>
            <h2> Networks</h2>
          </div>
          <div className="content text-center">
            <div className="list-check-social">
              <ul>
                <li className="fb">
                  <input type="checkbox" name="check-3b" className="toggle"/>
                </li>
                <li className="tw">
                  <input type="checkbox" name="check-3b" className="toggle"/>
                </li>
                <li className="in">
                  <input type="checkbox" name="check-3b" className="toggle"/>
                </li>
                <li className="vk">
                  <input type="checkbox" name="check-3b" className="toggle"/>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default NetworkSetting;
