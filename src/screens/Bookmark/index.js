import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import ListBookmarks from './ListBookmarks';
import ListBookmarksPoll from './poll';
import ListBookmarksSurvey from './survey';
import { APIs } from 'services/config';
import { requestAPI } from 'services/utils';
import { updatePageTitle } from 'actions/ui';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import Alert from 'react-s-alert';

const localeArticle = window.locale.Article;
const localeCommon = window.locale.Common;
const localeBookmark = window.locale.Bookmark;
class BookmarkContainer extends Component {
  constructor() {
    super();
    this.state = {
      indexTab: 0,
      bookmarksArticle: [],
      bookmarksPoll: [],
      bookmarksSurvey: [],
    }
  }
  componentDidMount() {
    this.getListBookmarksArticle();
    this.getListBookmarksPoll();
    this.getListBookmarksSurvey();
  }
  getListBookmarksArticle() {
    requestAPI({
      url: APIs.article.getListBookmarks.url,
      method: APIs.article.getListBookmarks.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          bookmarksArticle: [...this.state.bookmarksArticle, ...res.data],
        });
      }
    });
  }
  getListBookmarksPoll() {
    requestAPI({
      url: APIs.poll.getListBookmarks.url,
      method: APIs.poll.getListBookmarks.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          bookmarksPoll: [...this.state.bookmarksPoll, ...res.data],
        });
      }
    });
  }
  getListBookmarksSurvey() {
    requestAPI({
      url: APIs.survey.getListBookmarks.url,
      method: APIs.survey.getListBookmarks.method,
    }).then(res => {
      if (res.success) {
        this.setState({
          bookmarksSurvey: [...this.state.bookmarksSurvey, ...res.data],
        });
      }
    });
  }
  removeBookmark = (ID, istype) => {
    const { removeBookmark } = APIs.article;
    requestAPI({
      url: removeBookmark.url.replace('{articleId}', ID),
      method: removeBookmark.method,
      dataForm: {
        type: istype,
      },
    }).then(res => {
      if (res.success) {
        switch (istype) {
          case 'article':
            this.setState({ 
              bookmarksArticle: [],
             });
            this.setState({
              bookmarksArticle: res.data,
             });
            break;
          case 'poll':
              this.setState({ 
                bookmarksPoll: [],
               });
              this.setState({
                bookmarksPoll: res.data,
               });
              break;
            case 'survey':
              this.setState({ 
                bookmarksSurvey: [],
               });
              this.setState({
                bookmarksSurvey: res.data,
               });
              break;
          default:
              Alert.error(localeCommon.SOMETHING_WRONG)
            break;
        }
       
      }
    })
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
    const tabsClass = [undefined, undefined, undefined];
    const tabsPanelClass = ['hidden box-dashboard', 'hidden box-dashboard', 'hidden box-dashboard'];
    tabsClass[this.state.indexTab] = 'active';
    tabsPanelClass[this.state.indexTab] = tabsPanelClass[this.state.indexTab].replace('hidden', 'tab-content');
    return (
      <div>
        <Tabs
          className="box-tab box-main-setting"
          selectedIndex={this.state.indexTab}
          onSelect={this.onChangeIndex}
        >
          <div className="outer">
            <div className="inner">
              <div className="list-tab-bookmark">
                <TabList className="pull-left list-inline">
                  <Tab className={tabsClass[0]}>
                    <a role="button" title={localeCommon.TITLE_TAB_ARTICLE}>{localeCommon.TITLE_TAB_ARTICLE} ({this.state.bookmarksArticle.length})</a>
                  </Tab>
                  <Tab className={tabsClass[1]}>
                    <a role="button" title={localeCommon.TITLE_TAB_POLL}>{localeCommon.TITLE_TAB_POLL} ({this.state.bookmarksPoll.length})</a>
                  </Tab>
                  <Tab className={tabsClass[2]}>
                    <a role="button" title={localeCommon.TITLE_TAB_SURVEY}>{localeCommon.TITLE_TAB_SURVEY} ({this.state.bookmarksSurvey.length})</a>
                  </Tab>
                </TabList>
              </div>
            </div>
          </div>
          <div className="outer ">
            <div className="inner">
              <TabPanel className={tabsPanelClass[0]}>
                <ListBookmarks
                  bookmarks={this.state.bookmarksArticle}
                  goBack={this.goBack}
                  localeArticle={localeArticle}
                  localeBookmark={localeBookmark}
                  removeBookmark={this.removeBookmark}
                />
              </TabPanel>
              <TabPanel className={tabsPanelClass[1]}>
                <ListBookmarksPoll
                  bookmarks={this.state.bookmarksPoll}
                  goBack={this.goBack}
                  localeArticle={localeArticle}
                  localeBookmark={localeBookmark}
                  removeBookmark={this.removeBookmark}
                />
              </TabPanel>
              <TabPanel className={tabsPanelClass[2]}>
                <ListBookmarksSurvey
                  bookmarks={this.state.bookmarksSurvey}
                  goBack={this.goBack}
                  localeCommon={localeCommon}
                  localeArticle={localeArticle}
                  localeBookmark={localeBookmark}
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
      title="Bookmark"
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
