import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import TimeAgo from 'react-timeago';

class UserActivities extends Component {
  render() {
    if (!this.props.activities.length) {
      return null
    }
  
    return (
      <div className="detail">
        name yous
        <div className="head-detail my-activity">
          <div className="title">
            <span className="icon icon-activities"></span>
            <span className="text">
              {this.props.localeHome.MY_ACTIVITIES_TITLE}
            </span>
          </div>
        </div>
        <div className="content-detail">
          <ul className="list-noti">
            {
              map(this.props.activities, (activity, idx) => {
                return (
                  <li key={idx}>
                    <div className="desc">
                      <a role="button" title={ this.props.userInfo.name }>
                        { this.props.userInfo.name }
                      </a>
                      <span className="time">
                        <TimeAgo date={activity.created_at} minPeriod={60}/>
                      </span>
                      <p>
                        { activity.title }
                      </p>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

UserActivities.propTypes = {
  userInfo: PropTypes.object,
}

export default UserActivities;
