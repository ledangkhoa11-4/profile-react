import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import ZaloShareButton from '../../../components/ZaloShareButton'
import Layout from 'components/Layout';
import { removeScriptTagInString, requestAPI, trackingShare } from 'services/utils';
import { APIs, ROUTER_PATH } from 'services/config';
import { updatePageTitle } from 'actions/ui';
const { 
  addBookmark,
  removeBookmark,
} = APIs.article;

class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      isBookmarked: false,
    };
    this.articleId = this.props.match.params.articleId;
    this.hasInitFBSDK = false;
    this.timeout = 0;
  }
  
  componentWillMount () {
    this.props.updatePageTitle(this.props.localeCommon.ARTICLE_PAGE)
  }  

  componentDidMount() {
    this.initFacebookFunc()
    this.getArticle()
  }

  componentDidUpdate(prevProps, prevState) {
    if (window.FB && !this.hasInitFBSDK) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        window.FB.XFBML.parse();
        this.hasInitFBSDK = true;
      }, 700);
    }
  }

  gotoListArticleWithCategory = (categoryId) => {
    this.props.history.push({
      pathname: ROUTER_PATH.ARTICLE,
      state: {
        categoryId
      }
    })
  }

  initFacebookFunc() {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&cookie=1&version=v2.11";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  
  getArticle() {
    const url = APIs.article.getArticleDetail.url.replace('{articleId}', this.articleId);
    
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

  toggleBookmarkArticle = () => {
    // this.props.history.push(CHILD_ROUTE_PATH.ARTICLE_BOOKMARK);
    this.state.isBookmarked ? this.removeBookmark() : this.addBookmark();
  }

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
      url: removeBookmark.url.replace('{articleId}', this.articleId),
      method: removeBookmark.method,
    }).then(res => {
      this.setState({isBookmarked: !this.state.isBookmarked})
    });
  }

  render() {
    const { article } = this.state;

    if (isEmpty(article)) {
      return null;
    }

    const date = new Date(article.created_at);
    const activeBookmarked = this.state.isBookmarked ? 'active' : '';
    const thumbnail = article.thumb || require('assets/images/no-thumbnail.jpg');
    const articleContent = removeScriptTagInString(article.content);

    return (
      <div className="box-detail-article-detail ">
        <div className="inner">
          <div className="background"> 
            <div className="banner">
              <img src={ thumbnail } alt="article thumbnail"/>
            </div>
            <div className="text">
              <span
                className="category-name"
                onClick={(evt) => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  if (article.categories) {
                    this.gotoListArticleWithCategory(article.categories.id)
                  }
                }}
              >
                {
                  article.categories ?
                    article.categories.name : ''
                }
              </span>
            </div>
            <div className="article-title">
              <div className="title">
                <h2>{ article.title }</h2>
              </div>
              <div className="name"> 
                <h3>{this.props.localeArticle.BY}</h3>
                <a role="button" title={ article.user.name }>{ article.user.name },</a>
                <h3>{ date.toDateString() }</h3>
              </div>
            </div>
            <div
              className="editor"
              dangerouslySetInnerHTML={{__html: articleContent}}
            />
            <div className="list-check-social share-article">
              {/* <div className="title-share">
                {props.localePoll.SHARE_ON_RESULT}
              </div>  */}
              <ul className="list-icon">
                <li>
                  <FacebookShareButton
                    url={article.share}
                    beforeOnClick={() => {
                      trackingShare(this.props.match.params.articleId) 
                    }}
                  >
                    <FacebookIcon
                      size={35}
                      round
                    />
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton
                    beforeOnClick={() => {
                      trackingShare(this.props.match.params.articleId) 
                    }}
                    url={article.share}
                  >
                    <TwitterIcon
                      size={35}
                      round
                    />
                  </TwitterShareButton>
                </li>
                <li>
                  <GooglePlusShareButton
                    beforeOnClick={() => {
                      trackingShare(this.props.match.params.articleId) 
                    }}
                    url={article.share}
                  >
                    <GooglePlusIcon
                      size={35}
                      round
                    />
                  </GooglePlusShareButton>
                </li>
                <li>
                  <ZaloShareButton
                    onClick={() => {
                      trackingShare(this.props.match.params.articleId) 
                    }}
                    url={article.share}
                  />
                </li>
              </ul>
            </div>
            <div className="bookmark bottom">
              <a
                role="button"
                title={this.props.localeArticle.BOOKMARK}
                className={`link ${activeBookmarked}`}
                onClick={this.toggleBookmarkArticle}
              >
                <span className="material-icons">&#xE866;</span>
              </a>
            </div>
            <div className="bookmark top">
              <a
                role="button"
                title={this.props.localeArticle.BOOKMARK}
                className={`link ${activeBookmarked}`}
                onClick={this.toggleBookmarkArticle}
              >
                <span className="material-icons">&#xE866;</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="fb-comments"
          // data-href={}
          xid={article.id}
          data-numposts="5"
        />
      </div>
    )
  }
}

DetailContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(DetailContent)

const ArticleDetail = (props) => {
  return (
    <Layout
      index={7}
      title="Article"
      menuIcon="art_track"
      mainContent={withRouter(() => {
        return <DetailContent {...props}/>
      })}
    />
  )
}

export default ArticleDetail;
