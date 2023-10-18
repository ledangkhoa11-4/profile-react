import React from 'react';
import { map } from 'lodash';

const Setting = (props) => {
  const {
    localeSetting,
    settings,
    onChangeSetting,
  } = props;

  return map(settings, (setting, key) => {
    return (
      <form name="option" className="form form-setting" key={key}>
        <div className="box">
          <div className="inner">
            <div className="title">
              <span className="material-icons">
                {key}
              </span>
              <h2>{key} Address</h2>
            </div>
            <div className="content">
              <ul className="list-setting">
                {
                  map(setting, (item, k) => {
                    return (
                      <li key={k}>
                        <span className="material-icons">
                          perm_data_setting
                        </span>
                        <div className="desc">
                          <h3>{ item.title }</h3>
                          <p>{ item.description }</p>
                          <a
                            title={localeSetting.LEARN_MORE}
                            href={item.learn_more}
                          >
                            {localeSetting.LEARN_MORE}
                          </a>
                        </div>
                        <div className="btn-setting">
                          <input 
                            type="checkbox"
                            name="check-1"
                            className="toggle"
                            defaultChecked={item.setting}
                            onChange={(e) => {
                              onChangeSetting(e.target, item.id)
                            }}
                          />
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </form>
    )
  })
}

export default Setting;
