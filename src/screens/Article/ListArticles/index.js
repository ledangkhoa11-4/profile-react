import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { APIs } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import Layout from 'components/Layout';
import BottomLoading from 'components/BottomLoading';
import Article from './Article';
import { CHILD_ROUTE_PATH } from 'services/config';
import { updatePageTitle } from 'actions/ui';
import { INPUT_NAME } from 'services/constant';
import SearchForm from './SearchForm'
const { SEARCH } = INPUT_NAME.SEARCH_PROJECT_FORM;
class ListArticlesContent extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      next_page_url: '',
      isBottomLoading: false,
      totalBookmarked: 0,
      [SEARCH]: '',
      categoryId: '',
      categories: [],
      isload: false,
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleLoadmore)
    this.props.updatePageTitle(this.props.localeCommon.ARTICLE_PAGE)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleLoadmore)
  }

  componentDidMount() {
    const { history: { location: { state } } } = this.props
    const categoryId = state && state.categorId ? state.categorId : ''
    this.filterWithCategory(categoryId)
    this.getCategories()
    this.getUserBookmarked()
  }

  filterWithCategory = (categoryId) => {
    let url = categoryId ?
      `${APIs.article.getListArticles.url}?categories=${categoryId}` :
      APIs.article.getListArticles.url
    
    if (this.state[SEARCH]) {
      url = url + (url.indexOf('?') > -1 ? '&s=' : '?s=') + this.state[SEARCH]
    }

    this.getListArticles({url, isReset: true, isShowPageLoading: true})
  }

  getCategories() {
    requestAPI({
      url: APIs.article.getCategoryArticle.url,
      method: APIs.article.getCategoryArticle.method,
    }).then(res => {
      if (res.success) {
        const { history: { location: { state } } } = this.props
        const categories = res.data.map(item => ({
          ...item,
          value: item.id,
          label: item.name
        }))
        categories.unshift({
          value: '',
          label: 'Article categories'
        })
        const _state = { categories }

        if (state && state.categoryId) {
          _state.categoryId = state.categoryId
        }

        this.setState(_state)
      }
    })
  }
  
  getListArticles({url, isShowPageLoading, isReset}) {
  
    requestAPI({
      url,
      method: APIs.article.getListArticles.method,
      isShowPageLoading,
    }).then(res => {
      if (res.success) {
        const data = res.data;
        const articles = isReset ? data.data :
          [...this.state.articles, ...data.data]
        this.setState({
          articles,
          isBottomLoading: false,
          next_page_url: data.next_page_url,
        });
      }
    })
  }

  getUserBookmarked() {
    const { getListBookmarks } = APIs.article;
    requestAPI({
      url: getListBookmarks.url,
      method: getListBookmarks.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          totalBookmarked: res.data.total,
        })
      }
    })
  }

  handleLoadmore = async () => {
    await onScroll();
    if (this.state.next_page_url) {
      this.setState({
        isBottomLoading: true,
      }, () => {
        this.getListArticles({
          url: this.state.next_page_url,
          isShowPageLoading: false
        });
      });
    }
  }

  renderList() {
    const list = this.state.articles;
    const articles = [];
    let row;
    for (let i = 0, l = list.length; i < l; i += 2) {
      row = <div className="row-article" key={i}>
        <Article
          index={(i + 1)}
          article={list[i]}
          gotoArticleDetail={this.gotoArticleDetail}
          filterWithCategory={this.filterWithCategory}
        />
        {
          list[i + 1] ? 
            <Article
              index={(i + 2)}
              article={list[i + 1]}
              gotoArticleDetail={this.gotoArticleDetail}
              filterWithCategory={this.filterWithCategory}
            /> : null
        }
      </div>;
      articles.push(row);
    }
    if (list.length===0) {
      return(
        <div className="notification">
          <div className="text">
            {window.locale.Article.NOT_HAVE_ARTICLE}
          </div>
        </div>
      )
    }

    return articles;
  }

  gotoArticleDetail = (id) => {
    const url = CHILD_ROUTE_PATH.ARTICLE_DETAIL
      .replace(':articleId', id)
    this.props.history.push(url)
  }

  handleChangeCategory = async (val) => {
    const categoryId = val ? val.value : ''
    await this.setState({ categoryId })
    this.filterWithCategory(categoryId)
  }

  onChangeSearch = (evt) =>{
    this.setState({
      [SEARCH]: evt.target.value,
    })
  }

  onSubmitForm = (evt) =>{
    evt.preventDefault();
    this.filterWithCategory(this.state.categoryId)
  }

  onClickSearch = (evt) => {
    this.onSubmitForm(evt)
  }

  renderBookmarkedCount() {
    if (!this.state.totalBookmarked) {
      return null;
    }
    
    return (
      <div className="wrap ">
        <a role="button" title="list bookmarked" className="btn" onClick={() => {
          this.props.history.push(CHILD_ROUTE_PATH.ARTICLE_BOOKMARK)
        }}>
          <span className="material-icons">bookmark</span>
          <span className="text">
            {this.props.localeArticle.YOUR_BOOKMARK}
            <span className="num">({this.state.totalBookmarked})</span>
          </span>
        </a>
        <SearchForm
          formState={this.state}
          onSubmitForm={this.onSubmitForm}
          onChangeSearch={this.onChangeSearch}
          onClickSearch={this.onClickSearch}
          handleChangeCategory={this.handleChangeCategory}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="box-detail-article ">
        <div className="inner">
          { this.renderBookmarkedCount()}
          { this.renderList() }
          {
            this.state.isBottomLoading ?
              <BottomLoading/> : null
          }
        </div>
      </div>
    )
  }
}

ListArticlesContent = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(ListArticlesContent)

const ListArticles = (props) => {
  return (
    <Layout
      index={7}
      title="Articles"
      menuIcon="art_track"
      mainContent={withRouter(() => {
        return <ListArticlesContent {...props}/>
      })}
    />
  )
}

export default ListArticles;
