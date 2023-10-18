import React from 'react';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { FRIEND_STATUS } from './constant';
import { ROUTER_PATH } from 'services/config';

function renderBtnContent(user, props) {
  let propsBtns;
  const { localeNetwork } = props;
  
  switch (user.friend) {
    case FRIEND_STATUS.PENDING:
      propsBtns = [{
        textBtn: localeNetwork.CANCEL_FRIEND,
        icon: require('assets/images/user5.png'),
        // icon: 'clear',
        actionFunc: props.sendCancelRequest,
      }];
      break;
    case FRIEND_STATUS.STRANGER:
      propsBtns = [{
        textBtn: localeNetwork.INVITE_FRIEND,
        // icon: 'add',
        icon: require('assets/images/user8.png'),
        actionFunc: props.sendAddFriendRequest,
      }];
      break;
    case FRIEND_STATUS.INVITING:
      propsBtns = [
        {
          textBtn: localeNetwork.ACCEPT_FRIEND,
          // icon: 'done',
          icon: require('assets/images/user4.png'),
          actionFunc: props.sendAcceptFriendRequest,
        },
        {
          textBtn: localeNetwork.REJECT_FRIEND,
          // icon: 'not_interested',
          icon: require('assets/images/user6.png'),
          actionFunc: props.sendRejectInvitingRequest,
        }
      ]
      break;
    default:
      // case 'friend':
      propsBtns = [{
        textBtn: localeNetwork.UN_FRIEND,
        // icon: 'remove_circle',
        icon: require('assets/images/user7.png'),
        actionFunc: props.sendUnfriendRequest,
      }]
  }

  return (
    <div className="wrapper-container-btn">
      <div className="container-btn">
        {
          propsBtns.map((item, idx) => {
            return (
              <div className="item-btn" key={idx}>
                <button
                  type="button"
                  className={`btn`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    item.actionFunc(user.id);
                  }}
                  title={item.textBtn}
                >
                  <img src={item.icon} alt={item.textBtn}/>
                </button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const Users = (props) => {
  const {
    users,
  } = props;
  
  const listUser = () => {
    return map(users, (user, idx) => {
      const { name, email, phone, has } = user;
      const url = ROUTER_PATH.FRIEND_PROFILE.replace(':userHash', has);
      
      return (
        <li key={idx}>
          <div className="thumb">
            {
              !user.fullAvatar ?
                <span className="material-icons">face</span> :
                <img src={user.fullAvatar} alt={user.name}/>
            }
            { renderBtnContent(user, props) }
          </div>
          <Link to={url}>
            <div className="wrapper-name">
              <div title={name} className="name">
                { name || email || phone }
              </div>
            </div>
          </Link>
        </li>
      );
    })
  }

  if (!users.length) {
    return null;
  }

  return (
    <div className="joined-user">
      {
        props.isEmailPhoneNetwork ?
          <h4>User joined: </h4> : null
      }
      <ul>
        { listUser() }
      </ul>
    </div>
  )
}

Users.propTypes = {
  isEmailPhoneNetwork: PropTypes.bool,
  users: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  sendAcceptFriendRequest: PropTypes.func,
  sendAddFriendRequest: PropTypes.func,
  sendUnfriendRequest: PropTypes.func,
  sendCancelRequest: PropTypes.func,
  sendRejectInvitingRequest: PropTypes.func,
}

export default Users;
