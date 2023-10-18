import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  uploadAvatar,
} from 'actions/requestAPIsAction';
import { validateImage } from 'services/utils';
import { BASE_URL } from 'services/config';
class Image extends Component {
  onChangeAvatar = (e) => {
    const fileUpload = e.target;
    if (!validateImage(fileUpload)) {
      return;
    }
    // upload image
    const formData = new FormData();
    formData.append('avatar', fileUpload.files[0]);
    this.props.uploadAvatar(formData);
  }

  render() {
    const {
      localeNavigation,
      user,
    } = this.props;
    const iconImage = BASE_URL + '/assetsnew/img/image.png';
    return (
        <div className="avatar" 
          ref={(node) => {
            if (node) {
                this.avatarWrapper = node;
            }
          }}>
            <a
                role="button"
                title={localeNavigation.CHANGEAVATAR}
                className="edit"
                onClick={() => {
                this.inputAvatar.click()
                }}
            >
                <img src={iconImage} className="" alt="iconImage"/>
            </a>
            <input
                ref={(node) => {
                if (node) {
                    this.inputAvatar = node;
                }
                }}
                type="file"
                name="input-avatar"
                className="hidden"
                onChange={this.onChangeAvatar}
            />
        </div>
    )
  }
}

Image = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user
}), {
  uploadAvatar,
})(Image);

export default Image;
