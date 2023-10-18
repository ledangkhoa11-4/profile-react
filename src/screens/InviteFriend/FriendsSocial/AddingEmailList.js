import React from 'react';

const AddingEmailList = ({ items , localeNetwork, removeItem }) => {
  return (
    <ul>
      {
        items.map((item, idx) => {
          return (
            <li key={idx}>
              {/* <div className="thumb">
                <img src={require('assets/images/avatar_3.png')} alt=""/>
              </div> */}
              <div className="email">{ item }</div>
              <div className="group-btn">
                <a
                  role="button"
                  title={localeNetwork.REMOVE}
                  className="btn"
                  onClick={() => {
                    removeItem(idx);
                  }}
                >
                  <span className="fa fa-minus"/>
                </a>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

export default AddingEmailList;
