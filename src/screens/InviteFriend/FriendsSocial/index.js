import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, find } from 'lodash';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import FriendsContent from './FriendsContent';
import { APIs } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import { getNewList, getNewListInTabAllFriend } from '../util';
import { updatePageTitle } from 'actions/ui';
import {
  FRIEND_TYPE,
  FRIEND_STATUS,
  SEARCH_NAME,
} from './constant';

const {
  getConnectedFriendsRequest,
  getInvitingRequest,
  getPendingRequest,
  facebookFriends,
  rejectInvitingRequest,
  requestAcceptFriend,
  requestAddFriend,
  requestUnfriend,
  cancelFriendRequest,
  allFriendLocal,
  searchFriend,
} = APIs.friends;

class FriendSocialContent extends Component {
  state = {
    friends: [],
    strangeUser: [],
    friendTypeOpt: FRIEND_STATUS.ALL,
    hasLoginSocial: true,
    isBottomLoading: false,
    paging: {
      method: 'GET',
      next_page_url: '',
      dataForm: {},
    },
    [SEARCH_NAME]: '',
  }

  constructor(props) {
    super(props);
    this.networkId = this.props.match.params.networkId;
  }

  componentWillMount() {
    window.addEventListener('message', this.onPostMessage, false);    
    window.addEventListener('scroll', this.handleOnScroll, false);
  }

  componentWillUnmount() {
    this.hasWillUnmount = true;
    window.removeEventListener('message', this.onPostMessage, false);
    window.removeEventListener('scroll', this.handleOnScroll, false);
  }

  componentDidMount() {
    this.getLocalFriend();
  }

  getProviderRequest() {
    let provider = this.state.socialProvider.toLowerCase();
    if (provider.indexOf('facebook') > -1) {
      return facebookFriends;
    }
    // TODO: will be updated for other social providers
  }

  getLocalFriend() {
    const dataForm = {
      network_id: this.networkId,
    };

    requestAPI({
      url: allFriendLocal.url,
      method: allFriendLocal.method,
      dataForm,
    }).then(res => {
      if (res.success) {
        this.setState({
          friends: res.data.data,
          paging: {
            method: allFriendLocal.method,
            next_page_url: res.data.next_page_url,
            dataForm,
          },
          socialIcon: res.data.icon,
          socialName: res.data.name,
          socialProvider: res.data.provider,
          hasLoginSocial: true,
        })
      }
    })
  }

  getSocialFriend() {
    const providerRequest = this.getProviderRequest();
    requestAPI({
      url: providerRequest.url,
      method: providerRequest.method,
    }).then(res => {
      // if success, the server will response the user data. Else
      // we have 2 cases: 
      //  - user has not logined yet
      //  - user has logined with other accounts
      let state;
      if (!res.success) {
        this.socialLoginUrl =  res.login || '';
        state = { hasLoginSocial: false };
      } else {
        state = {
          friends: res.data.data,
          paging: {
            method: providerRequest.method,
            next_page_url: res.data.next_page_url,
          },
          hasLoginSocial: true,
        };
      }
      this.setState(state);
    })
  }

  handleOnScroll = async () => {
    await onScroll();
    if (this.state.paging.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.onLoadMore();
      });
    }
  }

  onLoadMore = async () => {
    try {
      const res = await requestAPI({
        url: this.state.paging.next_page_url,
        method: this.state.paging.method,
        dataForm: this.state.paging.dataForm,
        isShowPageLoading: false,
      });
      
      if (this.hasWillUnmount) {
        return;
      }

      this.setState({
        friends: this.state.friends.concat(res.data.data),
        next_page_url: res.data.next_page_url,
        isBottomLoading: false,
      });
    } catch (error) {
      if (this.hasWillUnmount) {
        return;
      }
      
      this.setState({ isBottomLoading: false });
    }
  }
  
  onPostMessage = (evt) => {
    let response = evt.data
    
    if (typeof response === 'string' && response.indexOf('isSuccess') > -1) {
      response = JSON.parse(evt.data);
    }

    if (response && response.isSuccess) {
      this.getLocalFriend();
    }
  }

  showLoginSocial = () => {
    const left = window.screen.width / 2 - 400;
    
    window.open(
      this.socialLoginUrl + '?api_token=' + window.uuid,
      '',
      `width=800, height=500, left=${left}`
    );
  }  

  onChangeSearchInput = (e) => {
    this.setState({ [SEARCH_NAME]: e.target.value });
  }

  onFilter = (status) => {
    let url, method;

    if (this.state.friendTypeOpt === status) {
      return;
    }
    
    switch(status) {
      case FRIEND_STATUS.PENDING:
        url = getPendingRequest.url;
        method = getPendingRequest.method;
        break;
      case FRIEND_STATUS.INVITING:
        url = getInvitingRequest.url;
        method = getInvitingRequest.method;
        break;
      case FRIEND_STATUS.CONNECTED:
        url = getConnectedFriendsRequest.url;
        method = getConnectedFriendsRequest.method;
        break;
      case FRIEND_STATUS.SOCIAL:
        const providerRequest = this.getProviderRequest();
        url = providerRequest.url;
        method = providerRequest.method;
        break;
      default:
        url = allFriendLocal.url;
        method = allFriendLocal.method;
        break;
    }

    const dataForm = { network_id: this.networkId };

    requestAPI({
      url,
      method,
      dataForm,
    }).then(res => {
      if (res.success) {
        this.setState({
          friends: res.data.data,
          friendTypeOpt: status,
          paging: {
            method,
            next_page_url: res.data.next_page_url,
            dataForm,
          },
        });
      }
    })
  }

  onSyncSocial = () => {
    const {
      url,
      method
    } = APIs.friends.syncSocialFriend;
    const dataForm = {
      network_id: this.networkId
    };

    requestAPI({
      url,
      method,
      dataForm,
    }).then(res => {
      if (res.success) {
        this.setState({
          friends: res.data,
          friendTypeOpt: FRIEND_STATUS.SOCIAL,
          paging: {
            method,
            next_page_url: res.data.next_page_url,
            dataForm,
          },
        });
      }
    })
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

      const newList = this.state.friendTypeOpt === FRIEND_STATUS.ALL ?
        getNewListInTabAllFriend(type, this.state.friends, dataForm.friend_id) :
        getNewList(this.state.friends, dataForm.friend_id);

      this.setState({ friends: newList });
    });
  }

  searchFriends = (e) => {
    e.preventDefault();
    if (!this.state[SEARCH_NAME]) {
      return;
    }

    const {
      socialName,
    } =  this.state;
    let categorySearch = 'name';
    if (socialName.toLowerCase().indexOf('phone') > -1) {
      categorySearch = 'phone';
    } else if (socialName.toLowerCase().indexOf('email') > -1) {
      categorySearch = 'email';
    }

    let status = this.state.friendTypeOpt;
    /*
    * We can search user key word on social network, so
    * we will search user key word on local system
    */
    if (FRIEND_STATUS.SOCIAL === status) {
      status = FRIEND_STATUS.ALL;
    }

    const dataForm = {
      network_id: this.networkId,
      keyword: this.state[SEARCH_NAME],
      search: categorySearch,
      status: this.state.friendTypeOpt,
    };

    requestAPI({
      url: searchFriend.url,
      method: searchFriend.method,
      dataForm,
    }).then(res => {
      if (res.success) {
        this.setState({
          friends: res.data.data,
          strangeUser: [],
          paging: {
            dataForm,
            method: searchFriend.method,
            next_page_url: res.data.next_page_url,
          },
        })
      }
    })
  }

  onAfterInvitingPhoneEmail = (listData) => {
    const { socialName } =  this.state;
    let findKey = 'email';
    if (socialName.toLowerCase().indexOf('phone') > -1) {
      findKey = 'phone';
    }
    let strangeUser = [];
    const filterList = filter(listData, item => {
      const entry = find(this.state.friends, {[findKey]: item[findKey]})
      if (!item.id) {
        strangeUser.push(item);
      }
      return !item.id || entry ? false : true;
    });
    
    const newList = this.state.friends.concat(filterList);
    this.setState({
      friends: newList,
      strangeUser,
    });
  }

  renderLoginSocialBtn() {
    return (
      <button className="btn" onClick={this.showLoginSocial}>
        Login
      </button>
    )
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const {
      socialIcon,
      socialName,
    } = this.state;

    return (
      <div className="box-friend">
        <div className="inner">
          <div className="head">
            <div className="width name">
              <span className={socialIcon || ''}></span>
              <span className="text">{ socialName || '' }</span>
            </div>
            <div className="width text-right back-screen">
              <a role="button" title="Back" onClick={this.goBack}>
                <span className="material-icons">arrow_back</span>
                {/*<span className="text">Back</span>*/}
              </a>
            </div>
          </div>
          <div className="content">
            {
              this.state.hasLoginSocial ?
                <FriendsContent
                  localeNetwork={this.props.localeNetwork}
                  onAfterInvitingPhoneEmail={this.onAfterInvitingPhoneEmail}
                  onChangeSearchInput={this.onChangeSearchInput}
                  onFilter={this.onFilter}
                  onSyncSocial={this.onSyncSocial}
                  formState={this.state}
                  searchFriends={this.searchFriends}
                  sendAddFriendRequest={this.sendAddFriendRequest}
                  sendUnfriendRequest={this.sendUnfriendRequest}
                  sendCancelRequest={this.sendCancelRequest}
                  sendAcceptFriendRequest={this.sendAcceptFriendRequest}
                  sendRejectInvitingRequest={this.sendRejectInvitingRequest}
                /> :
                this.renderLoginSocialBtn()
            }
          </div>
        </div>
      </div>
    )
  }
}

FriendSocialContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(FriendSocialContent)

const SocialFriends = (props) => {
  return (
    <Layout
      index={3}
      title="Network"
      menuIcon="person_add"
      mainContent={withRouter(() => {
        return <FriendSocialContent {...props}/>
      })}
    />
  )
}

export default SocialFriends;
