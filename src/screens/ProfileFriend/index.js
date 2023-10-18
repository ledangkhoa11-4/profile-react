import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep, isEmpty } from 'lodash';
import Layout from 'components/Layout';
import Profile from './Profile';
import { APIs } from 'services/config';
import { jsonEqual, requestAPI } from 'services/utils';
import { updatePageTitle } from 'actions/ui';
import { FRIEND_STATUS, FRIEND_TYPE } from '../InviteFriend/FriendsSocial/constant';

const {
  rejectInvitingRequest,
  requestAcceptFriend,
  requestAddFriend,
  requestUnfriend,
  cancelFriendRequest,
} = APIs.friends;

function getNewStatusFriend(type) {
  switch(type) {
    case FRIEND_TYPE.ADD:
      return FRIEND_STATUS.PENDING;
    case FRIEND_TYPE.ACCEPT:
      return FRIEND_STATUS.CONNECTED;
    case FRIEND_TYPE.UNFRIEND:
    case FRIEND_TYPE.CANCEL:
    case FRIEND_TYPE.REJECT:
      return FRIEND_STATUS.STRANGER;
    default:
      return type;
  }
}

class ProfileFriendContent extends Component {
  state = {
    userInfo: {},
  }


  componentDidMount() {
    this.getFriendProfile()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !jsonEqual(this.state, nextState);
  }

  sendAddFriendRequest = (friendId) => {
    const dataForm = {
      friend_id: friendId,
      network_id: this.networkId,
    };
    this.sendFriendAction(requestAddFriend, dataForm, FRIEND_TYPE.ADD);
  }

  sendUnfriendRequest = (friendId) => {
    const dataForm = {
      friend_id: friendId,
    };
    this.sendFriendAction(requestUnfriend, dataForm, FRIEND_TYPE.UNFRIEND);
  }

  sendCancelRequest = (friendId) => {
    const dataForm = {
      friend_id: friendId,
    };
    this.sendFriendAction(cancelFriendRequest, dataForm, FRIEND_TYPE.CANCEL);
  }

  sendAcceptFriendRequest = (friendId) => {
    const dataForm = {
      friend_id: friendId,
    };
    this.sendFriendAction(requestAcceptFriend, dataForm, FRIEND_TYPE.ACCEPT);
  }

  sendRejectInvitingRequest = (friendId) => {
    const dataForm = {
      friend_id: friendId,
    };
    this.sendFriendAction(rejectInvitingRequest, dataForm, FRIEND_TYPE.REJECT);
  }

  sendFriendAction(request, dataForm, type) {
    requestAPI({
      url: request.url,
      method: request.method,
      dataForm,
    }).then(res => {
      if (!res.success) {
        return;
      }

      const userInfo = cloneDeep(this.state.userInfo)
      userInfo.friend = getNewStatusFriend(type)

      this.setState({ userInfo });
    });
  }
  
  getFriendProfile() {
    const { getFriendProfile } = APIs.profile;
    const { userHash } = this.props.match.params;
    requestAPI({
      url: getFriendProfile.url,
      method: getFriendProfile.method,
      dataForm: {
        has: userHash
      },
    }).then(res => {
      if (res.success) {
        this.setState({
          userInfo: res.data,
        })
      }
    })
  }
  
  render() {
    console.log(this.state.userInfo,'ddđ')
    if (isEmpty(this.state.userInfo)) {
      return null;
    }
    
    return (
      <Profile
        user={this.props.user}
        userInfo={this.state.userInfo}
        sendAddFriendRequest={this.sendAddFriendRequest}
        sendUnfriendRequest={this.sendUnfriendRequest}
        sendCancelRequest={this.sendCancelRequest}
        sendAcceptFriendRequest={this.sendAcceptFriendRequest}
        sendRejectInvitingRequest={this.sendRejectInvitingRequest}
      />
    )
  }
}

ProfileFriendContent = connect((state, ownProps) => ({
  user: state.user,
  ...ownProps,
}), {
  updatePageTitle,
})(ProfileFriendContent)

const ProfileFriend = () => (
  <Layout
    index={1}
    menuIcon="account_box"
    mainContent={withRouter(ProfileFriendContent)}
    title="Friend Profile"
  />
);

export default ProfileFriend;
