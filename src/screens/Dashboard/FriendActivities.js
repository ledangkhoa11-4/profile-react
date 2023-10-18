import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import BottomLoading from 'components/BottomLoading';

class FriendActivities extends Component {
  loadMore = () => {
    this.props.getFriendActivities(true)
  }

  reFetch = () => {
    this.props.getFriendActivities()
  }
  
  render() {
    const { friendActivities } = this.props;
    if (!friendActivities.listFriendActivities.length) {
      return null;
    }
    const { localeHome } = this.props;
    
    return (
      <div className="detail full">
        <div className="head-detail style-1">
          <div className="title">
            <span className="icon icon-activities-1"/>
            <span className="text">
              {localeHome.FRIEND_ACTIVITIES_TITLE}
              <span className="small">
                {friendActivities.total} 
                {localeHome.TOTAL_ACTIVE_TITLE}
              </span>
            </span>
          </div>
          <div className="toolbar">
            <ul>
              <li>
                <a
                  role="button"
                  title={localeHome.SYNC_BUTTON}
                  onClick={this.reFetch}
                >
                  <span className="material-icons">&#xE627;</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="content-detail">
          <ul className="list-noti table">
            {
              friendActivities.listFriendActivities.map((activity, idx) => {
                const { sender } = activity;
                const userName = sender && sender.name ? sender.name : '';
                const userAvatar = sender && sender.fullAvatar ?
                  sender.fullAvatar : require('assets/images/user-icon-placeholder.png')
                return (
                  <li key={idx}>
                    <div className="avatar">
                      <img src={userAvatar} alt={userName}/>
                    </div>
                    <div className="desc">
                      <div>
                        <a role="button" title={userName}>
                          {userName}
                        </a>
                        {activity.message}
                      </div>
                      <div className="vote">
                        {/*using time ago*/}
                        <TimeAgo date={activity.created_at} minPeriod={60}/>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          {
            friendActivities.next_page_url &&
            !friendActivities.isShowBottomLoading ?
              <div className="see-more">
                <a
                  role="button"
                  title={localeHome.SEE_MORE_BUTTON}
                  onClick={this.loadMore}
                >
                  {localeHome.SEE_MORE_BUTTON}
                </a>
              </div> : null
          }
          {
            friendActivities.isShowBottomLoading ?
              <BottomLoading/> : null
          }
        </div>
      </div>
    )
  }
}

export default FriendActivities;
