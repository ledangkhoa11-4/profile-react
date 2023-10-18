import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ROUTER_PATH, BASE_URL } from 'services/config';
const localeCommon = window.locale.Common;
const enableInviteFriend = window.Config ? window.Config.enableInviteFriend : 1;
const navigationItems = [
  {
    path: ROUTER_PATH.USER_PROFILE,
    title: localeCommon.PROFILE_PAGE,
    iconContent: '/assetsnew/img/cog.png',
  },
  {
    path: ROUTER_PATH.REWARD,
    title: localeCommon.REWARD_PAGE,
    iconContent: '/assetsnew/img/iconqua.png',
  },
  {
    path: ROUTER_PATH.BOOKMARK,
    title: localeCommon.BOOKMARK_PAGE,
    iconContent: '/assetsnew/img/bookmark.png',
  },
  {
    path: ROUTER_PATH.PROJECT,
    title: localeCommon.PROJECT_PAGE,
    iconContent: '/assetsnew/img/project.png',
  },
  {
    path: ROUTER_PATH.CHANGEPASSWORD,
    title: localeCommon.CHANGEPASSWORD,
    iconContent: '/assetsnew/img/lock.png',
  },
];
if(enableInviteFriend){
  navigationItems.push({
    path: ROUTER_PATH.FRIEND,
    title: localeCommon.FRIEND_PAGE,
    iconContent: '/assetsnew/img/add-user.png',
  })
}
const NavigatorItems = (props) => {
  return (
    <ul className="list-menu">
      {
         navigationItems.map((item, idx) => {
          const imgmenu = BASE_URL + item.iconContent;
           return(
            <li key={idx}
                className={window.location.href.indexOf(item.path) > -1 ? 'active' : undefined}
            >
            <Link className="menu-item" title={item.title} to={item.path} onClick={(e) => {
                  setTimeout(() => {
                    props.hideMenu()
                  }, 300)
                }}>
                  <img src={imgmenu}></img>
                  <span className="text">{ item.title }</span>
              </Link>
            </li>
           )
         })
      }
    </ul>
  )
};

NavigatorItems.propTypes = {
  indexActive: PropTypes.number,
  hideMenu: PropTypes.func,
};

NavigatorItems.defaultProps = {
  indexActive: 0,
};

export default NavigatorItems;
