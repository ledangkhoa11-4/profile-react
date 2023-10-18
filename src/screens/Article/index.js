import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ListArticles from './ListArticles';
import Bookmark from './Bookmark';
import ArticleDetail from './ArticleDetail';
import Page404 from '../Page404';
import { CHILD_ROUTE_PATH } from 'services/config';

const localeArticle = window.locale.Article;
const localeCommon = window.locale.Common;

const ArticlePage = (props) => (
    <Switch>
      <Route exact path={props.match.path} render={props => <ListArticles
        {...props}
        localeArticle={localeArticle}
        localeCommon={localeCommon}
      />}/>
      <Route
        path={CHILD_ROUTE_PATH.ARTICLE_BOOKMARK}
        render={props => <Bookmark
          {...props}
          localeArticle={localeArticle}
          localeCommon={localeCommon}
        />}
      />
      <Route
        path={`${CHILD_ROUTE_PATH.ARTICLE_DETAIL}`}
        render={props => <ArticleDetail
          {...props}
          localeArticle={localeArticle}
          localeCommon={localeCommon}
        />}
      />
      <Route component={Page404}/>
    </Switch>
);

export default ArticlePage;
