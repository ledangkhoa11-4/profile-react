import React, { Component } from 'react';
import { APIs, BASE_URL } from 'services/config';
import { requestAPI } from 'services/utils';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import moment from 'moment';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import ZaloShareButton from '../../../components/ZaloShareButton';
const localeSurvey = window.locale.Survey;
class DetailSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: {},
      totalComment: 0,
      quantityLike: 0,
      islike: 'fa-heart-o',
    };
  }
  componentDidMount() {
    this.getSurvey();
    this.countComment();
  }
  countComment() {
    requestAPI({
      url: APIs.article.quantityCommentArticle.url,
      method: APIs.article.quantityCommentArticle.method,
      dataForm: {
        object_id: this.state.survey.id,
        type: 'survey',
      },
    }).then(res => {
      if(res.success){
        this.setState({totalComment: res.data})
      }
    });
  }
  getSurvey(){
    const url = APIs.survey.getSurveyDetail.url.replace('{surveyId}', this.props.object_id);
    requestAPI({
      url,
      method: APIs.survey.getSurveyDetail.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          survey: res.data,
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
  toggleBookmarkSurvey = () => {
    this.props.removeBookmark(this.state.survey.id, 'survey');
  }
  likeSurvey = () =>{
    requestAPI({
      url: APIs.article.like.url,
      method: APIs.article.like.method,
      dataForm: {
        object_id: this.state.survey.id,
        type: 'survey',
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
    const img_start = BASE_URL + '/assetsnew/img/capture.png';
    const { survey } = this.state;
    if (isEmpty(survey)) {
      return null;
    }
    return(
      <div className="item-box-boomark">
      <div className="box-main-boomark">
        <div className="box-img-bookmark-poll">
          <img src={survey.user.fullAvatar}  alt={survey.user.name}/>
        </div>
        <ul className="list-inline owner">
          <li><strong>{survey.user.name}</strong></li>
          <li>{moment(new Date(survey.created_at.date ? survey.created_at.date : survey.created_at)).format("DD/MM/YYYY") }</li>
          {
            survey.isExpired ? 
            <li className="isExpired">
              {localeSurvey.EXPIRED}
            </li> : ''
          }
        </ul>
        <div className="box-img-point">
          <img src={img_start}  alt={img_start}/>
          <div className="point-survey">{survey.point}</div>
        </div>
      </div>
      <div className="main-bookmark-poll">
        <a role="button" title={survey.name} href={survey.shareSocial}>
          <p>{survey.name}</p>
        </a>
      </div>
      <div className="main-box-icon-bookmark-survey">
        <ul className="list-inline ul-user-share">
          <li className="pull-left">
            <a role="button" href={survey.shareSocial} title={this.props.localeBookmark.JOIN_NOW} className="link">
              {this.props.localeBookmark.JOIN_NOW}
            </a>
          </li>
          <li className="pull-right">
            <a
              role="button"
              title={this.props.localeBookmark.BOOKMARK_EMTY}
              className="link"
              onClick={this.toggleBookmarkSurvey}
            >
              <span>{this.props.localeBookmark.BOOKMARK_EMTY}</span>
            </a>
          </li>
          {
            survey.isShare ?
                <li className="pull-right">
                  <div className="dropdown box-icon-share">
                      <a data-toggle="dropdown" className="dropdown-toggle " title={localeSurvey.SHARE_ON}>
                          <i className="fa fa-share-alt"></i>
                      </a>
                      <ul className="dropdown-menu list-inline list-icon">
                          <li>
                            <FacebookShareButton
                              url={survey.share}
                            >
                              <FacebookIcon
                                size={35}
                                round
                              />
                            </FacebookShareButton>
                          </li>
                          <li>
                            <ZaloShareButton
                              url={survey.share}
                            />
                          </li>
                          <li>
                            <TwitterShareButton
                              url={survey.share}
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
          <li className="pull-right">
            <a href={survey.share+'#box-comment-father'} title={localeSurvey.COMMENT_SURVEY}>
              <i className="fa fa-comments" aria-hidden="true"></i> {this.state.totalComment >= 100 ? this.state.totalComment : ''}
            </a>
          </li>
          <li className="pull-right">
            <a onClick={this.likeSurvey} title={localeSurvey.LIKE_SURVEY}>
              <i className={`fa ${this.state.islike}`} aria-hidden="true"></i> {this.state.quantityLike >= 100 ? this.state.quantityLike : ''}
            </a>
          </li>
      </ul>
      </div>
      <div className="line-item-bookmark"></div>
    </div>
    )
  }
}
DetailSurvey = connect((state, ownProps) => ({
  ...ownProps,
}))(DetailSurvey)


export default DetailSurvey;
