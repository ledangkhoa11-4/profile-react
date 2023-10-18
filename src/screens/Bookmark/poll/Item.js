import React, { Component } from 'react';
import { APIs, BASE_URL } from 'services/config';
import { requestAPI } from 'services/utils';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import Alert from 'react-s-alert';
import moment from 'moment';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import ZaloShareButton from '../../../components/ZaloShareButton';

const localePoll = window.locale.Poll;
class DetailPoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: {},
      totalComment: 0,
      quantityLike: 0,
      islike: 'fa-heart-o',
    };
  }
  componentDidMount() {
    this.getPoll();
    this.countComment();
  }
  countComment() {
    requestAPI({
      url: APIs.article.quantityCommentArticle.url,
      method: APIs.article.quantityCommentArticle.method,
      dataForm: {
        object_id: this.state.poll.id,
        type: 'poll',
      },
    }).then(res => {
      if(res.success){
        this.setState({totalComment: res.data})
      }
    });
  }
  getPoll(){ 
    const url = APIs.poll.getPollDetail.url.replace('{pollId}', this.props.object_id);
    requestAPI({
      url,
      method: APIs.poll.getPollDetail.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          poll: res.data,
          islike: res.data.islike,
          quantityLike: res.data.quantityLike,
        });
      }
    }).catch(error => {
      if (!error.success) {
        Alert.error(error.message)
      }
    })
  }
  toggleBookmarkPoll = () => {
    this.props.removeBookmark(this.state.poll.id, 'poll');
  }
  likePoll = () =>{
    requestAPI({
      url: APIs.article.like.url,
      method: APIs.article.like.method,
      dataForm: {
        object_id: this.state.poll.id,
        type: 'poll',
      },
    }).then(res => {
      if (res.success) {
        if(res.data.created){
          this.setState({
            islike: 'fa-heart',
            quantityLike: res.data.quantity,
          });
        }else{
          this.setState({
            islike: 'fa-heart-o',
            quantityLike: res.data.quantity,
          });
        }
      }
    })
  }
  render() {
    const { poll } = this.state;
    if (isEmpty(poll)) {
      return null;
    }
    const name = poll.name !== '' ? poll.name : poll.question.question ;
    return(
      <div className="item-box-boomark">
        <div className="box-main-boomark">
          <div className="box-img-bookmark-poll">
            <img src={poll.user.fullAvatar}  alt={poll.user.name}/>
          </div>
          <ul className="list-inline owner">
            <li><strong>{poll.user.name}</strong></li>
            <li>{moment(new Date(poll.created_at.date ? poll.created_at.date : poll.created_at)).format("DD/MM/YYYY") }</li>
            {
              poll.isExpired ? 
              <li className="isExpired">
                {localePoll.EXPIRED_YES}
              </li> : ''
            }
          </ul>
        </div>
        <div className="main-bookmark-poll">
          <a role="button" title={localePoll.SHOW_POLL} href={poll.shareSocial}>
            <p>{name}</p>
          </a>
        </div>
        <div className="main-box-icon-bookmark-poll">
          <ul className="list-inline ul-user-share">
            <li className="pull-right">
              <a
                role="button"
                title={this.props.localeBookmark.BOOKMARK_EMTY}
                className="link"
                onClick={this.toggleBookmarkPoll}
              >
                <span>{this.props.localeBookmark.BOOKMARK_EMTY}</span>
              </a>
            </li>
            <li className="icon">
              <a onClick={this.likePoll} title={localePoll.LIKE_POLL}>
                <i className={`fa ${this.state.islike}`} aria-hidden="true"></i> {this.state.quantityLike >= 100 ? this.state.quantityLike : '' }
              </a>
            </li>
            <li className="icon">
              <a href={poll.share+'#box-comment-father'} title={localePoll.COMMENT_POLL}>
                <i className="fa fa-comments" aria-hidden="true"></i> {this.state.totalComment >= 100 ? this.state.totalComment : ''}
              </a>
            </li>
            {
              poll.isShare ?
                  <li className="icon">
                    <div className="dropdown box-icon-share">
                        <a data-toggle="dropdown" className="dropdown-toggle " title={localePoll.SHARE_ON}>
                            <i className="fa fa-share-alt"></i>
                        </a>
                        <ul className="dropdown-menu list-inline list-icon">
                            <li>
                              <FacebookShareButton
                                url={poll.share}
                              >
                                <FacebookIcon
                                  size={35}
                                  round
                                />
                              </FacebookShareButton>
                            </li>
                            <li>
                              <ZaloShareButton
                                url={poll.share}
                              />
                            </li>
                            <li>
                              <TwitterShareButton
                                url={poll.share}
                              >
                                <TwitterIcon
                                  size={35}
                                  round
                                />
                              </TwitterShareButton>
                            </li>
                        </ul>
                    </div>
                </li>
               : ''
            }
        </ul>
        </div>
        <div className="line-item-bookmark"></div>
      </div>
    )
  }
}
DetailPoll = connect((state, ownProps) => ({
  ...ownProps,
}))(DetailPoll)

export default DetailPoll;
