import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import Layout from 'components/Layout';
import Notifications from './Notifications';
import { updatePageTitle } from 'actions/ui';
import { APIs } from 'services/config';
import { isValidURL, mapArrayToObject, onScroll, requestAPI } from 'services/utils';

const localeCommon = window.locale.Common;
const localeNotification = window.locale.Notification;

class NotificationContent extends Component {
  state = {
    notifications: {},
    next_page_url: undefined,
    isBottomLoading: false,
  }

  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    this.props.updatePageTitle(localeCommon.NOTIFICATION_PAGE)
  }

  componentDidMount() {
    this.getNotifications()
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  
  getNotifications(notificationURL, isShowPageLoading = true) {
    const { getNotifications } = APIs.notification;
    requestAPI({
      url: notificationURL || getNotifications.url,
      method: getNotifications.method,
      isShowPageLoading,
    }).then(res => {
      if (res.success) {
        const { data } = res;
        const notifications = mapArrayToObject(data.data)
        
        this.setState({
          notifications: {...this.state.notifications, ...notifications},
          next_page_url: data.next_page_url,
          isBottomLoading: false,
        })
      }
    })
  }

  handleScroll = async () => {
    await onScroll()
    
    if (this.state.isBottomLoading) return;

    if (this.state.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.getNotifications(this.state.next_page_url, false);
      });
    }
  }

  onClickNotification = (notification, idNotification) => {
    const { href, link, type } = notification;  
    if (!isValidURL(href)) {
      return Alert.error(localeNotification.ERROR_WRONG_URL)
    }
    const { host } = window.location;
    if (href.indexOf(host) > -1) {
      window.open(link);
    } else {
      window.open(href, '_blank');
      Alert.success(localeNotification.SUCCESS_WRONG_URL);
    }
  }

  render() {
    return (
      <Notifications
        notifications={this.state.notifications}
        isBottomLoading={this.state.isBottomLoading}
        onClickNotification={this.onClickNotification}
      />
    );
  }
}

NotificationContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(NotificationContent)

const Notification = () => {
  return (
    <Layout
      index={9}
      title="Notification"
      mainContent={withRouter(NotificationContent)}
      menuIcon="notifications_none"
    />
  )
}

export default Notification;
