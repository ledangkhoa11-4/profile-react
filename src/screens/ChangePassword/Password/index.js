import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { requestAPI } from 'services/utils';
import { APIs } from 'services/config';
import { INPUT_NAME } from 'services/constant';
import PasswordForm from './Form';
import Alert from 'react-s-alert';
import { forEach } from 'lodash';

const { PASSWORD_FORM } = INPUT_NAME;

class Password extends Component {
  onSubmitForm = (values, e) => {
    const passwordData = {
      now_password: values[PASSWORD_FORM.CURRENT_PASS],
      password: values[PASSWORD_FORM.NEW_PASS],
      password_confirmation: values[PASSWORD_FORM.CONFIRM_PASS],
    };
    requestAPI({
      url: APIs.profile.updateUserPassword.url,
      method: APIs.profile.updateUserPassword.method,
      dataForm: passwordData,
    }).then(res => {
      if(res.success){
        Alert.success(res.message)
        this.props.reset('password');
      }
    }).catch(error => {
      if(typeof error.message === 'object'){
        forEach(error.message, msg => {
          msg[0] && Alert.error(msg[0]);
        })
      }else{
        Alert.error(error.message)
      }
    });
  }
  
  render() {
    return (
        <div className="box-main-setting magin-bottom-50" id="box-main-3">
            <div className="box-setting-profle-contain">
                <p>{this.props.localeProfile.PASSWORD_TITLE}</p>
                <div className="line-setting"></div>
                <div  className="form-setting">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="setting-right">
                                <PasswordForm
                                 localeCommon={this.props.localeCommon}
                                 localeProfile={this.props.localeProfile}
                                 onSubmit={this.onSubmitForm}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

Password = connect(null, {
  reset,
})(Password);

export default Password;
