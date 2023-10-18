import React, { Component } from 'react';
import { requestAPI } from 'services/utils';
import { map } from 'lodash';
import { APIs } from 'services/config';
import Content from './Content';
import './index.css'

class ProfileDetail extends Component {
  state = {
    profiles: [],
    userProfiles: [],
  }

  componentDidMount() {
    Promise.all([
      this.getProfileData(),
      this.getUserProfile(),
    ]).then(res => {
      this.setState({
        profiles: res[0].data,
        userProfiles: res[1].data,
      });
    })
  }

  getProfileData() {
    return requestAPI({
      url: APIs.profile.getDetailProfile.url,
      method: APIs.profile.getDetailProfile.method,
    });
  }

  getUserProfile() {
    return requestAPI({
      url: APIs.profile.getUserProfile.url,
      method: APIs.profile.getUserProfile.method,
    });
  }

  updateUserProfile = (dataForm, callback) => {
    /*
    *   dataForm
    *  question_id: number
    *  answer_id: array number
    */

    requestAPI({
      url: APIs.profile.updateUserProfile.url,
      method: APIs.profile.updateUserProfile.method,
      dataForm,
    }).then(res => {
      if(res.success){
        const data = res.data;
        let hasExist = false;
        const newUserProfiles = map(this.state.userProfiles, u => {
          if (u.id === data.id) {
            hasExist = true;
            return Object.assign({}, u, data);
          }
          return u;
        });
  
        if (!hasExist) {
          newUserProfiles.push(data);
        }
  
        this.setState({
          userProfiles: newUserProfiles,
        }, () => {
          typeof callback === 'function' && callback();
        });
      }
    });
  }
  
  render() {
    if(this.props.user.complete_profile !== 1){
      return null;
    }
    return (
      <div className="box-main-setting" id="box-main-2">
          <div className="box-setting-profle-contain" >
            <p>{this.props.localeProfile.PROFILE_TITLE}</p>
            <div className="line-setting"></div>
            <div className="box box-detail-information">
              <div className="inner">
                <div className="content padding-more">
                  <div className="row">
                    <Content
                      localeProfile={this.props.localeProfile}
                      profiles={this.state.profiles}
                      userProfiles={this.state.userProfiles}
                      updateUserProfile={this.updateUserProfile}
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

export default ProfileDetail;
