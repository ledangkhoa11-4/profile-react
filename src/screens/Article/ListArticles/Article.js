import React from 'react';
import PropTypes from 'prop-types';

const Article = (props) => {
  const { article } = props;
  // const thumbnail = article.thumb || require('assets/images/no-thumbnail.jpg');

  return (
    <div className="item-article">
      <a role="button" title="Smoothie Factory" onClick={() => {
        props.gotoArticleDetail(article.id);
      }}>       
        <div className="thumb">
          <img
            src={article.thumb}
            alt="article thumbnail"
          />
        </div>
        <div className="text">
          <span
            className="text"
            onClick={(evt) => {
              evt.preventDefault()
              evt.stopPropagation()
              if (article.categories) {
                props.filterWithCategory(article.categories.id)
              }
            }}
          >
            {
              article.categories ?
                article.categories.name : ''
            }
          </span>
        </div>
        <div className="desc"> 
          <h3>{ article.title }</h3>
          <p>                  
            { article.description }
          </p>
        </div>
      </a>
    </div>
  )
}

Article.propTypes = {
  article: PropTypes.object.isRequired,
  gotoArticleDetail: PropTypes.func.isRequired,
}

export default Article;
