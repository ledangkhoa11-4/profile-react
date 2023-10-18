import React, { PureComponent } from 'react'
import Alert from 'react-s-alert'

import './index.css'

const language = window.language || 'vi'
const cmtBtn = language === 'vi' ?
  'Bình luận' : 'Comment'
const placeholder = language === 'vi' ?
  'Nhập bình luận của bạn...' : 'Enter your comment...'
const alertMsg = language === 'vi' ?
  'Bình luận của bạn đang chờ admin duyệt.' :
  'Your comment is waiting for admin.'

class FakeComment extends PureComponent {
  state = {
    comment: ''
  }

  onChangeComment = (evt) => {
    this.setState({ comment: evt.target.value })
  }

  onSubmitComment = () => {
    if (!this.state.comment) {
      return;
    }

    this.setState({ comment: '' }, () => {
      Alert.success(alertMsg)
    })
  }

  render() {
    return (
      <div className="box-comment temporate-comment">
        <div className="inner">
          <div className="form">
            <textarea
              placeholder={placeholder}
              value={this.state.comment}
              onChange={this.onChangeComment}
            />
            <button
              type="button"
              className="btn"
              onClick={this.onSubmitComment}
            >
              {cmtBtn}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default FakeComment
