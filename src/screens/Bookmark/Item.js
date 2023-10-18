import React, { Component } from 'react';
import { APIs } from 'services/config';
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
import ZaloShareButton from '../../components/ZaloShareButton';
class DetailArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      totalComment: 0,
      quantityLike: 0,
      islike: 'fa-heart-o',
    };
  }
  componentDidMount() {
    this.getArticle()
    this.countComment()
  }
  getArticle() {
    const url = APIs.article.getArticleDetail.url.replace('{articleId}', this.props.object_id);
    requestAPI({
      url,
      method: APIs.article.getArticleDetail.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          article: res.data,
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
  countComment() {
    requestAPI({
      url: APIs.article.quantityCommentArticle.url,
      method: APIs.article.quantityCommentArticle.method,
      dataForm: {
        object_id: this.state.article.id,
        type: 'article',
      },
    }).then(res => {
      if(res.success){
        this.setState({totalComment: res.data})
      }
    });
  }
  toggleBookmarkArticle = () => {
    this.props.removeBookmark(this.state.article.id, 'article');
  }
  likeArticle = () =>{
    requestAPI({
      url: APIs.article.like.url,
      method: APIs.article.like.method,
      dataForm: {
        object_id: this.state.article.id,
        type: 'article',
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
    const { article } = this.state;
    if (isEmpty(article)) {
      return null;
    }
    const thumbnail = article.thumb || require('assets/images/no-thumbnail.jpg');
    const shareSocial = `${article.share}`;
    return(
    <div className="item-box-boomark">
      <a role="button" title ={article.title} href={article.share}>
        <div className="box-img-bookmark-article">
          <img src={thumbnail}  alt={article.title}/>
        </div>
      </a>
      <div className="main-bookmark-article">
      <a role="button" title ={this.props.localeArticle.SHOW_ARTICLE} href={article.share}>
        <p>{article.title}</p>
      </a>
      <span>{article.description}</span>
      <ul className="list-inline ul-user-share">
          <li className="li-621px">
            <span>{article.user.name}<br/>{moment(new Date(article.created_at.date ? article.created_at.date : article.created_at)).format("DD/MM/YYYY") }</span>
          </li>
          <li className="pull-right">
            <a
              role="button"
              title={this.props.localeBookmark.BOOKMARK_EMTY}
              className="link"
              onClick={this.toggleBookmarkArticle}
            >
              <span>{this.props.localeBookmark.BOOKMARK_EMTY}</span>
            </a>
          </li>
          <li className="pull-right">
              <div className="dropdown box-icon-share">
                  <a data-toggle="dropdown" className="dropdown-toggle " title={this.props.localeArticle.SHARE_ARTICLE}>
                      <i className="fa fa-share-alt"></i>
                  </a>
                  <ul className="dropdown-menu list-inline list-icon">
                      <li>
                        <FacebookShareButton
                          url={shareSocial}
                        >
                          <FacebookIcon
                            size={35}
                            round
                          />
                        </FacebookShareButton>
                      </li>
                      <li>
                        <ZaloShareButton
                          url={shareSocial}
                        />
                      </li>
                      <li>
                        <TwitterShareButton
                          url={shareSocial}
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
          <li className="pull-right">
            <a href={article.share+'#box-comment-father'} title={this.props.localeArticle.COMMENT_ARTICLE}>
              <i className="fa fa-comments" aria-hidden="true"></i> {this.state.totalComment >= 100 ? this.state.totalComment : ''}
            </a>
          </li>
          <li className="pull-right">
            <a onClick={this.likeArticle} title={this.props.localeArticle.LIKE_ARTICLE}>
              <i className={`fa ${this.state.islike}`} aria-hidden="true"></i> {this.state.quantityLike >= 100 ? this.state.quantityLike : ''}
            </a>
          </li>
      </ul>
      </div>
    </div>
    )
  }
}
DetailArticle = connect((state, ownProps) => ({
  ...ownProps,
}))(DetailArticle)

export default DetailArticle;
