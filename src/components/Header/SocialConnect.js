import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTER_PATH } from 'services/config';

const SocialConnect = (props) => {

  return (
    <div className="inner">
      <ul className="list-social-connect">
        {
          props.networks.map(item => {
            return (
              <li key={item.id}>
                <Link to={{
                  pathname: ROUTER_PATH.FRIEND,
                  state: {
                    providerSelected: item.provider
                  }
                }} title={item.name} onClick={() => {
                  setTimeout(() => {
                    props.hideMenu()
                  }, 300)
                }}>
                  <span className={`icon ${item.icon}`}></span>
                  <span className="text">{item.name}</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  networks: state.networks,
})

export default connect(mapStateToProps)(SocialConnect);
