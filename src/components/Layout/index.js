import React from 'react';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Main from 'components/Main';
import Menu from 'components/Menu';
import Footer from 'components/Footer';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import './style.css';

let Layout = (props) => {
  const appClass = ['app'];
  const loadingClass = ['loading'];
  let hiddenMainOnMobile = '';
  if (props.isShowMenu) {
    hiddenMainOnMobile = 'hidden';
    appClass.push('body-showmenu');
  }

  if (props.isLoading) {
    loadingClass.push('in');
  }

  return (
    // 
    <div className={appClass.join(' ')}>
      <Menu
        title={props.title}
        innerBoxTitle={props.innerBoxTitle}
        mainContent={props.mainContent}
        menuIcon={props.menuIcon}
        hiddenMainOnMobile={hiddenMainOnMobile}
        />
      <section>
        <div className="container clear-padding-container">
          <div id="menusidebar" className="page-wrapper chiller-theme toggled">
            <Header indexActive={props.index}/>
            <Main
            title={props.title}
            innerBoxTitle={props.innerBoxTitle}
            mainContent={props.mainContent}
            menuIcon={props.menuIcon}
            hiddenMainOnMobile={hiddenMainOnMobile}
            /> 
          </div>
        </div>
      </section>
      <div className={loadingClass.join(' ')}>
        <div className="mini-loader-content">
          <div className="load-container">
            <div className="load-loader">
              <div className="spinnerBlock">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className='background-gbl'>
          <Footer/>
      </section>
      <Alert
        effect="bouncyflip"
        position="top-right"
        timeout={2500}
        stack={true}
      />
    </div>
  )
}

Layout.propTypes = {
  index: PropTypes.number,
  mainContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
    PropTypes.node,
    PropTypes.element,
  ]),
  menuIcon: PropTypes.string,
  title: PropTypes.string,
}

Layout = connect((state, ownProps) => {
  return {
    ...ownProps,
    isLoading: state.ui.isLoading,
    isShowMenu: state.ui.isShowMenu,
  };
})(Layout);

export default Layout;
