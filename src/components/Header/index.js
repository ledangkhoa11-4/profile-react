import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTER_PATH, BASE_URL } from 'services/config';
import './style.css';
import NavigatorItems from './NavigatorItems';
import ToggleMenu from 'components/ToggleMenu';
import { hideMenu } from 'actions/ui';
import Image from './image';
import { isEmpty } from 'lodash';
const localeNavigation = window.locale.Navigation;

function userLogout() {
  window.location.replace(ROUTER_PATH.LOGOUT)
}
function userprofile() {
  window.location.replace(ROUTER_PATH.USER_PROFILE)
}

let Header = (props) => {
  let {
    profile_count,
    profile_number_count,
    fullAvatar,
    gender,
  } = props.user;
  if(props.user.name !== null){
    profile_count ++;
  }
  if(gender !== null){
    profile_count ++;
  }
  if(props.user.birthday !== null){
    profile_count ++;
  }
  if(props.user.address !== null){
    profile_count ++;
  }
  if(props.user.email !== null){
    profile_count ++;
  }
  if(props.user.phone !== null){
    profile_count ++;
  }
  if(props.user.city !== null){
    profile_count ++;
  }
  const percent = Math.round((profile_count / (profile_number_count + 7)) * 100) || 0;
  var userAvatar = gender === 'Nam' ? BASE_URL + '/avtgbl.jpg' : BASE_URL + '/avtglm.jpg';
  if(typeof fullAvatar !== undefined && fullAvatar !== null && fullAvatar !== '' && typeof fullAvatar !== 'undefined'){
    userAvatar = fullAvatar;
  }
  const iconlogout = BASE_URL + "/assetsnew/img/logout.png";

  return (
    <div>
      <nav id="sidebar" className="sidebar-wrapper">
          <div className="sidebar-content">
            <div className="sidebar-brand">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="box-change-avatar-user">
                        <div className="avatar-user">
                            <img src={userAvatar} className="img-responsive" alt="avatar"/>
                        </div>
                          <Image
                            localeNavigation={localeNavigation}
                          />
                        </div>
                        <div className="show-menu">
                            <ToggleMenu/>
                        </div>
                        <div className="user-name">
                            <p>{ props.user.name }</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sidebar-menu">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="love-bookmark">
                        <ul className="list-inline">
                            <li>{props.user.quantityLike || 0 }<br/>
                              <i className="fa fa-heart" aria-hidden="true"></i>
                            </li>
                            <li>{props.user.quantitybookmark || 0 }<br/>
                              <i className="fa fa-bookmark" aria-hidden="true"></i>
                            </li>
                            <li>{ props.user.point || 0 }<br/><i className="fa fa-star" aria-hidden="true"></i>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <NavigatorItems
                          hideMenu={props.hideMenu}
                          indexActive={props.indexActive}
                          userInfo={props.user}
                        />
                        <div className="line-menu">
                        </div>
                        <div className="footer-menu">
                            <p>{localeNavigation.COMPLETETHEPROFILE}</p>
                            <div className="progress">
                                <div className="progress-bar progress-bar-success" role="progressbar"
                                    aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" style={{width: percent+'%'}}>
                                </div>
                            </div>
                            <a className="update-progress" onClick={userprofile}><span>{ localeNavigation.UPDATE }</span></a>
                            <a title={localeNavigation.LOGOUT} onClick={userLogout} className="btn-logout">
                                <img src={iconlogout}  alt="icon logout"/>
                                { localeNavigation.LOGOUT }
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </nav>
      <ToggleMenu isActive={true} />
    </div>
  );
}

Header.propTypes = {
  indexActive: PropTypes.number,
  toggleMenu: PropTypes.func,
}

Header.defaultProps = {
  indexActive: 0,
}

Header = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}), {
  hideMenu,
})(Header);

export default Header;
