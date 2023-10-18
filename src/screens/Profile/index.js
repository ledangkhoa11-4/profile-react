import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/Layout';
import ShortInfo from './ShortInfo';
import Account from './Account';
import Detail from './Detail';
import QuickProfile from './QuickProfile';
import './AccountPassword.style.css';
import 'react-select/dist/react-select.css';

const localeProfile = window.locale.Profile,
      localeCommon = window.locale.Common;

class ProfileUserContent extends Component {

  render() {
    return (
      <div className="div-box">
        <ShortInfo
          localeProfile={localeProfile}
          localeCommon={localeCommon}
        />
        <Account
          localeProfile={localeProfile}
          localeCommon={localeCommon}
        />
        <QuickProfile
          user={this.props.user}
          localeProfile={localeProfile}
        />
        <Detail
          user={this.props.user}
          localeProfile={localeProfile}
        />
      </div>
    )
  }
}

ProfileUserContent = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user,
}))(ProfileUserContent)

const Profile = () => (
  <Layout
    index={1}
    menuIcon="account_box"
    mainContent={ProfileUserContent}
    title="User Detail"
  />
);

export default Profile;
