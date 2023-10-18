import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ShortInfo.style.css';
import {
  uploadAvatar,
} from 'actions/requestAPIsAction';
import { validateImage } from 'services/utils';
import { ROUTER_PATH, APIs } from 'services/config';
import { requestAPI } from 'services/utils';


class ShortInfo extends Component {
  state = {
    isShowEdittingAvatar: false,
    countBookmarked: 0,
    totalComment: 0,
  }
  
  componentDidMount() {
    this.getUserBookmarked()
    this.getUserComment()
  }
  getUserBookmarked() {
    requestAPI({
      url: APIs.profile.getListBookmarks.url,
      method: APIs.profile.getListBookmarks.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          countBookmarked: res.data.length,
        })
      }
    })
  }
  onMouseEnterAvatar = () => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({
        isShowEdittingAvatar: true,
      })
    }, 150)
  }

  onMouseLeaveAvatar = () => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setState({
        isShowEdittingAvatar: false,
      })
    }, 150)
  }
  
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
  getUserComment() {
    requestAPI({
      url: APIs.comment.getListComment.url,
      method: APIs.comment.getListComment.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          totalComment: res.data,
        })
      }
    })
  }
  render() {
    const {
      localeProfile,
      user,
    } = this.props;

    return (
        <div className="box-main-setting" id="box-main">
          <div className="box-setting-profle-head">
            <p>{localeProfile.INFORMATION}</p>
            <div className="line-setting"></div>
            <div className="row row-main">
                  <ul className="list-inline list-information">
                      <li>
                        <Link to={ROUTER_PATH.SURVEY}>
                            <h2>{user.survey_vote_count}</h2>
                            <span>{localeProfile.VOTE_SURVEY_TEXT}</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={ROUTER_PATH.POINT_HISTORY}>
                          <h2>{ user.point || 0 }</h2>
                          <span>{localeProfile.POINT}</span>
                        </Link>
                      </li>
                      <li>
                          <h2>{this.state.countBookmarked}</h2>
                          <span>{localeProfile.BOOKMARK}</span>
                      </li>
                      <li>
                        <Link to={ROUTER_PATH.PROJECT}>
                          <h2>{user.poll_count + user.survey_count}</h2>
                          <span>{localeProfile.PROJECT}</span>
                        </Link>
                      </li>
                      <li>
                          <h2>{this.state.totalComment}</h2>
                          <span>{localeProfile.COMMENT}</span>
                      </li>
                  </ul>
              </div>
          </div>
    </div>
    )
  }
}

ShortInfo = connect((state, ownProps) => ({
  ...ownProps,
  user: state.user
}), {
  uploadAvatar,
})(ShortInfo);

export default ShortInfo;
