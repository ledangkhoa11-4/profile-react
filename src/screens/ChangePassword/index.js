import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from 'components/Layout';
import Password from './Password';

const localeProfile = window.locale.Profile,
      localeCommon = window.locale.Common;
      
class ChangePasswordContent extends Component {
    render(){
        return (
            <div className="div-box">
                <Password
                localeProfile={localeProfile}
                localeCommon={localeCommon}
                />
            </div>
        )
    }
}
ChangePasswordContent = connect((state, ownProps) => ({
...ownProps,
user: state.user,
}))(ChangePasswordContent)

const ChangePassword = () => (
    <Layout
    index={1}
    menuIcon="account_box"
    mainContent={ChangePasswordContent}
    title="Change Password"
    />
);

export default ChangePassword;