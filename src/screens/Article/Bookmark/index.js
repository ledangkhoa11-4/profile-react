import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { filter } from 'lodash';
import Layout from 'components/Layout';
import ListBookmarks from './ListBookmarks';
import { APIs } from 'services/config';
import { onScroll, requestAPI } from 'services/utils';
import { updatePageTitle } from 'actions/ui';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

class BookmarkContainer extends Component {
  constructor() {
    super();
    this.state = {
      next_page_url: '',
      indexTab: 0,
      isBottomLoading: false,
      bookmarks: [],
    }
  }
  componentWillMount() {
    window.addEventListener('scroll', this.handleLoadmore);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleLoadmore);
  }
  componentDidMount() {
    this.getListBookmarks(APIs.article.getListBookmarks.url);
  }

  getListBookmarks(url, isShowPageLoading) {
    requestAPI({
      url,
      method: APIs.article.getListBookmarks.method,
      isShowPageLoading,
    }).then(res => {
      if (res.success) {
        this.setState({
          bookmarks: [...this.state.bookmarks, ...res.data.data],
          isBottomLoading: false,
          next_page_url: res.data.next_page_url,
        });
      }
    });
  }

  removeBookmark = (articleId) => {
    const { removeBookmark } = APIs.article;
    requestAPI({
      url: removeBookmark.url.replace('{articleId}', articleId),
      method: removeBookmark.method,
    }).then(res => {
      if (res.success) {
        const bookmarks = filter(this.state.bookmarks, bookmark => {
          return articleId !== bookmark.article_id
        })
        this.setState({ bookmarks }, () => {
          if (!this.state.bookmarks.length) {
            this.goBack()
          }
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
        this.getListBookmarks(this.state.next_page_url, false);
      }); 
    }
  }
  goBack = () => {
    this.props.history.goBack()
  }
  onChangeIndex = (indexTab) => {
    if (indexTab === this.state.indexTab) {
      return;
    }
    this.setState({ indexTab });
  }
  render() {
    if (!this.state.bookmarks.length) {
      return null;
    }
    const tabsClass = [undefined, undefined, undefined];
    const tabsPanelClass = ['hidden box-dashboard', 'hidden box-dashboard', 'hidden box'];
    tabsClass[this.state.indexTab] = 'active';
    tabsPanelClass[this.state.indexTab] = tabsPanelClass[this.state.indexTab].replace('hidden', 'tab-content');
    return (
      <div>
        <Tabs
          className="box-tab"
          selectedIndex={this.state.indexTab}
          onSelect={this.onChangeIndex}
        >
          <div className="outer">
            <div className="inner">
              <div className="list-tab style-1">
                <TabList className="pull-left">
                  <Tab className={tabsClass[0]}>
                    <a role="button" title="Poll">Bài viết ({this.state.bookmarks.length})</a>
                  </Tab>
                  <Tab className={tabsClass[1]}>
                    <a role="button" title="Survey">Câu hỏi</a>
                  </Tab>
                  <Tab className={tabsClass[2]}>
                    <a role="button" title="Survey">Khảo sát</a>
                  </Tab>
                </TabList>
              </div>
            </div>
          </div>
          <div className="outer">
            <div className="inner">
              <TabPanel className={tabsPanelClass[0]}>
                <ListBookmarks
                  bookmarks={this.state.bookmarks}
                  goBack={this.goBack}
                  localeArticle={this.props.localeArticle}
                  isBottomLoading={this.state.isBottomLoading}
                  removeBookmark={this.removeBookmark}
                />
              </TabPanel>
              <TabPanel className={tabsPanelClass[1]}>
                <ListBookmarks
                  bookmarks={this.state.bookmarks}
                  goBack={this.goBack}
                  localeArticle={this.props.localeArticle}
                  isBottomLoading={this.state.isBottomLoading}
                  removeBookmark={this.removeBookmark}
                />
              </TabPanel>
              <TabPanel className={tabsPanelClass[2]}>
                <ListBookmarks
                  bookmarks={this.state.bookmarks}
                  goBack={this.goBack}
                  localeArticle={this.props.localeArticle}
                  isBottomLoading={this.state.isBottomLoading}
                  removeBookmark={this.removeBookmark}
                />
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </div>
      
    )
  }
}

BookmarkContainer = connect((state, ownProps) => ({
  ...ownProps,
}), {
  updatePageTitle,
})(BookmarkContainer)

const Bookmark = (props) => {
  return (
    <Layout
      index={7}
      title="Articles > Bookmark"
      menuIcon="art_track"
      mainContent={withRouter((routerProps) => {
        return <BookmarkContainer
          {...props}
          {...routerProps}
        />
      })}
    />
  )
}

export default Bookmark;
