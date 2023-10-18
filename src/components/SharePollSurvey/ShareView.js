import React from 'react';
import { INPUT_NAME } from './constant';

const ShareView = (props) => {
  const {
    formState,
    onChange,
  } = props;

  return (
    <ul>
      <li className="fb">
        <input
          type="checkbox"
          name={INPUT_NAME.FB}
          className="toggle"
          checked={formState[INPUT_NAME.FB]}
          onChange={onChange}
        />
      </li>
      {/* <li className="tw">
                  <input
                    type="checkbox"
                    name={INPUT_NAME.TW}
                    className="toggle"
                  />
                </li>
                <li className="in">
                  <input
                    type="checkbox"
                    name={INPUT_NAME.IN}
                    className="toggle"
                  />
                </li>
                <li className="vk">
                  <input
                    type="checkbox"
                    name={INPUT_NAME.VK}
                    className="toggle"
                  />
                </li> */}
    </ul>
  )
}

export default ShareView;
