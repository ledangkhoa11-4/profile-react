import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../ShortInfo.style.css';
import {
  uploadAvatar,
} from 'actions/requestAPIsAction';
import { validateImage } from 'services/utils';

class Image extends Component {
  onChangeAvatar = (e) => {
    const fileUpload = e.target;
    if (!validateImage(fileUpload)) {
      return;
    }
    // upload image
    const formData = new FormData();
    formData.append('avatar', fileUpload.files[0]);
    this.props.uploadAvatar(formData)
  }

  render() {
    const {
      localeCommon,
      user,
    } = this.props;
    const userAvatar = user.fullAvatar ||
            require('assets/images/user-icon-placeholder.png');
    return (    
        <div className="avatar" ref={(node) => {
        if (node) {
            this.avatarWrapper = node;
        }
        }}>
            <div className="box-img-setting">
                <img src={userAvatar} alt="avatar"/>
            </div>
            <p>Thay đổi ảnh đại diện ( tối đa 2Mb )</p>
            <a
                role="button"
                title={localeCommon.EDIT}
                className="edit"
                onClick={() => {
                this.inputAvatar.click()
                }}
            >
                Chọn hình ảnh tải lên
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
