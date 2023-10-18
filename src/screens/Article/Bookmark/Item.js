import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { APIs, ROUTER_PATH } from 'services/config';
import { removeScriptTagInString, requestAPI } from 'services/utils';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';

const { 
  addBookmark,
  removeBookmark,
} = APIs.article;

class DetailArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      isBookmarked: false,
      totalComment: 0,
    };
    this.articleId = this.props.article_id;
    this.hasInitFBSDK = false;
    this.timeout = 0;
  }
  componentDidMount() {
    this.getArticle()
    this.countComment()
  }
  getArticle() {
    const url = APIs.article.getArticleDetail.url.replace('{articleId}', this.props.article_id);
    
    requestAPI({
      url,
      method: APIs.article.getArticleDetail.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          article: res.data,
          isBookmarked: !!res.data.bookmark.length,
        });
      }
    }).catch(error => {
      if (!error.success) {
        this.props.history.replace(ROUTER_PATH.ARTICLE)
      }
    })
  }
  // toggleBookmarkArticle = () => {
  //   this.state.isBookmarked ? this.removeBookmark() : this.addBookmark();
  // }

  addBookmark() {
    requestAPI({
      url: addBookmark.url,
      method: addBookmark.method,
      dataForm: {
        article_id: this.articleId,
      },
    }).then(res => {
      this.setState({isBookmarked: !this.state.isBookmarked})
    });
  }
  removeBookmark() {
    requestAPI({
      url: removeBookmark.url.replace('{articleId}', this.props.article_id),
      method: removeBookmark.method,
    }).then(res => {
      this.setState({isBookmarked: !this.state.isBookmarked})
    });
  }
  countComment() {
    requestAPI({
      url: APIs.article.countCommentArticle.url,
      method: APIs.article.countCommentArticle.method,
      dataForm: {
        article_id: this.articleId,
      },
    }).then(res => {
      if(res.success){
        this.setState({totalComment: res.data})
      }
    });
  }
  render() {
    const { article } = this.state;

    if (isEmpty(article)) {
      return null;
    }
    const activeBookmarked = this.state.isBookmarked ? 'active' : '';
    const thumbnail = article.thumb || require('assets/images/no-thumbnail.jpg');
    const articleContent = removeScriptTagInString(article.content);
    return(
    <div>
      <a role="button" title ={article.title} href={article.share}>
        <div className="box-img-bookmark-article">
          <img src={thumbnail}  alt={article.title}/>
        </div>
      </a>
      <div className="main-bookmark-article">
      <a role="button" title ={article.title} href={article.share}>
        <p>{article.title}</p>
      </a>
      <span>{article.description}</span>
      <ul className="list-inline ul-user-share">
          <li className="li-621px">
            <span>{article.user.name}<br/>{article.created_at}</span>
          </li>
          <li className="pull-right">
          {this.state.isBookmarked ?
            <a
                role="button"
                title={this.props.localeArticle.BOOKMARK_EMTY}
                className={`link ${activeBookmarked}`}
                onClick={this.toggleBookmarkArticle}
            >
              <span>{this.props.localeArticle.BOOKMARK_EMTY}</span>
            </a>:
            <a
            role="button"
            title={this.props.localeArticle.BOOKMARK}
            className={`link ${activeBookmarked}`}
            onClick={this.toggleBookmarkArticle}
            >
              <span>{this.props.localeArticle.BOOKMARK}</span>
            </a>
          }
          </li>
          <li className="pull-right">
            <a href={article.share} title={article.title}>
              <i className="fa fa-comments" aria-hidden="true"></i> {this.state.totalComment}
            </a>
          </li>
          {/* <li className="pull-right"><i className="fa fa-heart" aria-hidden="true"></i> 116
          </li> */}
      </ul>
      </div>
    </div>
    )
  }
}
DetailArticle = connect((state, ownProps) => ({
  ...ownProps,
}))(DetailArticle)
const Item = (props) => {
  // const date = new Date(props.created_at).toDateString().split(' ')
  // const articleUrl = CHILD_ROUTE_PATH.ARTICLE_DETAIL
  //   .replace(':category', 'temp_catgory')
  //   .replace(':articleId', props.article_id)
  return (
    <div className="box-bookmark">
      <DetailArticle
      article_id={props.article.id}
      {...props}/>
  </div>
  )
}
Item.propTypes = {
  article: PropTypes.object,
  article_id: PropTypes.number,
  created_at: PropTypes.string,
}

export default withRouter(Item);
