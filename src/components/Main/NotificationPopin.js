import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import BottomLoading from '../BottomLoading';
import { 
  removeScriptTagInString,
  formatDate 
} from 'services/utils';
import { ROUTER_PATH } from 'services/config';
import { isEmpty} from 'lodash';
import { NOTIFICATION_CATEGORY } from 'services/constant';

const localeCommon = window.locale.Common

const renderNotificationMessages = (type, note) => {
  switch (type) {
    case NOTIFICATION_CATEGORY.VOTE_POLL:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.Participated_in_new_poll}} />;
    case NOTIFICATION_CATEGORY.VOTE_SURVEY:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.Participated_in_new_survey}} />;
    case NOTIFICATION_CATEGORY.SURVEY:
      if(note != null && typeof note.gift !== 'undefined' && note.gift != null){
        return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_create_survey_has_gift}} />;
      }else if (note != null && note.point > 0){
        return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_create_survey_has_star.replace(':star', note.point)}} />;
      }
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_create_survey}} />;
    case NOTIFICATION_CATEGORY.POLL:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_create_poll}} />;
    case NOTIFICATION_CATEGORY.EXPRIEDPOINTS_180:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_180_days.replace(':star', note.point)}} />;
    case NOTIFICATION_CATEGORY.EXPRIEDPOINTS_150:
      if(note.point < 40){
        return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_150_days_less_than_40_star.replace(':star', note.point).replace(':time', formatDate(note.time))}} />;
      }
      else if(note.point >= 40){
        return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_150_days_more_than_40_star.replace(':star', note.point).replace(':time', formatDate(note.time))}} />;
      }
      break;
    case NOTIFICATION_CATEGORY.ADDPOINT:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_addpoint.replace(':star', note.point).replace(':name', note.poll_name)}} />;
    case NOTIFICATION_CATEGORY.ADDPOINT_SURVEY:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_addpoint_survey.replace(':star', note.point).replace(':name', '"'+note.survey_name+'"')}} />;
    case NOTIFICATION_CATEGORY.ADDPOINT_POLL:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_addpoint_poll.replace(':star', note.point).replace(':name', '"'+note.poll_name+'"')}} />;
    case NOTIFICATION_CATEGORY.ADDPOINT_SHARE:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_addpoint_share.replace(':star', note.point).replace(':name', '"'+note.name_article+'"')}} />;
    case NOTIFICATION_CATEGORY.ADDPOINT_INVITE:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_addpoint_invite.replace(':star', note.point)}} />;
    case NOTIFICATION_CATEGORY.MINUSPOINT:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_minuspoint.replace(':star', note.point)}} />;
    case NOTIFICATION_CATEGORY.COMMENT:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_comment}} />;
    case NOTIFICATION_CATEGORY.APPROVED_COMMENT:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_comment_approved}} />;
    case NOTIFICATION_CATEGORY.INFOMATION:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_information.replace(':star', note.point)}} />;
    case NOTIFICATION_CATEGORY.REWARD:
      return <span style={{fontWeight: 'bold'}} dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_reward.replace(':star', note.point).replace(':value', note.value)}} />;
    case NOTIFICATION_CATEGORY.FRIEND:
      return <span dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_friend}} />;
    default:
      return <span dangerouslySetInnerHTML={{__html: localeCommon.message_notifi_default}} />;
  }
  
              
}
class NotificationPopin extends Component {
  componentDidMount() {
    if (!this.props.notifications.length) {
      return this.props.getNotification()
    }
  }
  renderNotifications() {
    if (!this.props.notifications.length) {
      return <p>{ localeCommon.NO_DATA }</p>
    }
  
    return this.props.notifications.map((notification, idx) => {
      const { sender } = notification;
      const userName = sender ? sender.name : null;
      const userAvatar = sender ? sender.fullAvatar : require('assets/images/user-icon-placeholder.png')
      let itemClass = (!notification.link && notification.read_count) ?
                          'item normal-cursor' : 'item';
      if (notification.read_count === 0) {
        itemClass = `${itemClass} active`
      }
      return (
        <a
          key={idx}
          role="button"
          title="Notification"
          className={itemClass}
          onClick={() => {
            this.props.onClickNotification(notification)
          }}
        >
          <div className="desc">
            <p>
              { notification.type == 'comment' ? <strong>{ userName }</strong>: ''} 
              { renderNotificationMessages(notification.type, notification.note) }
              
            </p>
            <div className="time">
              <TimeAgo date={notification.created_at} minPeriod={60} />
            </div>
          </div>
        </a>
      )
    })
  }
  render() {
    const {
      isLoadingNotification,
    } = this.props;
  
    return (
      <div className="notification-popin">
        <div className="inner">
          {
            isLoadingNotification ?
             <BottomLoading/> : this.renderNotifications()
          }
          {
            this.props.notifications.length ?
              <Link
                title="Notification"
                className="item see-all"
                to={ROUTER_PATH.NOTIFICATION}
              >
                <span>{ localeCommon.SEE_ALL }</span>
              </Link> : null
          }
        </div>
      </div>
    )
  }
}

export default NotificationPopin
