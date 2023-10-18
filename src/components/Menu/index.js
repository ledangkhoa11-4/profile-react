import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { cloneDeep, map } from 'lodash';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NotificationPopin from '../Main/NotificationPopin';
import { isMobile } from 'services/utils';
import { APIs, BASE_URL } from 'services/config';
import { isValidURL, requestAPI } from 'services/utils';
import LanguageSelect from '../Main/LanguageSelect';
import { ROUTER_PATH } from 'services/config';
import '../Main/style.css';

const localeNavigation = window.locale.Navigation;
const localeNotification = window.locale.Notification;
const localeArticle = window.locale.Article;
const localeCommon = window.locale.Common;
const enableInviteFriend = window.Config ? window.Config.enableInviteFriend : 1;
function userLogout() {
    window.location.replace(ROUTER_PATH.LOGOUT)
}
class Menu extends Component {
  constructor() {
    super();
    this.state = {
      hiddenMainOnMobile: '',
      isShowNotificationPopin: false,
      notifications: [],
      isLoadingNotification: false,
      value: '',
      search: '',
      listArticleSearch: [],
      htmlListArticleSearch: [],
      totalnotifications: 0,
      isShowMenu: true,
      menu: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onSearchArticle = (e) => {
    e.preventDefault();
    if (!this.state.value) {
      return;
    }
    const titlesearch = this.state.value.replace(/[&\/\\@^^#,+()$~%.'":*?<>{}]/g, '');
    const urlSearchTitle = APIs.article.searTitleArticle.url.replace(':search',titlesearch);
    window.location.assign(urlSearchTitle);
  }
  handleSubmit(event) {
    event.preventDefault();
  }
  handleChange(event) {
    this.setState({value: event.target.value});
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
    this.toggleNotification(null, true);
  }
  toggleNotification = (e, isHide = false) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
      this.markAsRead();
    }
    this.setState({
      isShowNotificationPopin: isHide ? !isHide : !this.state.isShowNotificationPopin,
    })
  }
  markAsRead = () => {
    const { markRead } = APIs.notification;
    requestAPI({
      url: markRead.url,
      method: markRead.method,
      isShowPageLoading: false,
    }).then(res => {
      if(res.success){
        this.totalNotification();
      }
    })
  }
  onClickNotification = (notification) => {
    const { href, link, id, type } = notification; 
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
  componentDidMount(){
    this.totalNotification();
    this.getNotification();
    this.getDataListCategoriesMenu();
  }
  getDataListCategoriesMenu() {
    requestAPI({
      ...APIs.menu,
      isShowPageLoading: false,
    }).then((res) => {
      if (res.success) {
        this.setState({
          menu: res.data,
        });
      }
    });
  }
  totalNotification(){
    requestAPI({
      url: APIs.notification.getQuantityNotifications.url,
      method: APIs.notification.getQuantityNotifications.method,
      isShowPageLoading: false,
    }).then(res => {
      if (res.success) {
        this.setState({
          totalnotifications: res.data,
        })
      }
    })
  }
  showNaBar(){
    if(this.state.isShowMenu){
      var show  = document.getElementsByClassName('side-menu-overlay');
      show[0].style.display = 'block';
      document.getElementById('navbar').style.display = "none";
      var body = document.getElementById('body');
      body.classList.add('overflow-hidden');
      document.getElementById("side-menu").style.display = "block";
      setTimeout(function() {    
        body.classList.add('side-menu-visible');
        
      }, 50);
      this.setState({
        isShowMenu: false
      })
    }
  }
  hideMenu(){
    if(this.state.isShowMenu === false){
      var show  = document.getElementsByClassName('side-menu-overlay');
      show[0].style.display = 'none';
      var body = document.getElementById('body');
      body.classList.remove('side-menu-visible');
      setTimeout(function() {
        document.getElementById("side-menu").style.display = "none";
        body.classList.remove('overflow-hidden');
      }, 400);
      this.setState({
        isShowMenu: true
      })
    }
    
  }
  renderMenu() {
    return (
      !this.state.isShowMenu &&
      !!this.state.menu.length && (
        <div id="menu-mobile">
          <div className="">
            <div className="lv-1 ">
              <a className="sunTitleSmall active" href={ROUTER_PATH.HOME} title="Trang chủ">
                {localeNavigation.HOME}
              </a>
            </div>
            <div
              className="panel-group"
              id="accordion2"
              role="tablist"
              aria-multiselectable="true"
            >
              <div className="panel lv-1">
                <a
                  className="collapse-menu collapsed sunTitleSmall"
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapse1a"
                  aria-expanded="false"
                  aria-controls="collapse1a"
                >
                  {localeNavigation.MOMANDBABY}
                </a>

                <div
                  id="collapse1a"
                  className="panel-collapse collapse"
                  role="tabpanel"
                >
                  <div className="panel-body">
                    <div className="">
                      <div
                        className="panel-group"
                        id="accordion3"
                        role="tablist"
                        aria-multiselectable="true"
                      >
                        {this.state.menu &&
                          this.state.menu.map((value, key) => {
                            if (value.children.length) {
                              return (
                                <div key={key}>
                                  <div className="lv-2 titleSubmenuLv">
                                    <a
                                      className="collapse-menu collapsed"
                                      role="button"
                                      data-toggle="collapse"
                                      data-parent="#accordion3"
                                      href={`#collapse${key}aa`}
                                      aria-expanded="false"
                                      aria-controls={`#collapse${key}aa`}
                                    >
                                      {value.name}
                                    </a>
                                  </div>
                                  <div
                                    id={`collapse${key}aa`}
                                    className="panel-collapse collapse"
                                    role="tabpanel"
                                  >
                                    <div className="panel-body">
                                      {value.children.map((data, key) => {
                                        return (
                                          <div className="lv-3 titleSubmenuLv" key={key} >
                                            <a href={ROUTER_PATH.MOMANDBABY+"/?category="+ data.id}>{data.name}</a>
                                            
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="panel " key={key}>
                                  <a
                                    className="lv-2 titleSubmenuLv"
                                    data-parent="#accordion3"
                                    href={ROUTER_PATH.MOMANDBABY+"/?category="+ value.id}
                                  >
                                    {value.name}
                                  </a>
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel lv-1">
                <a
                  className="collapse-menu collapsed sunTitleSmall"
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion2"
                  href="#collapse2aaa1"
                  aria-expanded="false"
                  aria-controls="collapse2aaa1"
                >
                  {localeNavigation.SURVEY}
                </a>
                <div
                  id="collapse2aaa1"
                  className="panel-collapse collapse"
                  role="tabpanel"
                >
                  <div className="panel-body">
                    <div className="lv-2 titleSubmenuLv"><a href={ROUTER_PATH.SURVEYSUB}>{localeNavigation.SURVEYSUB}</a></div>
                    <div className="lv-2 titleSubmenuLv"><a href={ROUTER_PATH.SHORTQUESTION}>{localeNavigation.SHORTQUESTION}</a></div>
                  </div>
                </div>
              </div>
              <div className="panel lv-1">
                <a
                  href={ROUTER_PATH.QUESTIONANDANSWER}
                  className="collapsed sunTitleSmall"
                  role="button"
                  data-parent="#accordion2"
                >
                  {localeNavigation.QUESTIONANDANSWER}
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
  render() {
    var userAvatar = this.props.user.gender === 'Nam' ? BASE_URL + '/avtgbl.jpg' : BASE_URL + '/avtglm.jpg';
    if(typeof this.props.user.fullAvatar !== undefined && this.props.user.fullAvatar !== null && this.props.user.fullAvatar !== '' && typeof this.props.user.fullAvatar !== 'undefined'){
      userAvatar = this.props.user.fullAvatar;
    }
    const logo = BASE_URL + "/assetsnew/img/logo.png";
    const classAdd = this.state.classAdd + ' section-menu bg-pink-color';
    let amountNotifi = (this.state.totalnotifications === 0) ?
                          'amount-notifi hide' : 'amount-notifi';
    return (
      <section className={classAdd}>
        <div className="container clear-padding-container bg-pink-color">
          <div className="row">
              <div className="col-md-12 col-xs-12 bg-pink-color">
                <div className="head-desktop">
                  <div className="logo">
                  <a href={ROUTER_PATH.HOME} title="">
                    <img src={logo} alt=""/>
                  </a>
                  </div>
                  <div className="menu">
                    <ul className="list-inline">
                      <li>
                        <a href={ROUTER_PATH.HOME} title="Trang chủ">
                          {localeNavigation.HOME}
                        </a>
                      </li>
                      <li class="dropdown">
                        <a title="" class="dropdown-toggle" data-toggle="dropdown">
                          {localeNavigation.MOMANDBABY}
                        </a>
                        {this.state.menu && (
                          <ul id="submenu-header" class="dropdown-menu menu-dropdown clearfix" role="menu" >
                            
                          <li>123</li>
                          </ul>
                        )}
                      </li>
                      <li class="dropdown">
                        <a title="" class="dropdown-toggle" data-toggle="dropdown">
                          {localeNavigation.SURVEY}
                        </a>
                          <ul id="submenu-header" class="dropdown-menu menu-dropdown clearfix" role="menu" >
                            <div className="list-submenu">
                              <div className="panel">
                                <a
                                  href={ROUTER_PATH.SURVEYSUB}
                                  className="lv-1"
                                 
                                >
                                  {localeNavigation.SURVEYSUB}
                                </a>
                              </div>
                              <div className="panel">
                                <a
                                  href={ROUTER_PATH.SHORTQUESTION}
                                  className="lv-1"
                                 
                                >
                                  {localeNavigation.SHORTQUESTION}
                                </a>
                              </div>
                            </div>
                          </ul>
                      </li>
                      <li>
                        <a href={ROUTER_PATH.QUESTIONANDANSWER} title="">
                          {localeNavigation.QUESTIONANDANSWER}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <ul className="list-inline pull-right ul-user-login">
                        <li className="li-notifi">
                            <a  title="notification" onClick={this.toggleNotification} href="" className="a-bell">
                                <i className="fa fa-bell-o" aria-hidden="true"></i>
                                <div 
                                  className={amountNotifi}
                                >
                                    {this.state.totalnotifications > 100 ? '99+' : this.state.totalnotifications} 
                                </div>
                            </a>
                            <div className="box-title">
                                    {this.state.isShowNotificationPopin ?
                                    <NotificationPopin
                                        getNotification={this.getNotification}
                                        onClickNotification={this.onClickNotification}
                                        {...this.state}
                                    /> : null}
                            </div>
                        </li>
                        <li>
                            <div className="box-img-avartar dropdown">
                                <a data-toggle="dropdown">
                                    <img src={userAvatar} className="img-responsive img-circle" alt="Image"/>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a href={ROUTER_PATH.USER_PROFILE} title={localeCommon.PROFILE_PAGE}>{localeCommon.PROFILE_PAGE}</a></li>
                                    <li><a href={ROUTER_PATH.REWARD} title={localeCommon.REWARD_PAGE}>{localeCommon.REWARD_PAGE}<i className="fa fa-gift" aria-hidden="true"></i></a></li>
                                    <li><a href={ROUTER_PATH.BOOKMARK} title={localeCommon.BOOKMARK_PAGE}>{localeCommon.BOOKMARK_PAGE}</a></li>
                                    <li><a href={ROUTER_PATH.PROJECT} title={localeCommon.PROJECT_PAGE}>{localeCommon.PROJECT_PAGE}</a></li>
                                    {enableInviteFriend ?
                                      <li><a href={ROUTER_PATH.FRIEND} title={localeCommon.FRIEND_PAGE}>{localeCommon.FRIEND_PAGE}</a></li>
                                      :
                                      null
                                    }
                                    <li><a onClick={userLogout} title={localeNavigation.LOGOUT}>{localeNavigation.LOGOUT}</a></li>
                                </ul>
                            </div>
                        </li>
                        <li>
                          <LanguageSelect/>
                        </li>
                  </ul>
                </div>
                <div className="head-mobile">
                    <div className="logo"> 
                        <a href={ROUTER_PATH.HOME} title=""><img src={logo} alt=""/></a> 
                        <div className="select-language-mobile">
                          <LanguageSelect/>
                        </div>
                        {/* <div className="notifimobile li-notifi">
                          <a  title="notification" onClick={this.toggleNotification} href="" className="a-bell">
                              <i className="fa fa-bell-o" aria-hidden="true"></i>
                              <div className="amount-notifi">
                                {this.state.totalnotifications > 100 ? '99+' : this.state.totalnotifications} 
                              </div>
                          </a>
                          <div className="box-title">
                                  {this.state.isShowNotificationPopin ?
                                  <NotificationPopin
                                      getNotification={this.getNotification}
                                      onClickNotification={this.onClickNotification}
                                      {...this.state}
                                  /> : null}
                          </div>
                        </div> */}
                        <div className='profile-mobile ul-user-login'>
                        <div className="box-img-avartar dropdown">
                                <a data-toggle="dropdown">
                                    <img src={userAvatar} className="img-responsive img-circle" alt="Image"/>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a href={ROUTER_PATH.USER_PROFILE} title={localeCommon.PROFILE_PAGE}>{localeCommon.PROFILE_PAGE}</a></li>
                                    <li><a href={ROUTER_PATH.REWARD} title={localeCommon.REWARD_PAGE}>{localeCommon.REWARD_PAGE}<i className="fa fa-gift" aria-hidden="true"></i></a></li>
                                    <li><a href={ROUTER_PATH.BOOKMARK} title={localeCommon.BOOKMARK_PAGE}>{localeCommon.BOOKMARK_PAGE}</a></li>
                                    <li><a href={ROUTER_PATH.PROJECT} title={localeCommon.PROJECT_PAGE}>{localeCommon.PROJECT_PAGE}</a></li>
                                    {enableInviteFriend ?
                                      <li><a href={ROUTER_PATH.FRIEND} title={localeCommon.FRIEND_PAGE}>{localeCommon.FRIEND_PAGE}</a></li>
                                      :
                                      null
                                    }
                                    <li><a onClick={userLogout} title={localeNavigation.LOGOUT}>{localeNavigation.LOGOUT}</a></li>
                                </ul>
                            </div>
                        </div>
                      
                    </div>
                    <div className="navbar-header">
                        <button type="button" onClick={this.showNaBar.bind(this)} className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span
                                className="sr-only">Toggle navigation</span>
                                <i className="fa fa-bars" aria-hidden="true"></i> 
                        </button>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        
                    </div>
                </div>
              </div>
          </div>
        </div>
        <div className="side-menu-overlay" onClick={this.hideMenu.bind(this)}></div>
        <div id="side-menu">
          <div className="contents">
            <div><a href={ROUTER_PATH.HOME} title=""><img src={logo} alt=""/></a> </div>
            {this.renderMenu()}
            <ul className="nav navbar-nav navbar-right list-inline user-moblie-login">
                <li>
                    <div className="box-search dropdown  search-ipad">
                        <a id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false"> <i className="fa fa-search" aria-hidden="true"></i> </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <div className="span12">
                                <form onSubmit={this.onSearchArticle} className="custom-search-form form-search form-horizontal">
                                    <div className="input-append span12">
                                        <input type="text" className="search-query"
                                        name="search" autoComplete="off" value={this.state.value}
                                          onChange={this.handleChange}  placeholder={localeArticle.SEARCH}/>
                                    </div>
                                </form>
                            </div>
                            {/* <div className="list-group box-found">
                              {this.state.htmlListArticleSearch}
                            </div> */}
                        </div>
                    </div>
                </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

Menu.propTypes = {
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

Menu = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
  pageContent: state.pageContent,
}))(Menu)

export default withRouter(Menu);