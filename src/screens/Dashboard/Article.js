import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import { CHILD_ROUTE_PATH } from 'services/config';

class Article extends Component {
  render() {
    if (!this.props.listArticles.length) {
      return null
    }
  
    return (
      <div className="detail full ">
        {
          map(this.props.listArticles, (article, idx) => {
            const thumb = article.thumb ? article.thumb :
              require('assets/images/no-thumbnail.jpg')
            const isFirstItem = idx === 0 ? true : false;
            const articleClass = isFirstItem ? 'article large' : 'article';
            return (
              <div className={articleClass} key={idx}>
                <div className="banner">
                  <img src={thumb} alt={article.title}/>
                </div>
                <div className="content">
                  <Link
                    to={CHILD_ROUTE_PATH.ARTICLE_DETAIL.replace(':articleId', article.id)}
                  >
                    <h3>{article.title}</h3>
                  </Link>
                  {
                    isFirstItem ?
                      <p className="date">
                        {
                          //cut string
                          article.created_at.split(' ')[0]
                        }
                      </p> : null
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Article;
