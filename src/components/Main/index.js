import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { cloneDeep, map } from 'lodash';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './style.css';
import { isMobile } from 'services/utils';
import { APIs } from 'services/config';
import { isValidURL, requestAPI } from 'services/utils';

const localeNotification = window.locale.Notification;

class Main extends Component {
  constructor() {
    super();
    this.state = {
      hiddenMainOnMobile: '',
      isShowNotificationPopin: false,
      notifications: [],
      isLoadingNotification: false,
    };
  }
  componentWillMount() {
    window.addEventListener('click', this.hideNotification)
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.hideNotification)
  }
  componentWillReceiveProps(nextProps) {
    if (!isMobile()) {
      return;
    }
    const DURATION = nextProps.hiddenMainOnMobile ? 900 : 0;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.setState({
        hiddenMainOnMobile: nextProps.hiddenMainOnMobile,
      });
    }, DURATION);
  }
  renderTitle() {
    return (
      <div className="title ">
        <span className="material-icons">{this.props.menuIcon}</span>
        <h2>{this.props.pageContent.pageTitle}</h2>
      </div>
    )
  }
  getNotification = async () => {
    await this.setState({
      isLoadingNotification: true
    })

    requestAPI({
      url: APIs.notification.getNotifications.url,
      method: APIs.notification.getNotifications.method,
      isShowPageLoading: false,
    }).then(res => {
      if (res.success) {
        this.setState({
          notifications: res.data.data,
          isLoadingNotification: false
        })
      }
    }).catch(error => {
      this.setState({
        isLoadingNotification: false,
      })
    })
  }
  hideNotification = () => {
    this.toggleNotification(null, true)
  }
  toggleNotification = (e, isHide = false) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.setState({
      isShowNotificationPopin: isHide ? !isHide : !this.state.isShowNotificationPopin,
    })
  }
  markAsRead(notification, idNotification) {
    if (notification.read_count === 0) {
      const cloneNotification = cloneDeep(notification)
      cloneNotification.read_count = 1;
      let cloneNotifications = cloneDeep(this.state.notifications)
      cloneNotifications = map(cloneNotifications, item => {
        if (item.id === notification.id) {
          item = cloneNotification
        }
        return item
      })

      const { markRead } = APIs.notification;
      requestAPI({
        url: markRead.url,
        method: markRead.method,
        dataForm: {
          notifications_id: notification.id,
        },
        isShowPageLoading: false,
      })
      this.setState({ notifications: cloneNotifications })
    }
  }
  onClickNotification = (notification) => {
    const { href, link, id, type } = notification;  

    if (!href) {
      return this.markAsRead(notification, id);
    }

    if(type === 'comment'){
      this.markAsRead(notification, id)
      window.open(link);
      return Alert.success(localeNotification.SUCCESS_WRONG_URL);
    }else{
      if(type === 'poll' || type === 'survey'){
        this.markAsRead(notification, id)
        window.open(href);
        return Alert.success(localeNotification.SUCCESS_WRONG_URL);
      }
    }
    if (!isValidURL(href)) {
      return Alert.error(localeNotification.ERROR_WRONG_URL)
    }

    this.markAsRead(notification, id)
    const { host } = window.location;
    if (href.indexOf(host) > -1) {
      this.props.history.push(link)
    } else {
      window.open(href, '_blank')
    }
  }
  render() {
    return (
      <main className="page-content page-setting">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
              { 
                React.createElement(this.props.mainContent, this.props)
              }
          </div>
        </div>
      </main>
    );
  }
}

Main.propTypes = {
  hiddenMainOnMobile: PropTypes.string,
  mainContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.node,
    PropTypes.element,
  ]),
  menuIcon: PropTypes.string,
  title: PropTypes.string,
  toggleMenu: PropTypes.func,
}

Main = connect((state, ownProps) => ({
  ...ownProps,
  pageContent: state.pageContent,
}))(Main)

export default withRouter(Main);
