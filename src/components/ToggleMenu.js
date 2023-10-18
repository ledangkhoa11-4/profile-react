import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  showMenu,
  hideMenu,
} from 'actions/ui';

let ToggleMenu = (props) => {
  let navIconClass = 'nav-icon2';
  if (props.isActive) {
    navIconClass += ' active';
    return (
      <a id="show-sidebar"
      className="btn btn-sm btn-dark  active"
      onClick={() => {
        if (props.isShowMenu) {
          props.hideMenu();
        } else {
          props.showMenu();
        }
      }}>
          <i className="icon-show glyphicon glyphicon-cog" aria-hidden="true"></i>
      </a>
    )
  }

  return (
    
    <div className={navIconClass} onClick={() => {
      if (props.isShowMenu) {
        props.hideMenu();
      } else {
        props.showMenu();
      }
      // trigger resize when show/hide menu to
      // Mansory work correctly
      setTimeout(() => {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 1000);
    }}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

ToggleMenu.propTypes = {
  isActive: PropTypes.bool,
  isShowMenu: PropTypes.bool.isRequired,
  hideMenu: PropTypes.func.isRequired,
  showMenu: PropTypes.func.isRequired,
}

ToggleMenu = connect(state => ({
  isShowMenu: state.ui.isShowMenu,
}), {
  showMenu,
  hideMenu,
})(ToggleMenu);

export default ToggleMenu;
